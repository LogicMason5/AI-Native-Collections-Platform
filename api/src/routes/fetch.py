from operator import getitem
from sqlalchemy import func
from fastapi import APIRouter, Depends, Request
from datetime import datetime
from collections import OrderedDict
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from core.db import get_db
from core.ratelimit import Limit
from core.schemas import View, User
from utils import lamport_to_sol


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
async def tokens(request: Request, public_key: str, db: Session = Depends(get_db)) -> JSONResponse:
    if len(public_key) != 44:
        user = db.query(User).filter(func.lower(User.username)==public_key.lower()).first()
        if user:
            public_key = user.public_key
        else:
            return JSONResponse(
                    status_code=400,
                    content={"error": "Invalid username"}
                    )

    SOL_ADDRESS = "So11111111111111111111111111111111111111112"
    tokens = request.app.solana_client.get_token_accounts_by_owner(
            public_key,
            program_id='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

    )
    filtered_tokens = []
    try:
        filtered_tokens = [i["account"]["data"]["parsed"]["info"]
                           for i in tokens["result"]["value"]]
    except Exception as e:
        print("Exception with tokens API: ", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Error fetching tokens, try reloading."}
        )

    nfts_addresses = [i["mint"] for i in filtered_tokens if
                      i["tokenAmount"]["uiAmount"] < 2 and # Less than two means either 1 or 0 because we cant use =<
                      i["tokenAmount"]["decimals"] < 2]

    tokens_addresses = [i["mint"] for i in filtered_tokens if 
                        i["mint"] not in nfts_addresses]

    tokens_addresses.append(SOL_ADDRESS)
    amounts = [i["tokenAmount"]["uiAmount"]
               for i in filtered_tokens if i["mint"] in tokens_addresses]

    sol_balance = request.app.solana_client.get_balance(public_key)
    amounts.append(lamport_to_sol(sol_balance["result"]["value"]))
    amounts_pair = {i: y for (i, y) in zip(tokens_addresses, amounts)}

    token_json = await request.app.request_client.get("https://token-list.solana.com/solana.tokenlist.json")
    token_data = token_json.json()["tokens"]

    prices = await request.app.request_client.get("https://api.coingecko.com/api/v3/simple/token_price/solana" +
                                                  f"?contract_addresses={','.join(tokens_addresses)}&vs_currencies=usd")
    prices_data = prices.json()
    unfetched_public_keys = [
        x for x in tokens_addresses if x not in [y for y in prices_data]]
    unfetched_coingecko_ids = {}
    for i in token_data:
        if i["address"] in unfetched_public_keys:
            try:
                unfetched_coingecko_ids.update(
                    {i["extensions"]["coingeckoId"]: i["address"]})
            except:
                continue

    new_prices = await request.app.request_client.get("https://api.coingecko.com/api/v3/simple/price/" +
                                                      f"?ids={','.join(unfetched_coingecko_ids.keys())}&vs_currencies=usd")
    new_data = new_prices.json()
    for i in list(new_data):
        new_data[unfetched_coingecko_ids[i]] = new_data.pop(i)

    prices_data.update(new_data)
    sol_price = prices_data[SOL_ADDRESS]["usd"]
    value = 0
    for i in prices_data:
        token = [x for x in token_data if x["address"] == i][0]
        token_price = prices_data[i]
        token_value = round(token_price.get("usd", 0)
                            * amounts_pair[token["address"]], 2)
        token_price.update({
            "symbol": token["symbol"],
            "logo": token["logoURI"],
            "address": token["address"],
            "amount": amounts_pair[token["address"]],
            "value": token_value
        })
        value += token_value

    prices_data[SOL_ADDRESS]["symbol"] = "SOL"
    unfetched_token_prices = {}
    for i in tokens_addresses:
        if i not in list(prices_data):
            try:
                token = [x for x in token_data if x["address"] == i][0]
                unfetched_token_prices.update({i :{
                    "symbol": token["symbol"],
                    "logo": token["logoURI"],
                    "address": token["address"],
                    "amount": amounts_pair[token["address"]],
                    "unfetched": True
                }})
            except:
                pass

    token_data = OrderedDict(
        sorted(prices_data.items(),
               key=lambda x: getitem(x[1], 'value'),
               reverse=True
               ))
    token_data.update(unfetched_token_prices)

    data = {
        "tokenData": token_data,
        "unfetchedTokenCount": len(tokens_addresses) - len(token_data),
        "nftCount": len(nfts_addresses),
        "fungibleTokenCount": len(tokens_addresses),
        "solPrice": sol_price,
        "walletValue": round(value, 2)
    }
    return data


@router.get("/nfts/{public_key}",
            dependencies=[Depends(Limit(times=5, seconds=2))],
            status_code=200)
async def nfts(request: Request, public_key: str, limit: int = 10, offset: int = 0, db: Session = Depends(get_db)) -> JSONResponse:
    if len(public_key) != 44:
        user = db.query(User).filter(func.lower(User.username)==public_key.lower()).first()
        if user:
            public_key = user.public_key
        else:
            return JSONResponse(
                    status_code=400,
                    content={"error": "Invalid username"}
                    )

    tokens = request.app.solana_client.get_token_accounts_by_owner(
            public_key,
            program_id='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    )
    try:
        filtered_tokens = [i["account"]["data"]["parsed"]["info"]
                           for i in tokens["result"]["value"]]
        nfts = [i["mint"] for i in filtered_tokens if
                i["tokenAmount"]["uiAmount"] == 1 and
                i["tokenAmount"]["decimals"] < 1][offset:limit+offset]

        nfts = sorted(nfts)
        if len(nfts) == 0:
            return []

        data = []
        for nft in nfts:
            try:
                res = await request.app.request_client.get("https://api.all.art/v1/solana/" + nft, timeout=1.5)
                metadata = res.json()
                attributes = None
                title = None
                description = None
                try:
                    attributes = metadata["Properties"]["attributes"]
                    title = metadata["Title"]
                    description = metadata["Description"]
                except Exception:
                    pass
                data.append({"name": title if title else None,
                            "description": description if description else None,
                             "image": metadata["Preview_URL"],
                             "attributes": attributes if attributes else None,
                             "address": metadata["Mint"]})
            except Exception as e:
                print(f"Could not fetch the following NFT: {nft}")
        return data
    except Exception as e:
        print("NFT API Error ", e)
        return JSONResponse(
            status_code=500,
            content={"error": "Uh oh, something went wrong"}
        )
