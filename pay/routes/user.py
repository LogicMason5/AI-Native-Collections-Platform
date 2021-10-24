from typing import Union

from db import get_db
from schemas import User
from models import RegisterUser
from ratelimit import RateLimit
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()

@router.post("/register", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))]
            )
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