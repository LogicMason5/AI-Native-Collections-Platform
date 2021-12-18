FROM python:3

COPY /src /api

WORKDIR /api

RUN pip install fastapi uvicorn sqlalchemy psycopg2 aioredis python-dotenv httpx pynacl solana

CMD uvicorn main:app --host 0.0.0.0 --port 8080
