import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

def initialize_engine() -> str:
    try:
        return create_engine(os.environ["POSTGRESQL_URL"])
    except KeyError:
        print(
            "'POSTGRESQL_URL' environment variable not found,",
            "creating 'db.sql' locally...'"
            )
        return create_engine(
                            "sqlite:///../db.sql", 
                            connect_args={"check_same_thread": False}
                            )

engine = initialize_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db() -> None:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()