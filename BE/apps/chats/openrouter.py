from openrouter import OpenRouter
from decouple import config


async def http_client(messages):
    """
    messages template: [{"role": "user", "content": prompt}]
    """
    async with OpenRouter(api_key=config("OPENROUTER_API_KEY")) as client:
        return await client.chat.send_async(model="openrouter/free", messages=messages)


async def stream_client(messages):
    """
    messages template: [{"role": "user", "content": prompt}]
    """
    async with OpenRouter(api_key=config("OPENROUTER_API_KEY")) as client:
        stream = await client.chat.send_async(
            model="openrouter/free",
            messages=messages,
            stream=True,
        )

        async for event in stream:
            chunk = event.choices[0].delta.content if event.choices else None

            if chunk:
                yield chunk
