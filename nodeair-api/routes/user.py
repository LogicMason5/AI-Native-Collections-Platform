import os
from typing import Union

from fastapi import Request
from core.db import get_db
from core.schemas import User, View
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from core.webhook import Webhook, Embed
from utils import lamport_to_sol

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


@router.get("/profile/{username}", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200
            )
async def profile(
                username: str, 
                db: Session=Depends(get_db)
                ) -> Union[JSONResponse, User]:

    user = db.query(User).filter_by(username=username).first()

    if user: 
        view = View(public_key=user.public_key)
        db.add(view)
        db.commit()
        db.refresh(user)
        return user
    return JSONResponse(
        status_code=404,
        content="User not found"
    )

@router.get("/profile/activity/{public_key}",
            dependencies=[Depends(RateLimit(times=30, seconds=5))],
            status_code=200
            )
async def activity(public_key: str, request: Request) -> JSONResponse:

    resp = await request.app.request_client.get(f"https://api.solscan.io/account/soltransfer/txs?address={public_key}&limit=4")
    data = resp.json()["data"]["tx"]["transactions"]

    filtered_data = []
    for i in data:
        sols = lamport_to_sol(i["lamport"])
        if i["src"] == public_key:
            filtered_data.append({"type": "sent", "message": f"Sent {sols} SOLs to {i['dst']}"})
        else:
            filtered_data.append({"type": "received", "message": f"Received {sols} SOLs from {i['src']}"})

    return filtered_data


