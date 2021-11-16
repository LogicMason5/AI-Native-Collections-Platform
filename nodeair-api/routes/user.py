import os
from typing import Union

from core.db import get_db
from core.schemas import User
from core.webhook import Webhook, Embed
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends

router = APIRouter()


@router.post("/register", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=201
            )
async def register(
                user: RegisterUser, db: Session=Depends(get_db)
                ) -> Union[JSONResponse, User]:

    if " " in user.username:
        return JSONResponse(
            status_code=400,
            content={"error": "Username must not contain any spaces"}
        )

    get_user = db.query(User).filter(
                                    (User.username == user.username) |
                                    (User.public_key == user.public_key)
                                    ).first()
    if get_user:
        if get_user.public_key == user.public_key:
            field = "Public key"
        else:
            field = "Username"             
        return JSONResponse(
                status_code=400, 
                content={"error": f"{field} already registered"}
                )    
 
    else:
        db_user = User(public_key=user.public_key, username=user.username, name=user.username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        webhook = Webhook(os.getenv("WEBHOOK_URL"))
        embed = Embed(
            f"New registration!", 
            f"**{db_user.public_key}** registered with the name **{db_user.name}**"
            ).json()
        await webhook.send(embed=embed)
        return db_user


@router.get("/profile/{name}", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=201
            )
async def profile(
                name: str, 
                db: Session=Depends(get_db)
                ) -> Union[JSONResponse, User]:

    user = db.query(User).filter_by(name=name).first()

    if user: 
        return user
    return JSONResponse(
        status_code=404,
        content="User not found"
    )
