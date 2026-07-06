from apps.chats.openrouter import http_client


async def generate_title(prompt):
    request = f"Generate a descriptive title no longer than 100 characters for this user prompt: {prompt}"
    messages = [{"role": "user", "content": request}]
    response = await http_client(messages)

    return response.choices[0].message.content


async def get_chat_context(message_history, prompt):
    request = (
        f"Build a context from the these messages which are the last messages of the chat: {message_history}. "
        f"From that context, generate a response for this user prompt: {prompt}"
    )
    response = await http_client(request)

    return response.choices[0].message.content
