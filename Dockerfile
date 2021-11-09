FROM python:3

COPY /nodeair-api /root

WORKDIR /root

RUN pip install fastapi uvicorn sqlalchemy aioredis psycopg2 python-dotenv

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
