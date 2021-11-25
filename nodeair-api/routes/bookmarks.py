from core.db import get_db
from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.ratelimit import Limit
from fastapi import APIRouter, Depends
from core.schemas import Signature, Bookmark, User
from utils import verify_signature
from core.models import BookmarkCreate

router = APIRouter(prefix="/bookmark")

@router.post("/add", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def add(bookmark: BookmarkCreate, db: Session=Depends(get_db)) -> dict:
    owner_public_key = bookmark.owner_public_key
    signature = db.query(Signature).filter_by(public_key=owner_public_key)

    if not signature.first():
        return {"error": "Message not signed"}

    result = verify_signature(signature[-1].hash, bookmark.signature["data"], owner_public_key)
    if not result:
        return {"error": "Error verifying signature"}
    else:
        bm = Bookmark(public_key=bookmark.user_public_key, 
                    user=db.query(User).filter_by(public_key=owner_public_key).first())
        signature.delete()
        db.add(bm)
        print(bm)
        db.commit()
        
@router.get("/get", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def get(public_key: str, db: Session=Depends(get_db)) -> dict:
    user = db.query(User).filter_by(public_key=public_key).first()
    if not user:
        return {"error": "User does not exist"}
    return user.bookmarks


