from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile, File, Form

class RegisterUser(BaseModel):
    public_key: str
    username: str
    signature: Optional[str]
    plan: int

class CheckUser(BaseModel):
    public_key: str
    username: str

class BookmarkCreateDelete(BaseModel):
    owner_public_key: str
    signature: dict
    profile_public_key: str

class BookmarkFind(BaseModel):
    public_key: str
    username_or_public_key: str

class ProfileFind(BaseModel):
    username_or_public_key: str


