import random
from nacl.signing import VerifyKey
from solana.publickey import PublicKey


def lamport_to_sol(lamports: float) -> float:
    return float(lamports / 1000000000)

def verify_signature(hash, signature, public_key) -> bool:
    try:
        vk = VerifyKey(bytes(PublicKey(public_key)))
        vk.verify(bytes(hash, encoding="utf8"), bytes(signature))
        return True
    except Exception:
        return False

def get_random_avatar():
    base_url = "https://res.cloudinary.com/f22/image/upload/v1638256420/NodeAir/"
    options = ("red","green", "orange", "yellow", "blue")

    if random.randint(1, 100) == 50:
        return base_url + "rare.png"
    else:
        return base_url + random.choice(options)