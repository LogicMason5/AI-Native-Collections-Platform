from pydantic import BaseModel
from typing import Optional

class RegisterUser(BaseModel):
    public_key: str
    username: str
    signature: str

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

class UpdateProfile(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    social: Optional[str] = None
    avatar: Optional[str] = None
    banner: Optional[str] = None

    signature: dict
    public_key: dict