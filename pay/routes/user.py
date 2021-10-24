from typing import Union

from db import get_db
from schemas import User, Link
from models import RegisterUser
from ratelimit import RateLimit
from utils import random_username
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
        db_user = User(username=random_username(), public_key=user.public_key)
        db.add(db_user)
        db.flush() # Adding db_user to the session in order to access id
        db.add(Link(link=user.link, owner_id=db_user.id))
        db.commit()
        db.refresh(db_user)
        return db_user


@router.get("/{link}", dependencies=[Depends(RateLimit(times=30, seconds=1))])
async def pay(link: str, db: Session=Depends(get_db)):
    link_obj = db.query(Link).filter(link == Link.link).first()
    if link_obj:
        user = db.query(User).filter(User.id==link_obj.owner_id).first()
        link_obj.uses += 1
        db.commit()
        db.refresh(user)
        return user
    else:
        return {"message": "No one owns this link yet."}
