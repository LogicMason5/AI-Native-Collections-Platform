import json
from operator import getitem
from datetime import datetime
from collections import OrderedDict
from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from solana.rpc.types import TokenAccountOpts
from core.db import get_db

from core.ratelimit import Limit
from core.schemas import View



router = APIRouter(prefix="/fetch")


@router.get("/views/{public_key}",
            dependencies=[Depends(Limit(times=20, seconds=5))],
            status_code=200)
async def views(public_key: str, db: Session = Depends(get_db)) -> dict:

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


@router.get("/tokens/{public_key}",
            dependencies=[Depends(Limit(times=5, seconds=10))],
            status_code=200)
async def views(request: Request, public_key: str) -> JSONResponse:
    tokens = await request.app.solana_client.get_token_accounts_by_owner(
        public_key,
        TokenAccountOpts(
            program_id='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            encoding="jsonParsed"),
        "max")
    
    public_keys = [i["account"]["data"]["parsed"]["info"]["mint"]
                   for i in tokens["result"]["value"]]

    amounts = [i["account"]["data"]["parsed"]["info"]["tokenAmount"]
               ["uiAmount"] for i in tokens["result"]["value"]]
    amounts_pair = {i:y for (i,y) in zip(public_keys, amounts)}

    prices = await request.app.request_client.get("https://api.coingecko.com/api/v3/simple/token_price/solana"+
                                                    f"?contract_addresses={','.join(public_keys)}&vs_currencies=usd")
    data = {"prices": prices.json()}
    prices_data = data["prices"]
    with open("assets/tokens.json", "r", encoding='utf-8') as f:
        token_data = json.loads(f.read())
        for i in prices_data:
            token = [x for x in token_data if x["address"] == i][0]
            prices_data[i].update({"symbol": token["symbol"], "logo": token["logoURI"], "address": token["address"]})
            prices_data[i]["usd"] = round(prices_data[i]["usd"] * amounts_pair[prices_data[i]["address"]], 2)

    data["prices"] = OrderedDict(sorted(prices_data.items(),
        key = lambda x: getitem(x[1], 'usd'), reverse=True))
    return data
