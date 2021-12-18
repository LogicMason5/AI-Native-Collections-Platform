from typing import Union
from httpx import AsyncClient

class Webhook:
    def __init__(self, secret: str) -> None:
        self.webhook_url = f"https://discord.com/api/webhooks/{secret}"
    
    def embed(self, 
            title: str = None, 
            description: Union[str, None] = None, 
            color: int = 157695,
            **kwargs) -> dict:
             
        embed = {
            "title": title,
            "description": description,
            "color": color,
            "type": "rich"
             }

        if "fields" in kwargs:
            embed.update({
                "fields": [
                    {"name": i[0], 
                    "value": i[1], 
                    "inline": False if len(i) < 3 else i[2]
                    } for i in kwargs["fields"]
                    ]
                })
        if "thumbnail" in kwargs:
            embed.update({"thumbnail": {"url": kwargs["thumbnail"]}})
        return embed 

    async def send(self, content: str = "** **", **kwargs) -> None:
        content = {"content": content}
        if kwargs.get("embed"):
            content.update({"embeds": [kwargs["embed"]]})

        async with AsyncClient() as client:
            await client.post(self.webhook_url, json=content)

