from pydantic import BaseModel

class RegisterUser(BaseModel):
    public_key: str
    username: str

class Signature(BaseModel):
    signature: str