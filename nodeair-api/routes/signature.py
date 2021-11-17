from nacl.encoding import Base64Encoder

from starlette.requests import Request
from core.db import get_db
from sqlalchemy.orm import Session
from core.ratelimit import RateLimit
from fastapi.responses import JSONResponse
from fastapi import APIRouter, Depends
from nacl.signing import VerifyKey
from base64 import b32encode
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

    pk = b"B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai"
    msg = "hi"
    x = await request.body()

    vk = VerifyKey(x)
    return True