from pydantic import BaseModel

class RegisterUser(BaseModel):
    public_key: str
    link: str
