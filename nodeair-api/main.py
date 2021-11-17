import os
from fastapi import FastAPI
from aioredis import from_url
from dotenv import load_dotenv
from fastapi.param_functions import Depends
from fastapi.middleware.cors import CORSMiddleware
from routes import user
from routes import signature
from core.db import engine, Base
from core.ratelimit import RateLimit, RateLimiter

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nodeair.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user.router)
app.include_router(signature.router)


@app.on_event("startup")
async def startup() -> None:
    if not os.environ.get("REDIS_URL"):
        raise KeyError("You must setup REDIS_URL environment variable.")

    redis = await from_url(os.environ["REDIS_URL"], encoding="utf8")
    await RateLimiter.init(redis)
    Base.metadata.create_all(bind=engine)


@app.on_event("shutdown")
async def shutdown() -> None:
    await RateLimiter.close()


@app.get("/", dependencies=[Depends(RateLimit(times=20, seconds=1))])
async def root() -> dict:
    return {"message": "Welcome"}


