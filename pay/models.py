from pydantic import BaseModel

class RegisterUser(BaseModel):
    username: str
    public_key: str
    link: str
