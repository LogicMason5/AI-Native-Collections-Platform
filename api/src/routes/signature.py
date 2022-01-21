import uuid
from solathon import PublicKey
from core.db import get_db
from sqlalchemy.orm import Session
from core.ratelimit import Limit
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends, Request
from core.schemas import Signature

router = APIRouter(prefix="/signature")


@router.post("/create", 
            dependencies=[Depends(Limit(times=3, seconds=5))],
            status_code=200
            )
async def create(
                request: Request, db: Session=Depends(get_db)
                ) -> JSONResponse:

    json = await request.json()
    random_hash = uuid.uuid4().hex
    signature = Signature(public_key=json["public_key"], hash=random_hash)
    db.add(signature)
    db.commit()
    return {"hash": random_hash}


@router.get("/get", 
            dependencies=[Depends(Limit(times=1, seconds=1))],
            status_code=200
            )
async def get(
                public_key: str, db: Session=Depends(get_db)
                ) -> JSONResponse:

    signature = db.query(Signature).filter_by(public_key=public_key)
    if not signature.first():
        return {"error": "Message not signed"}
    else:
        random_hash = signature.first().hash
        signature.delete()
        db.commit()
        return {"hash": random_hash}
