FROM python:3

COPY /src /api

WORKDIR /api

RUN pip install aioredis fastapi psycopg2 python-dotenv solathon sqlalchemy uvicorn ipfs-api python-multipart

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
