import os
import json
import random
import nft_storage
from nft_storage.api import nft_storage_api
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
from core.schemas import User, View
from utils import lamport_to_sol, verify_signature

router = APIRouter(prefix="/profile")

configuration = nft_storage.Configuration(
    access_token=os.getenv('NFT_KEY')
)


@router.get("/{username}",
            status_code=200,
            dependencies=[Depends(Limit(times=20, seconds=5))],
            )
async def profile(username: str, request: Request,
                  db: Session = Depends(get_db),
                  ) -> Union[JSONResponse, User]:

    user = db.query(User).filter(func.lower(
        User.username) == username.lower()).first()

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

    verify = verify_signature(signature, public_key)
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

        with nft_storage.ApiClient(configuration) as api_client:
            api_instance = nft_storage_api.NFTStorageAPI(api_client)
            file_name = f"{public_key}.png"
            if (avatar):
                with open(file_name, 'wb') as image:
                    content = await avatar.read()
                    image.write(content)
                    image.close()
                    body = open(f"{file_name}", 'rb')
                    try:
                        api_response = api_instance.store(
                        body, _check_return_type=False)
                        user.avatar = f"https://nftstorage.link/ipfs/{api_response['value']['cid']}"
                        os.remove(file_name)
                    except nft_storage.ApiException as e:
                        print("Exception when calling NFTStorageAPI->store: %s\n" % e)

            if (banner):
                with open(file_name, 'wb') as image:
                    content = await banner.read()
                    image.write(content)
                    image.close()
                    body = open(f"{file_name}", 'rb')
                    try:
                        api_response = api_instance.store(
                        body, _check_return_type=False)
                        user.banner = f"https://nftstorage.link/ipfs/{api_response['value']['cid']}"
                        os.remove(file_name)
                    except nft_storage.ApiException as e:
                        print("Exception when calling NFTStorageAPI->store: %s\n" % e)

    db.commit()
    db.refresh(user)
    return user


@router.get("/update_count/{username}",
            dependencies=[Depends(Limit(times=5, seconds=5))],
            )
async def update_count(username: str, db: Session = Depends(get_db),
                       ) -> JSONResponse:

    user = db.query(User).filter(func.lower(
        User.username) == username.lower()).first()
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

    pub_key_find = db.query(User).filter_by(public_key=profilefind.username_or_public_key
                                            ).first()
    if pub_key_find:
        return pub_key_find

    username_find = db.query(User).filter(func.lower(
        User.username) == profilefind.username_or_public_key.lower()).first()
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
