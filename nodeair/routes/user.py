from typing import Union

from core.db import get_db
from core.schemas import User
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter()


@router.post("/register", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=201
            )
async def register(
                user: RegisterUser, db: Session=Depends(get_db)
                ) -> Union[HTTPException, User]:

    if " " in user.name:
        return JSONResponse(
            status_code=400,
            content={"validation_error": "Name must not contain any spaces"}
        )

    get_user = db.query(User).filter_by(public_key=user.public_key).first()
    if get_user:
        return JSONResponse(
                        status_code=400, 
                        content={"validation_error": "Public key already registered"}
                        )    
    else:
        db_user = User(public_key=user.public_key, name=user.name)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


@router.post("/profile/{name}", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=201
            )
async def profile(
                name: str, 
                db: Session=Depends(get_db)
                ) -> Union[JSONResponse, User]:

        get_user = db.query(User).filter_by(name=name).first()

        if get_user:
            return get_user
        return JSONResponse(
            status_code=404,
            content="User not found"
        )
