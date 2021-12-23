FROM python:3

COPY /src /api

WORKDIR /api

RUN pip install aioredis fastapi httpx psycopg2 pynacl python-dotenv solana sqlalchemy uvicorn

CMD uvicorn main:app --host 0.0.0.0 --port 8080
