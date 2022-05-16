FROM python:3

COPY /src /api

WORKDIR /api

RUN pip install aioredis fastapi psycopg2 python-dotenv solathon solana sqlalchemy uvicorn python-multipart git+https://github.com/nftstorage/python-client.git

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
