from datetime import datetime
from core.db import get_db
from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from core.schemas import View


router = APIRouter(prefix="/fetch")

@router.get("/views/{public_key}", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200)
async def views(public_key: str, db: Session=Depends(get_db)) -> dict:

    views = db.query(View).filter_by(public_key=public_key)
    current_month = [x.viewed_on for x in views if x.viewed_on.month == datetime.utcnow().month]

    data = {}
    for i in current_month:
        if i.day in data.keys():
            data[i.day] += 1
        else:
            data.update({i.day: 1})

    return data