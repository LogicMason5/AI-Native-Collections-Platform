from fastapi import Request
from datetime import datetime
from calendar import monthrange
from utils import lamport_to_sol
from fastapi import APIRouter
from core.ratelimit import Limit
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional

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

