from pydantic import BaseModel

class RegisterUser(BaseModel):
    public_key: str
    username: str


class BookmarkCreate(BaseModel):
    owner_public_key: str
    signature: dict
    user_public_key: str
