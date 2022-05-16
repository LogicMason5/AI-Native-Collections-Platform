import os
import httpx
import ipfsApi
from fastapi import FastAPI
from aioredis import from_url
from routes import user
from routes import checks
from routes import fetch
from routes import transactions
from routes import bookmark
from routes import profile
from dotenv import load_dotenv
from core.db import engine, Base
from fastapi.param_functions import Depends
from core.ratelimit import RateLimiter, Limit
from fastapi.middleware.cors import CORSMiddleware
from solathon import Client

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nodeair.io", "https://www.nodeair.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user.router)
app.include_router(checks.router)
app.include_router(fetch.router)
app.include_router(transactions.router)
app.include_router(bookmark.router)
app.include_router(profile.router)


@app.on_event("startup")
async def startup() -> None:
    if not os.environ.get("REDIS_URL"):
        raise KeyError("You must setup REDIS_URL environment variable.")

    redis = await from_url(os.environ["REDIS_URL"], encoding="utf8")
    await RateLimiter.init(redis)
    Base.metadata.create_all(bind=engine)
    app.request_client = httpx.AsyncClient()
    app.solana_client = Client(os.environ["SOL_NETWORK"])

@app.on_event("shutdown")
async def shutdown() -> None:
    await RateLimiter.close()
    await app.request_client.aclose()
    await app.solana_client.close()


@app.get("/", dependencies=[Depends(Limit(times=20, seconds=1))])
async def root() -> dict:
    return {"message": "Welcome"}


