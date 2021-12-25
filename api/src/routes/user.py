import os
import string
from typing import Union
from core.db import get_db
from core.ratelimit import Limit
from core.webhook import Webhook
from sqlalchemy.orm import Session
from core.schemas import User, Plan
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

    if (user.plan != 0):
        transaction = await request.app.solana_client.get_confirmed_transaction(user.signature)
        print("signature: ", user.signature)
        try:
            print("\ntransaction: ", transaction)
            keys = transaction["result"]["transaction"]["message"]["accountKeys"]
            print("publicKeys: ", keys, "\n")
            if not set(["B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai", user.public_key]).issubset(keys):
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

        db_plan = Plan(type=user.plan, signature=user.signature, owner_public_key=user.public_key)

        db.add(db_user)
        db.add(db_plan)
        db.commit()
        db.refresh(db_user)
        plans = {0: "Free", 2: "Yearly - $2", 6: "Yearly $6", 10: "Forever - $10", 15: "Forever - $15"}
        webhook = Webhook(os.getenv("WEBHOOK_SECRET"))
        embed = Webhook.embed(
            "New registration",
            fields=[
                ("Profile",
                 f"[{db_user.username}](https://nodeair.io/{user.username})"),
                ("Public Key", user.public_key),
                ("Plan", plans[user.plan]),
                ("Signature", user.signature if user.signature != None else "None")
            ],
            thumbnail=db_user.avatar,
            image=db_user.banner
        )
        await webhook.send(embed=embed)
        return db_user


@router.get("/plan/{public_key}",
             dependencies=[Depends(Limit(times=20, seconds=5))],
             status_code=200
             )
async def plan(
    public_key: str, db: Session = Depends(get_db)
        ) -> JSONResponse:

    plan_user = db.query(User).filter_by(public_key=public_key).first()
    if plan_user:
        return int(plan_user.plan[0].type)
    
    return JSONResponse(
        status_code=404,
        content={"error": "User not found"}
    )