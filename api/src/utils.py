from nacl.signing import VerifyKey
from solana.publickey import PublicKey
import random
import base58
import base64
import struct
from solana.rpc.api import Client
from solana.publickey import PublicKey


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


def unpack_metadata_account(data):
    assert(data[0] == 4)
    i = 1
    source_account = base58.b58encode(bytes(struct.unpack('<' + "B"*32, data[i:i+32])))
    i += 32
    mint_account = base58.b58encode(bytes(struct.unpack('<' + "B"*32, data[i:i+32])))
    i += 32
    name_len = struct.unpack('<I', data[i:i+4])[0]
    i += 4
    name = struct.unpack('<' + "B"*name_len, data[i:i+name_len])
    i += name_len
    symbol_len = struct.unpack('<I', data[i:i+4])[0]
    i += 4 
    symbol = struct.unpack('<' + "B"*symbol_len, data[i:i+symbol_len])
    i += symbol_len
    uri_len = struct.unpack('<I', data[i:i+4])[0]
    i += 4 
    uri = struct.unpack('<' + "B"*uri_len, data[i:i+uri_len])
    i += uri_len
    fee = struct.unpack('<h', data[i:i+2])[0]
    i += 2
    has_creator = data[i] 
    i += 1
    creators = []
    verified = []
    share = []
    if has_creator:
        creator_len = struct.unpack('<I', data[i:i+4])[0]
        i += 4
        for _ in range(creator_len):
            creator = base58.b58encode(bytes(struct.unpack('<' + "B"*32, data[i:i+32])))
            creators.append(creator)
            i += 32
            verified.append(data[i])
            i += 1
            share.append(data[i])
            i += 1
    primary_sale_happened = bool(data[i])
    i += 1
    is_mutable = bool(data[i])
    metadata = {
        "update_authority": source_account,
        "mint": mint_account,
        "data": {
            "name": bytes(name).decode("utf-8").strip("\x00"),
            "symbol": bytes(symbol).decode("utf-8").strip("\x00"),
            "uri": bytes(uri).decode("utf-8").strip("\x00"),
            "seller_fee_basis_points": fee,
            "creators": creators,
            "verified": verified,
            "share": share,
        },
        "primary_sale_happened": primary_sale_happened,
        "is_mutable": is_mutable,
    }
    return metadata

def get_metadata_account(mint_key):
    METADATA_PROGRAM_ID = PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    return PublicKey.find_program_address([b'metadata', bytes(METADATA_PROGRAM_ID), bytes(PublicKey(mint_key))], METADATA_PROGRAM_ID)[0]

async def get_nft_metadata(client, mint_addresses: list) -> dict:
    metadata_accounts = [get_metadata_account(m) for m in mint_addresses]
    nft_infos = await client.get_multiple_accounts(metadata_accounts)
    if nft_infos["result"]["value"]:
        datas = [base64.b64decode(n['data'][0]) for n in nft_infos["result"]["value"]]
        return [unpack_metadata_account(d) for d in datas]
    else:
        print("Error", nft_infos)