from datetime import datetime
from sqlalchemy import (
                        Column, 
                        String, 
                        Integer, 
                        DateTime, 
                        Text,
                        ForeignKey
                        )
from sqlalchemy.orm import relationship
from core.db import Base
from utils import get_random_avatar


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), nullable=False, unique=True)
    username = Column(String(length=15), nullable=False, unique=True)
    name = Column(String(length=25), nullable=False)
    bio = Column(Text, default="Hey there, I'm new!", nullable=True)
    social = Column(String(100), nullable=True)
    avatar = Column(String(100), default=get_random_avatar, nullable=False)
    banner = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635100450/Test/banner.png"
                    ), nullable=False)
    joined_on = Column(DateTime, default=datetime.utcnow, nullable=False)

    bookmarks = relationship("Bookmark", back_populates="owner", passive_deletes=True)

class History(Base):
    __tablename__ = "histories"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), nullable=False, unique=True)
    username = Column(String(length=15), nullable=False, unique=True)
    name = Column(String(length=25), nullable=False)
    bio = Column(Text, default="Hey there, I'm new!", nullable=True)
    social = Column(String(100), nullable=True)
    avatar = Column(String(100), default=get_random_avatar, nullable=False)
    banner = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635100450/Test/banner.png"
                    ), nullable=False)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    profile_public_key = Column(String(length=44), nullable=False)
    bookmarked_on = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner_public_key = Column(String(length=44), ForeignKey('users.public_key', ondelete='CASCADE'), nullable=False)
    owner = relationship("User", back_populates="bookmarks")


class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), nullable=False)
    hash = Column(String(length=44), nullable=False)


class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), ForeignKey('users.public_key', ondelete='CASCADE'), nullable=False)
    viewed_on = Column(DateTime, default=datetime.utcnow, nullable=False)


