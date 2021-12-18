from typing import Callable, Optional
import aioredis
from fastapi import HTTPException, Request
from starlette.responses import Response


class RateLimiter:
    redis: aioredis.Redis = None
    prefix: str = None
    lua_sha: str = None
    identifier: Callable = None
    callback: Callable = None
    lua_script = """
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local expire_time = ARGV[2]
    local current = tonumber(redis.call('get', key) or "0")
    if current > 0 then
    if current + 1 > limit then
    return redis.call("PTTL",key)
    else
            redis.call("INCR", key)
    return 0
    end
    else
        redis.call("SET", key, 1,"px",expire_time)
    return 0
    end
    """

    async def default_identifier(request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip = forwarded.split(",")[0]
        else:
            ip = request.client.host
        return ip + ":" + request.scope["path"]

    async def default_callback(
                        request: Request, 
                        response: Response, 
                        expire: int
                        ) -> HTTPException:
        expire = round(expire/1000)
        raise HTTPException(429, "Too Many Requests", headers={"Retry-After": str(expire)}
            )

    @classmethod
    async def init(
            cls,
            redis: aioredis.Redis,
            prefix: str = "fastapi-limiter",
            identifier: Callable = default_identifier,
            callback: Callable = default_callback,
        ) -> None:
        cls.redis = redis
        cls.prefix = prefix
        cls.identifier = identifier
        cls.callback = callback
        cls.lua_sha = await redis.script_load(cls.lua_script)

    @classmethod
    async def close(cls) -> None:
        await cls.redis.close()


class Limit:
    def __init__(
            self,
            times: int = 1,
            milliseconds: int = 0,
            seconds: int = 0,
            minutes: int = 0,
            hours: int = 0,
            identifier: Optional[Callable] = None,
            callback: Optional[Callable] = None,
        ) -> None:
        self.times = times
        self.milliseconds = (milliseconds + 1000 * seconds + 
                            60000 * minutes + 3600000 * hours)
        self.identifier = identifier
        self.callback = callback

    async def __call__(self, request: Request, response: Response):
        if not RateLimiter.redis:
            raise Exception("You need to initialize RateLimiter in the startup event.")
        index = 0
        for route in request.app.routes:
            if route.path == request.scope["path"]:
                for idx, dependency in enumerate(route.dependencies):
                    if self is dependency.dependency:
                        index = idx
                        break

        identifier = self.identifier or RateLimiter.identifier
        callback = self.callback or RateLimiter.callback
        redis = RateLimiter.redis
        rate_key = await identifier(request)
        key = f"{RateLimiter.prefix}:{rate_key}:{index}"
        expire = await redis.evalsha(
            RateLimiter.lua_sha, 1, key, str(self.times), str(self.milliseconds)
        )
        if expire != 0:
            return await callback(request, response, expire)