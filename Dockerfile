FROM python:3

COPY /pay /root

WORKDIR /root

RUN pip install fastapi uvicorn sqlalchemy aioredis

CMD uvicorn main:app --host 0.0.0.0 --port 8000
