import time
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
from utils import lamport_to_sol, get_nft_metadata

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
        x.viewed_on.day <= today.day
    ]

    data = {}
    for i in range(1, today.day + 1):
        if i not in [x.day for x in views_data]:
            data.update({i: 0})
        else:
            for d in [x for x in views_data if x.day == i]:
                if i not in data.keys():
                    data.update({i: 1})
                else:
                    data[i] += 1

    return data


@router.get("/tokens/{public_key}",
            dependencies=[Depends(Limit(times=5, seconds=10))],
            status_code=200)
async def tokens(request: Request, public_key: str) -> JSONResponse:
    SOL_ADDRESS = "So11111111111111111111111111111111111111112"
    tokens = await request.app.solana_client.get_token_accounts_by_owner(
            public_key,
            TokenAccountOpts(
                program_id='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                encoding="jsonParsed"),
            "max")
    try:
        public_keys = [i["account"]["data"]["parsed"]["info"]["mint"]
                    for i in tokens["result"]["value"]]
        public_keys.append(SOL_ADDRESS)
    except Exception:
        print("Execption with tokens: ", tokens)
        return JSONResponse(
                status_code=500,
                content={"error": "Error fetching tokens, try reloading."}
                )

    possible_nfts = [i["account"]["data"]["parsed"]["info"]["mint"]
                   for i in tokens["result"]["value"] if i["account"]["data"]["parsed"]["info"]["tokenAmount"]["uiAmount"] == 1]

    amounts = [i["account"]["data"]["parsed"]["info"]["tokenAmount"]
               ["uiAmount"] for i in tokens["result"]["value"]]
    sol_balance = await request.app.solana_client.get_balance(public_key)
    amounts.append(lamport_to_sol(sol_balance["result"]["value"]))    
    amounts_pair = {i:y for (i,y) in zip(public_keys, amounts)}

    token_json = await request.app.request_client.get("https://token-list.solana.com/solana.tokenlist.json")
    token_data = token_json.json()["tokens"]
    
    token_public_keys = [x for x in public_keys if x in [y["address"] for y in token_data]]
    nfts = [i for i in possible_nfts if i not in token_public_keys]
    prices = await request.app.request_client.get("https://api.coingecko.com/api/v3/simple/token_price/solana"+
                                                    f"?contract_addresses={','.join(token_public_keys)}&vs_currencies=usd")          
    prices_data = prices.json()
    unfetched_public_keys = [x for x in token_public_keys if x not in [y for y in prices_data]]
    unfetched_coingecko_ids = {}
    for i in token_data:
        if i["address"] in unfetched_public_keys:
            try:
                unfetched_coingecko_ids.update({i["extensions"]["coingeckoId"]: i["address"] })
            except:
                continue

    new_prices = await request.app.request_client.get("https://api.coingecko.com/api/v3/simple/price/"+
                                                    f"?ids={','.join(unfetched_coingecko_ids.keys())}&vs_currencies=usd") 
    new_data = new_prices.json()
    for i in list(new_data):
        new_data[unfetched_coingecko_ids[i]] = new_data.pop(i)

    prices_data.update(new_data)
    sol_price = prices_data[SOL_ADDRESS]["usd"]
    for i in prices_data:
        token = [x for x in token_data if x["address"] == i][0]
        token_price = prices_data[i]
        token_price.update({"symbol": token["symbol"], "logo": token["logoURI"], "address": token["address"]})
        token_price["usd"] = round(token_price["usd"] * amounts_pair[token_price["address"]], 2)

    token_values = OrderedDict(sorted(prices_data.items(), key = lambda x: getitem(x[1], 'usd'), reverse=True))
    data = {"tokenValues": token_values,
            "nftCount": len(nfts), 
            "fungibleTokenCount": len(token_public_keys), 
            "unavailableTokenCount": len(token_public_keys) - len(token_values), 
            "solPrice": sol_price,
            "walletValue": round(sum([value["usd"] for key,value in token_values.items()]), 2)}
            
    return data


@router.get("/nfts/{public_key}",
            dependencies=[Depends(Limit(times=5, seconds=10))],
            status_code=200)
async def nfts(request: Request, public_key: str, limit: int = 4) -> JSONResponse:
    tokens = await request.app.solana_client.get_token_accounts_by_owner(
            public_key,
            TokenAccountOpts(
                program_id='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                encoding="jsonParsed"),
            "max")

    possible_nfts = [i["account"]["data"]["parsed"]["info"]["mint"]
                   for i in tokens["result"]["value"] if 
                   i["account"]["data"]["parsed"]["info"]["tokenAmount"]["uiAmount"] 
                   == 1]
    token_json = await request.app.request_client.get("https://token-list.solana.com/solana.tokenlist.json")
    token_data = token_json.json()["tokens"]
    nfts = [i for i in possible_nfts if i not in [y["address"] for y in token_data]]
    nfts = sorted(nfts)
    data = []
    for i in nfts[:limit]:
        print(i)
        try:
            meta_data = await get_nft_metadata(request.app.solana_client, i)
            details_res = await request.app.request_client.get(meta_data["data"]["uri"])
            if details_res.status_code in (301, 302):
                details_res2 = await request.app.request_client.get(details_res.headers.get("location") + "/")
                details = details_res2.json()
            else:
                details = details_res.json()
            details.update({"address": i})
            data.append(details)
        except:
            data.append({"address": i})
    return data