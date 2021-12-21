import json
from datetime import datetime
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

    with open("assets/tokens.json", "r", encoding='utf-8') as f:
        token_data = json.loads(f.read())

        data = [{i["name"]: amounts[public_keys.index(i["address"])]}
                for i in token_data if i["address"] in public_keys]

        return data
