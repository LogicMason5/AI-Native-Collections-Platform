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


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), nullable=False, unique=True)
    username = Column(String(length=15), nullable=False, unique=True)
    name = Column(String(length=25), nullable=False)
    bio = Column(Text, nullable=True)
    social = Column(String(100), nullable=True)
    avatar = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635015065/Test/avatar.png"
                    ), nullable=False)
    banner = Column(String(100), default=(
                    "https://res.cloudinary.com/f22/image"
                    "/upload/v1635100450/Test/banner.png"
                    ), nullable=False)
    email = Column(String(30), nullable=True)
    joined_on = Column(DateTime, default=datetime.utcnow, nullable=False)

    bookmarks = relationship("Bookmark", back_populates="user", passive_deletes=True)


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), ForeignKey('users.public_key', ondelete='CASCADE'), nullable=False)
    bookmarked_on = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="bookmarks")

class View(Base):
    __tablename__ = "views"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    public_key = Column(String(length=44), ForeignKey('users.public_key', ondelete='CASCADE'), nullable=False)
    viewed_on = Column(DateTime, default=datetime.utcnow, nullable=False)