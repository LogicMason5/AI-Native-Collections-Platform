from core.db import get_db
from sqlalchemy import func
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.ratelimit import Limit
from core.schemas import Bookmark, User
from utils import verify_signature
from core.models import BookmarkCreateDelete, BookmarkFind
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/bookmark")

@router.post("/add", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def add(bookmark: BookmarkCreateDelete, db: Session=Depends(get_db)) -> dict:
    owner_pk = bookmark.owner_public_key
    profile_pk = bookmark.profile_public_key
    signature = bookmark.signature["data"]

    verify = verify_signature(signature, owner_pk)
    if not verify:
        return JSONResponse(
            status_code=400, 
            content={"error": "Error verifying signature"}
            )
    else:
        owner = db.query(User).filter_by(public_key=owner_pk).first()
        if not owner:
            return JSONResponse(
                    status_code=400,
                    content={"error": "You need to register your wallet in order to add bookmarks"}
                    )
        
        if profile_pk in [x.profile_public_key for x in owner.bookmarks]:
            return JSONResponse(
                status_code=400, 
                content={"error": "Profile already bookmarked"}
            )

        bm = Bookmark(profile_public_key=profile_pk, 
                    owner=owner)
        db.add(bm)
        db.commit()
        return {"message": "Successfully added bookmark"}


@router.post("/remove", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def remove(bookmark: BookmarkCreateDelete, db: Session=Depends(get_db)) -> dict:
    owner_pk = bookmark.owner_public_key
    profile_pk = bookmark.profile_public_key
    signature = bookmark.signature["data"]

    verify = verify_signature(signature, owner_pk)
    if not verify:
        return JSONResponse(
            status_code=400, 
            content={"error": "Error verifying signature"}
            )
    else:
        owner = db.query(User).filter_by(public_key=owner_pk).first()
        
        if not profile_pk in [x.profile_public_key for x in owner.bookmarks]:
            return JSONResponse(
                status_code=400, 
                content={"error": "Profile not bookmarked"}
            )

        bookmark_obj = db.query(Bookmark).filter_by(profile_public_key=profile_pk, owner=owner)
        bookmark_obj.delete()
        db.commit()
        return {"message": "Successfully removed bookmark"}   


@router.get("/get/{public_key}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def get(public_key: str, limit: int = 50, db: Session=Depends(get_db)) -> dict:
    user = db.query(User).filter_by(public_key=public_key).first()
    if not user:
        return {"error": "User does not exist"}
    
    public_keys = [x.profile_public_key for x in user.bookmarks[:limit]]
    profiles = [db.query(User).filter_by(public_key=x).first() for x in public_keys]

    data = {"bookmarks": [{"username": x.username, 
            "avatar": x.avatar, 
            "public_key": x.public_key} 
            for x in profiles],
            "total": len(user.bookmarks)}

    return data

@router.post("/find", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def find(bookmarkfind: BookmarkFind, db: Session=Depends(get_db)) -> dict:
    user_bookmarks = db.query(Bookmark).filter_by(owner_public_key=bookmarkfind.public_key)
    public_key_search = user_bookmarks.filter_by(profile_public_key=bookmarkfind.username_or_public_key).first()
    
    if public_key_search:
        found = db.query(User).filter_by(public_key=bookmarkfind.username_or_public_key).first()
        return {"username": found.username,
                "avatar": found.avatar,
                "public_key": found.public_key}
    
    user = db.query(User).filter(func.lower(User.username)==bookmarkfind.username_or_public_key.lower()).first()
    if user is not None and user_bookmarks.filter_by(profile_public_key=user.public_key).first():
        return {"username": user.username,
                "avatar": user.avatar,
                "public_key": user.public_key}

    return JSONResponse(status_code=400, content={"error": "Bookmark not found"})


@router.get("/check/{owner_publicKey}/{profile_publicKey}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def check(owner_publicKey: str, profile_publicKey: str, db: Session=Depends(get_db)) -> dict:
    owner = db.query(User).filter_by(public_key=owner_publicKey).first()
    bookmark = db.query(Bookmark).filter_by(profile_public_key=profile_publicKey, owner=owner).first()
    if bookmark:
        return {"bookmarked": True}
    else:
        return {"bookmarked": False}
