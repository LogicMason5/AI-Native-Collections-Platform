import random
import json
from typing import Optional, Union

import os
import aiofiles
from core.db import get_db
from core.ratelimit import Limit
from sqlalchemy.orm import Session
from core.schemas import User, View, Signature
from core.models import ProfileFind
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from utils import lamport_to_sol, verify_signature

router = APIRouter(prefix="/profile")


@router.get("/{username}",
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200
            )
async def profile(
        username: str,
        request: Request,
        db: Session = Depends(get_db),
) -> Union[JSONResponse, User]:

    user = db.query(User).filter_by(username=username).first()

    if user:
        resp = await request.app.request_client.get(
            ("https://api.solscan.io/account/"
             f"soltransfer/txs?address={user.public_key}&offset=0&limit={4}")
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
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200
            )
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
            status_code=400,
            content={"error": "Error verifying signature"}
        )
    else:
        user = db.query(User).filter_by(public_key=public_key).first()
        if not user:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "You need to register your wallet in order to update profile"}
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
            status_code=200
            )
async def update_count(
    username: str,
    db: Session = Depends(get_db),
) -> Union[JSONResponse, User]:

    user = db.query(User).filter_by(username=username).first()
    if user:
        view = View(public_key=user.public_key)
        db.add(view)
        db.commit()
        return {"message": f"View updated for {username}"}

    return JSONResponse(
        status_code=404,
        content={"error": "User not found"}
    )


@router.post("/ext/find",
             dependencies=[Depends(Limit(times=20, seconds=5))],
             status_code=200)
async def find(profilefind: ProfileFind, db: Session = Depends(get_db)) -> dict:
    public_key_search = db.query(User).filter_by(
        public_key=profilefind.username_or_public_key).first()
    if public_key_search:
        return public_key_search

    username_search = db.query(User).filter_by(
        username=profilefind.username_or_public_key).first()
    if username_search:
        return username_search

    return JSONResponse(
        status_code=400,
        content={"error": "User not found"}
    )


@router.get("/ext/getrandom",
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def getrandom(limit: int = 5, db: Session = Depends(get_db)) -> dict:
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
