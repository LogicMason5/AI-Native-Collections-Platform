from typing import Union
from aioredis import from_url
from fastapi import FastAPI, HTTPException
from fastapi.param_functions import Depends
from sqlalchemy.orm import Session

from schemas import User
from ratelimit import RateLimit, RateLimiter
from models import RegisterUser
from db import engine, SessionLocal, Base


app = FastAPI()

def get_db() -> None:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup() -> None:
    redis = await from_url("redis://localhost", encoding="utf8")
    await RateLimiter.init(redis)

@app.on_event("shutdown")
async def shutdown() -> None:
    await RateLimiter.close()



@app.get("/", dependencies=[Depends(RateLimit(times=20, seconds=1))])
async def root() -> dict:
    return {"message": "Welcome"}


@app.post("/register", dependencies=[Depends(RateLimit(times=20, seconds=5))])
async def register(
                user: RegisterUser, db: Session=Depends(get_db)
                ) -> Union[HTTPException, dict]:

    get_user = db.query(User).filter(
                User.public_key == user.public_key).first()

    if get_user:
        raise HTTPException(
                        status_code=400, 
                        detail="Public key already registered."
                        )
    else:
        db_user = User(username=user.username, public_key=user.public_key)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user