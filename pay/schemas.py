from datetime import datetime
from sqlalchemy import (
                        Column, 
                        String, 
                        Integer, 
                        DateTime, 
                        ForeignKey
                        )
from sqlalchemy.orm import relationship
from db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(length=15), nullable=False)
    public_key = Column(String(length=44), nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    avatar = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635015065/Test/avatar.png"
                    ), nullable=False)
    banner = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635100450/Test/banner.png"
                    ), nullable=False)


class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    link = Column(String(30), nullable=False)
    expiration = Column(DateTime, nullable=True)
    uses = Column(Integer, default=0, nullable=True)
    owner_id = Column(Integer, nullable=False)