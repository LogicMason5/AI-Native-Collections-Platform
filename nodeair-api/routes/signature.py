from solana.publickey import PublicKey as PK
from starlette.requests import Request
from core.db import get_db
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from nacl.signing import VerifyKey
from nacl.public import PublicKey
from nacl.signing import VerifyKey

router = APIRouter()

@router.post("/signature", 
            dependencies=[Depends(RateLimit(times=20, seconds=5))],
            status_code=200
            )
async def signature(
                request: Request, db: Session=Depends(get_db)
                ) -> JSONResponse:

    pk = bytes(PK("B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai"))
    msg = b"hi"
    x = await request.json()
    print(x)

    vk = VerifyKey(pk)
    r = vk.verify(msg, x)
    print(r)
    return True