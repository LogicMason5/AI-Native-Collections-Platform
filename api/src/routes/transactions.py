from datetime import datetime


from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi import Request, APIRouter, Depends
from core.ratelimit import Limit
from utils import lamport_to_sol

router = APIRouter(prefix="/transactions")

@router.get("/activity/{public_key}",
            dependencies=[Depends(Limit(times=30, seconds=5))],
            status_code=200
            )
async def activity(public_key: str,  request: Request, limit: int = 4) -> JSONResponse:

    resp = await request.app.request_client.get(
                ("https://api.solscan.io/account/"
                f"soltransfer/txs?address={public_key}&offset=0&limit={limit}")
                )

    data = resp.json()["data"]["tx"]["transactions"]
    filtered_data = []
    for i in data:
        sols = round(lamport_to_sol(i["lamport"]), 3)
        if i["src"] == public_key:
            d = {"type": "sent", "amount": sols, "to": i['dst'], "tx": i["txHash"], "time": i["blockTime"]}
            filtered_data.append(d)
        else:
            d = {"type": "received", "amount": sols, "from": i['src'], "tx": i["txHash"], "time": i["blockTime"]}
            filtered_data.append(d)


    return JSONResponse(
        content=filtered_data
    )

