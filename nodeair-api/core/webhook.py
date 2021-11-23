from typing import Union
from httpx import AsyncClient

class Webhook:
    def __init__(self, secret: str) -> None:
        self.webhook_url = f"https://discord.com/api/webhooks/{secret}"

    def embed(self, 
            title: str, 
            description: Union[str, None] = None, 
            color: int = 157695) -> dict:
    
        return {
            "title": title,
            "description": description,
            "color": color,
            "type": "rich"
             }

    async def send(self, content: str = "** **", **kwargs) -> None:
        content = {"content": content}
        if kwargs.get("embed"):
            content.update({"embeds": [kwargs["embed"]]})

        client = AsyncClient()
        await client.post(self.webhook_url, json=content)
        await client.close()


