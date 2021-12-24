import os
import string
from typing import Union
from core.db import get_db
from core.ratelimit import Limit
from core.webhook import Webhook
from sqlalchemy.orm import Session
from core.schemas import User
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from fastapi import Request

router = APIRouter()


@router.post("/register",
             dependencies=[Depends(Limit(times=20, seconds=5))],
             status_code=201
             )
async def register(
    user: RegisterUser, request: Request, db: Session = Depends(get_db)
        ) -> Union[JSONResponse, User]:

    transaction = await request.app.solana_client.get_confirmed_transaction(user.signature)
    try:
        keys = transaction["result"]["transaction"]["message"]["accountKeys"]
        if not set(["B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai",user.public_key]).issubset(keys):
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid signature"}
            )
    except Exception:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid signature."}
            )

    if user.username in ["about", "dashboard", "insights", "discover", "pricing", "edit", "settings", "notifications"]:
        return JSONResponse(
            status_code=400,
            content={"error": "You cannot keep this username"}
        )

    allowed_chars = ["_", "-", "0", "1","2","3","4","5","6","7","8","9"]
    allowed_letters = list(string.ascii_lowercase)
    allowed_chars.extend(allowed_letters)
    if len([i for i in user.username.lower() if i not in allowed_chars]) > 0:
        return JSONResponse(
            status_code=400,
            content={
                "error": "Username can only contain letters, numbers, '_' and '-'"}
        )

    get_user = db.query(User).filter((User.public_key == user.public_key) |
                                     (User.username == user.username)
                                     ).first()
    if get_user:
        if get_user.public_key == user.public_key:
            field = "Public key"
        else:
            field = "Username"
        return JSONResponse(
            status_code=400,
            content={"error": f"{field} already registered",
                     "username": get_user.username}
        )

    else:
        db_user = User(public_key=user.public_key,
                       username=user.username, name=user.username)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        webhook = Webhook(os.getenv("WEBHOOK_SECRET"))
        embed = Webhook.embed(
            "New registration",
            fields=[
                ("Profile",
                 f"[NodeAir.io/{db_user.username}](https://nodeair.io/{db_user.username})"),
                ("Public Key", db_user.public_key),
            ],
            thumbnail=db_user.avatar
        )
        await webhook.send(embed=embed)
        return db_user
