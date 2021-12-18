from core.db import get_db
from core.schemas import User
from core.ratelimit import Limit
from sqlalchemy.orm import Session
from core.models import CheckUser
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/check")

@router.post("/", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200
            )
async def check(
                user: CheckUser, db: Session=Depends(get_db)
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
                content={"error": f"{field} already registered", "username": get_user.username}
                )    
 
    else:
        return JSONResponse(
            content={"valid": True}
        )

@router.get("/user/{public_key}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200
            )
async def check(public_key: str, db: Session=Depends(get_db)
                ) -> JSONResponse:

    get_user = db.query(User).filter_by(public_key=public_key).first()
    if not get_user:
        return JSONResponse(
            content={"exists": False},
            status_code=404
        )