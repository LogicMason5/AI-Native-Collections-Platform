import os
import json
import random
from sqlalchemy import func
from typing import Optional, Union
from fastapi import (
                    APIRouter, 
                    Depends, 
                    Request, 
                    UploadFile, 
                    File, 
                    Form
                    )
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from core.db import get_db
from core.ratelimit import Limit
from core.models import ProfileFind
from core.schemas import User, View, Signature
from utils import lamport_to_sol, verify_signature

router = APIRouter(prefix="/profile")


@router.get("/{username}",
            status_code=200,
            dependencies=[Depends(Limit(times=20, seconds=5))],
            )
async def profile(username: str, request: Request, 
                db: Session = Depends(get_db),
                ) -> Union[JSONResponse, User]:

    user = db.query(User).filter(func.lower(User.username)==username.lower()).first()

    if user:
        resp = await request.app.request_client.get(
            ("https://api.solscan.io/account/soltransfer/txs?"
             f"address={user.public_key}&offset=0&limit={5}")
            )

        data = resp.json()["data"]["tx"]["transactions"]
        filtered_data = []
        for i in data:
            sols = lamport_to_sol(i["lamport"])
            tx = i["txHash"]

            if i["src"] == user.public_key:
                d = {"type": "sent", "amount": sols,
                     "to": i['dst'], "tx": tx}

                filtered_data.append(d)
            else:
                d = {"type": "received", "amount": sols,
                     "from": i['src'], "tx": tx}
                filtered_data.append(d)

        return {"user": user, "recent_activity": filtered_data}

    return JSONResponse(
        status_code=404,
        content={"error": "User not found"}
    )



@router.put("/update", 
            status_code=200,
            dependencies=[Depends(Limit(times=20, seconds=5))])
async def profile_update(
            request: Request,
            avatar: Optional[UploadFile] = File(None),
            banner: Optional[UploadFile] = File(None),
            name: Optional[str] = Form(None),
            bio: Optional[str] = Form(None),
            social: Optional[str] = Form(None),
            public_key: str = Form(...),
            signature: str = Form(...),
            db: Session = Depends(get_db),
            ) -> Union[JSONResponse, User]:

    signature = json.loads(signature)
    signature = signature["data"]
    signature_obj = db.query(Signature).filter_by(public_key=public_key)

    if not signature_obj.first():
        return {"error": "Message not signed"}

    message_hash = signature_obj[-1].hash
    verify = verify_signature(message_hash, signature, public_key)
    if not verify:
        return JSONResponse(
            status_code=403,
            content={"error": "Error verifying signature"}
        )
    else:
        user = db.query(User).filter_by(public_key=public_key).first()
        if not user:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "Wallet not registered"}
            )
        user.name = name
        user.bio = bio
        user.social = social

        file_name =f"{message_hash}.png"
        if (avatar):
            with open(file_name, 'wb') as image:
                content = await avatar.read()
                image.write(content)
                image.close()
            res = request.app.ipfs.add(file_name)
            user.avatar = f"https://ipfs.infura.io:5001/api/v0/cat?arg={res['Hash']}"
            os.remove(file_name)

        if (banner):
            with open(file_name, 'wb') as image:
                content = await banner.read()
                image.write(content)
                image.close()
            res = request.app.ipfs.add(file_name)
            user.banner = f"https://ipfs.infura.io:5001/api/v0/cat?arg={res['Hash']}"
            os.remove(file_name)
    
    db.commit()
    db.refresh(user)
    return user

@router.get("/update_count/{username}",
            dependencies=[Depends(Limit(times=5, seconds=5))],
            )
async def update_count(username: str, db: Session = Depends(get_db),
                        ) -> JSONResponse:

    user = db.query(User).filter(func.lower(User.username)==username.lower()).first()
    if user:
        view = View(public_key=user.public_key)
        db.add(view)
        db.commit()
        count = db.query(View).filter_by(public_key=user.public_key).count()
        return {"view_count": count}

    return JSONResponse(
        status_code=404,
        content={"error": "User not found"}
    )


@router.post("/ext/find", 
            status_code=200,
            dependencies=[Depends(Limit(times=20, seconds=5))])
async def find(profilefind: ProfileFind, db: Session = Depends(get_db)
                ) -> Union[JSONResponse, User]:

    pub_key_find = db.query(User).filter_by(public_key=
                                            profilefind.username_or_public_key
                                            ).first()
    if pub_key_find:
        return pub_key_find

    username_find = db.query(User).filter(func.lower(User.username)==profilefind.username_or_public_key.lower()).first()
    if username_find:
        return username_find

    return JSONResponse(
        status_code=404,
        content={"error": "User not found"}
    )


@router.get("/ext/getrandom", 
            status_code=200,
            dependencies=[Depends(Limit(times=20, seconds=5))])
async def getrandom(limit: int = 5, db: Session = Depends(get_db)
                    ) -> Union[JSONResponse, list]:
    if limit > 100:
        return JSONResponse(
            status_code=400,
            content={"error": "Requested too many profiles at once"}
        )

    r = range(db.query(User).count())
    try:
        random_range = random.sample(r, limit)
    except ValueError:
        random_range = random.sample(r, len(r))

    users = [db.query(User)[i] for i in random_range]
    return users
