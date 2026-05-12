import logging
import os

from collections.abc import Generator
from pathlib import Path

from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
    Session,
)

# =========================================================
# Environment
# =========================================================

load_dotenv()

logger = logging.getLogger(__name__)

# =========================================================
# Database Configuration
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

SQLITE_URL = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"

DATABASE_URL = os.getenv(
    "POSTGRESQL_URL",
    SQLITE_URL,
)

# =========================================================
# Engine Initialization
# =========================================================

def initialize_engine() -> Engine:
    """
    Create and configure SQLAlchemy engine.
    """

    is_sqlite = DATABASE_URL.startswith("sqlite")

    if is_sqlite:
        logger.warning(
            "POSTGRESQL_URL not found. "
            "Using local SQLite database."
        )

    engine_kwargs = {
        "pool_pre_ping": True,
        "future": True,
        "echo": False,
    }

    # SQLite-specific config
    if is_sqlite:
        engine_kwargs["connect_args"] = {
            "check_same_thread": False
        }

    return create_engine(
        DATABASE_URL,
        **engine_kwargs,
    )

# =========================================================
# Engine / Session
# =========================================================

engine = initialize_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

Base = declarative_base()

# =========================================================
# Dependency
# =========================================================

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI database dependency.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
