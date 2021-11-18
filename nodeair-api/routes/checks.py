import os
from typing import Union

from core.db import get_db
from core.schemas import User
from utils import lamport_to_sol
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from solana.rpc.async_api import AsyncClient
from core.webhook import Webhook, Embed


router = APIRouter()

@router.post("/check", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200
            )
async def check(
                user: RegisterUser, db: Session=Depends(get_db)
                ) -> JSONResponse:

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
        return JSONResponse(
            status_code=200
        )