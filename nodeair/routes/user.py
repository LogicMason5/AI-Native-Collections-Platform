from typing import Union

from core.db import get_db
from core.schemas import User
from core.models import RegisterUser
from core.ratelimit import RateLimit
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/register", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=201
            )
async def register(
                user: RegisterUser, db: Session=Depends(get_db)
                ) -> Union[HTTPException, User]:

    get_user = db.query(User).filter_by(public_key=user.public_key).first()
    if get_user:
        raise HTTPException(
                        status_code=400, 
                        detail="Public key already registered"
                        )    
    else:
        db_user = User(public_key=user.public_key, name=user.name)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user