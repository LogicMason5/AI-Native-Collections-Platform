import os
from typing import Union
from core.db import get_db
from core.schemas import User, View
from utils import lamport_to_sol
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.models import RegisterUser
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from solana.rpc.async_api import AsyncClient
from core.webhook import Webhook, Embed

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

@router.get("/profile/activity/{username}",
            dependencies=[Depends(RateLimit(times=30, seconds=5))],
            status_code=200
            )
async def activity(username: str, db: Session=Depends(get_db)
                ) -> JSONResponse:

    user = db.query(User).filter_by(username=username).first()
    if not user:
        return JSONResponse(
            status_code=404,
            content="Unable to fetch data"
        )

    client = AsyncClient("https://api.mainnet-beta.solana.com")
    res = await client.get_confirmed_signature_for_address2(user.public_key)
    data = []
    for i in res["result"][:4]:
        result = await client.get_confirmed_transaction("4HEN8Azy2Pvcy2sKNdcY6UuYL45kdMZ5TYdwes35ZmXcEsSCSHirJeeNRpzoFpmdf5ncZsuX6j2vxYgrgRFkKVrx")

        print(result)
        break
        sender, receiver = (account_keys[0], account_keys[1])
        send_itself = True if sender.isdigit() | receiver.isdigit() else False
        
        pre_balance = meta["preBalances"][:2]
        post_balance = meta["postBalances"][:2]
        if post_balance[0] > pre_balance[0]:
            amount = lamport_to_sol(post_balance[0] - pre_balance[0])
        elif post_balance[1] > pre_balance[1]:
            amount = lamport_to_sol(post_balance[1] - pre_balance[1])
        elif send_itself:
            amount = lamport_to_sol(pre_balance[0] - post_balance[0])
        else:
            amount = "Error fetching details"
        
        print(receiver)
        print(user.public_key)
        if receiver == user.public_key:
            transaction_data = ({"type": "recieved", "details": f"Received {amount} SOLs from {sender}"})
        else:
            transaction_data = ({"type": "sent", "details": f"Sent {amount} SOLs to {receiver}"})
        data.append(transaction_data)

    await client.close()
    return JSONResponse(
        content=data
    )


