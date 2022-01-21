
import struct
import base64
import random
import base58
from nacl.signing import VerifyKey
from solathon import PublicKey


def lamport_to_sol(lamports: float) -> float:
    return float(lamports / 1000000000)

def verify_signature(hash: str, signature: list, public_key: str) -> bool:
    try:
        vk = VerifyKey(bytes(PublicKey(public_key)))
        vk.verify(bytes(hash, encoding="utf8"), bytes(signature))
        return True
    except Exception:
        return False

def get_random_avatar():
    base_url = "https://res.cloudinary.com/f22/image/upload/v1638256420/NodeAir/"
    options = ("1a", "2a", "3a", "4a", "5a")
    return base_url + random.choice(options) + ".png"

def get_random_banner():
    base_url = "https://res.cloudinary.com/f22/image/upload/v1638256420/NodeAir/"
    options = ("1b", "2b", "3b", "4b", "5b")
    return base_url + random.choice(options) + ".png"

