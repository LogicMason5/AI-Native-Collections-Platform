from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from core.db import get_db
from core.schemas import Link

router = APIRouter(prefix="/check")

@router.get("/", dependencies=[Depends(RateLimit(times=30, seconds=1))])
async def check_link(link: str, db: Session=Depends(get_db)):
    link_obj = db.query(Link).filter(link == Link.link).first()
    if link_obj:
        return True
    return False

