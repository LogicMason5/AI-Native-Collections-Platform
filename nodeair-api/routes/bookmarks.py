from core.db import get_db
from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.ratelimit import Limit
from fastapi import APIRouter, Depends
from core.schemas import Signature, Bookmark, User
from utils import verify_signature
from core.models import BookmarkCreate, BookmarkFind
from fastapi.responses import JSONResponse

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
        return JSONResponse(
            status_code=400, 
            content={"error": "Error verifying signature"}
            )
    else:
        owner = db.query(User).filter_by(public_key=owner_public_key).first()
        if not owner:
            return JSONResponse(
                    status_code=400,
                    content={"error": "You need to register your wallet in order to add bookmarks"}
                    )
        
        if bookmark.user_public_key in [x.public_key for x in owner.bookmarks]:
            return JSONResponse(
                status_code=400, 
                content={"error": "Profile already bookmarked"}
            )

        bm = Bookmark(public_key=bookmark.user_public_key, 
                    owner=owner)
        signature.delete()
        db.add(bm)
        db.commit()
        return {"message": "Successfully added bookmark"}
        
@router.get("/get/{public_key}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def get(public_key: str, limit: int = 5, db: Session=Depends(get_db)) -> dict:
    user = db.query(User).filter_by(public_key=public_key).first()
    if not user:
        return {"error": "User does not exist"}
    
    public_keys = [x.public_key for x in user.bookmarks[:limit]]
    profiles = [db.query(User).filter_by(public_key=x) for x in public_keys]
    data = [{"username": x.first().username, 
            "avatar": x.first().avatar, 
            "public_key": x.first().public_key} 
            for x in profiles]

    return data

@router.post("/find", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def find(bookmarkfind: BookmarkFind, db: Session=Depends(get_db)) -> dict:
    user_bookmarks = db.query(Bookmark).filter_by(owner=db.query(User).filter_by(public_key=bookmarkfind.public_key).first())

    public_key_search = user_bookmarks.filter_by(public_key=bookmarkfind.username_or_public_key).first()
    
    if public_key_search:
        found = db.query(User).filter_by(public_key=bookmarkfind.username_or_public_key).first()
        return {"username": found.username,
                "avatar": found.avatar,
                "public_key": found.public_key}
    
    user = db.query(User).filter_by(username=bookmarkfind.username_or_public_key).first()
    if user is not None and user_bookmarks.filter_by(public_key=user.public_key).first():
        return {"username": user.username,
                "avatar": user.avatar,
                "public_key": user.public_key}

    return JSONResponse(status_code=400, content={"error": "Bookmark not found"})