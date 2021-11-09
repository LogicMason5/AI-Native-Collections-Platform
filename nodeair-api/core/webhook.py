from typing import Union
import httpx


class Webhook:
    def __init__(self, webhook_url: str) -> None:
        self.webhook_url = webhook_url

    async def send(self, content: str = "** **", **kwargs) -> None:
        async with httpx.AsyncClient() as client:
            content = {"content": content}
            if kwargs.get("embed"):
                content.update({"embeds": [kwargs["embed"]]})

            await client.post(
                self.webhook_url,
                json=content
            )


class Embed:
    def __init__(self, 
                title: str, 
                description: Union[str, None] = None,
                color: int = 157695
                ) -> dict:
        self.title = title
        self.description = description
        self.color = color
    
    
    def json(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "color": self.color,
            "type": "rich"
             }
