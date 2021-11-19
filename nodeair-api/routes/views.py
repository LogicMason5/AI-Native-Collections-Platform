import httpx
from datetime import datetime
from calendar import monthrange
from core.db import get_db
from utils import lamport_to_sol
from fastapi import APIRouter
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from fastapi import APIRouter, Depends
from core.schemas import View


router = APIRouter(prefix="/fetch")

@router.get("/views/{public_key}", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200)
async def views(public_key: str, db: Session=Depends(get_db)) -> dict:

    views = db.query(View).filter_by(public_key=public_key)
    current_month = datetime.utcnow().month
    month_data = [x.viewed_on for x in views if x.viewed_on.month == current_month]
    amount_of_days = monthrange(2021, current_month)[1]
    data = {}
    for i in range(1, amount_of_days + 1):
        if i not in [x.day for x in month_data]:
            data.update({i: 0})
        else:
            for d in month_data:
                if d.day in data.keys():
                    data[d.day] += 1
                else:
                    data.update({d.day: 1})

    return data

@router.get("/transactions/{public_key}",
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200)
async def transactions(public_key: str) -> dict:
    time_now = datetime.utcnow()
    amount_of_days = monthrange(2021, time_now.month)[1]

    res = httpx.get(f"https://api.solscan.io/account/soltransfer/txs?address={public_key}&offset=0&limit=500").json()

    
    
    transactions = res["data"]["tx"]["transactions"]
    t = [
        i for i in transactions if 
        datetime.fromtimestamp(i["blockTime"]).month == 
        time_now.month
        ]
    days = tuple([datetime.fromtimestamp(i["blockTime"]).day for i in t if datetime.fromtimestamp(i["blockTime"]).month == time_now.month])

    def get_sent(day):
        sent = [lamport_to_sol(i["lamport"]) for i in t if datetime.fromtimestamp(i["blockTime"]).day == day and i["src"] == public_key]
        received = [lamport_to_sol(i["lamport"]) for i in t if datetime.fromtimestamp(i["blockTime"]).day == day and i["dst"] == public_key]
        return sent, received

    data = {}
    for i in range(1, amount_of_days + 1):
        if i not in days:
            data.update({i: {"sent": 0, "received": 0}})
        else:
            sent, received = get_sent(i)
            data.update({i: {"sent": sum(sent), "received": sum(received)}})
  
    return data