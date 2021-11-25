from nacl.signing import VerifyKey
from solana.publickey import PublicKey


def lamport_to_sol(lamports: float) -> float:
    return float(lamports / 1000000000)

def verify_signature(hash, signature, public_key) -> bool:
    try:
        vk = VerifyKey(bytes(PublicKey(public_key)))
        vk.verify(bytes(hash, encoding="utf8"), bytes(signature))
        return True
    except Exception as e:
        print(e)
        return False