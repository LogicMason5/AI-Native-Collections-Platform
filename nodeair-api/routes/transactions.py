from fastapi import Request
from datetime import datetime
from calendar import monthrange
from utils import lamport_to_sol
from fastapi import APIRouter
from core.ratelimit import Limit
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse


router = APIRouter(prefix="/fetch")

@router.get("/activity/{public_key}",
            dependencies=[Depends(Limit(times=30, seconds=5))],
            status_code=200
            )
async def activity(public_key: str,  request: Request, limit: int = 4, split_message: bool = False) -> JSONResponse:

    resp = await request.app.request_client.get(
                ("https://api.solscan.io/account/"
                f"soltransfer/txs?address={public_key}&offset=0&limit={limit}")
                )

    data = resp.json()["data"]["tx"]["transactions"]
    filtered_data = []
    for i in data:

        sols = lamport_to_sol(i["lamport"])
        if i["src"] == public_key:
            if split_message:
                d = {"type": "sent", "amount": sols, "to": i['dst'], "tx": i["txHash"]}
            else:
                d = {"type": "sent", "message": f"Sent {sols} SOLs to {i['dst']}", "tx": i["txHash"]}
                
            filtered_data.append(d)
        else:
            if split_message:
                d = {"type": "received", "amount": sols, "from": i['src'], "tx": i["txHash"]}
            else:
                d = {"type": "received", "message": f"Received {sols} SOLs from {i['src']}", "tx": i["txHash"]}
            filtered_data.append(d)


    return JSONResponse(
        content=filtered_data
    )

@router.get("/transactions/{public_key}",
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def transactions(public_key: str, request: Request) -> dict:
    time_now = datetime.utcnow()
    amount_of_days = monthrange(2021, time_now.month)[1]

    resp = await request.app.request_client.get(
                ("https://api.solscan.io/account/soltransfer/txs?"
                f"address={public_key}&offset=0&limit=500")
                )
    transactions = resp.json()["data"]["tx"]["transactions"]
    t = [
        i for i in transactions if 
        datetime.fromtimestamp(i["blockTime"]).month == 
        time_now.month
        ]
        
    days = [datetime.fromtimestamp(i["blockTime"]).day for i in t 
            if datetime.fromtimestamp(i["blockTime"]).month == time_now.month]

    def get_sent(day):
        sent = [lamport_to_sol(i["lamport"]) for i in t 
            if datetime.fromtimestamp(i["blockTime"]).day == day 
            and i["src"] == public_key]

        received = [lamport_to_sol(i["lamport"]) for i in 
                    t if datetime.fromtimestamp(i["blockTime"]).day == day 
                    and i["dst"] == public_key]
        return sent, received

    data = {}
    ratio = [0, 0]
    for i in range(1, amount_of_days + 1):
        if i not in days:
            data.update({i: {"sent": 0, "received": 0}})
        else:
            sent, received = get_sent(i)
            data.update({i: {"sent": sum(sent), "received": sum(received)}})
            ratio[0] += sum(sent)
            ratio[1] += sum(received)

    return {"transactions": data, "ratio": ratio}