import random
from typing import Union
from core.db import get_db
from core.ratelimit import Limit
from sqlalchemy.orm import Session
from core.schemas import User, View
from core.models import ProfileFind
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/profile")

@router.get("/{username}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
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

@router.post("/ext/find", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def find(profilefind: ProfileFind, db: Session=Depends(get_db)) -> dict:
    public_key_search = db.query(User).filter_by(public_key=profilefind.username_or_public_key).first()
    if public_key_search:
        return public_key_search

    username_search = db.query(User).filter_by(username=profilefind.username_or_public_key).first()
    if username_search:
        return username_search
    
    return JSONResponse(
        status_code=400,
        content={"error": "User not found"}
    )    

@router.get("/ext/getrandom", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def getrandom(limit: int = 2, db: Session=Depends(get_db)) -> dict:
    if limit > 100:
        return JSONResponse(
            status_code=400,
            content={"error": "Requested too many profiles at once"}
        )

    random_range = random.sample(range(db.query(User).count()), limit )
    users = [db.query(User)[i] for i in random_range]
    return users