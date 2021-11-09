import asyncio
from solana.rpc.async_api import AsyncClient

def lamport_to_sol(lamports: float) -> float:
    return float(lamports / 1000000000)

async def main():

    client = AsyncClient("https://api.devnet.solana.com")

    res = await client.get_signatures_for_address("B3BhJ1nvPvEhx3hq3nfK8hx4WYcKZdbhavSobZEA44ai")

    data = []
    for i in res["result"][:4]:
        result = await client.get_confirmed_transaction(i["signature"])

        meta = result["result"]["meta"]
        transaction = result["result"]["transaction"]
        account_keys = transaction["message"]["accountKeys"]

        sender, receiver = (account_keys[0], account_keys[1])
        transaction_data = {"sender": sender, "receiver": receiver}

        pre_balance = meta["preBalances"][:2]
        post_balance = meta["postBalances"][:2]
        if post_balance[0] > pre_balance[0]:
            tra = lamport_to_sol(post_balance[0] - pre_balance[0])
        elif post_balance[1] > pre_balance[1]:
            amount = lamport_to_sol(post_balance[1] - pre_balance[1])

        transaction_data.update({"amount": amount})
        data.append(transaction_data)
        
    await client.close()

asyncio.run(main())