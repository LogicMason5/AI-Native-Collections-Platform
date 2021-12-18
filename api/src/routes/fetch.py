from datetime import datetime
from calendar import monthrange
from core.db import get_db
from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.ratelimit import Limit
from fastapi import APIRouter, Depends
from core.schemas import View


router = APIRouter(prefix="/fetch")

@router.get("/views/{public_key}", 
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def views(public_key: str, db: Session=Depends(get_db)) -> dict:

    views_obj = db.query(View).filter_by(public_key=public_key)
    today = datetime.utcnow()
    views_data = [
        x.viewed_on for x in views_obj if 
        x.viewed_on.month == today.month and 
        x.viewed_on.day <= today.month
        ]
    data = {}
    for i in range(1, today.day + 1):
        if i not in [x.day for x in views_data]:
            data.update({i: 0})
        else:
            for d in views_data:
                if d.day in data.keys():
                    data[d.day] += 1
                else:
                    data.update({d.day: 1})

    return data

