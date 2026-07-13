import json

from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.tokens import AccessToken
from apps.chats.models import Chat, Message
from channels.db import database_sync_to_async
from apps.chats.openrouter import stream_client, http_client


class ChatConsumer(AsyncWebsocketConsumer):
    # Mannage connections
    async def connect(self):

        self.decoded_token = None

        token = self.scope.get("cookies", {}).get("access_token")

        if token:
            try:
                self.decoded_token = AccessToken(token)

            except Exception as error:
                print(f"JWT error: {error}")

        await self.accept()

    # Disconnection
    async def disconnect(self, close_code):
        pass

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        user_prompt = data["message"]

        if not data["type"]:
            return await self.send(text_data=json.dumps({"message": user_prompt}))

        event_type = data["type"]

        if event_type == "start_chat":
            await self.start_chat(user_prompt)

        elif event_type == "continue_chat_auth":
            chat_id = data["chat_id"]
            await self.continue_chat_auth(chat_id, user_prompt)

        elif event_type == "continue_chat_free":
            await self.continue_chat_free(user_prompt)

    # Manage new chats events
    async def start_chat(self, user_prompt):

        new_chat = None

        if self.decoded_token:
            # CREATE CHAT TITLE
            title_prompt = f"Generate a descriptive title no longer than 100 characters for this user prompt: {user_prompt}"
            title_response = await http_client([
                {"role": "user", "content": title_prompt}
            ])
            title = title_response.choices[0].message.content

            # SAVE NEW CHAT
            new_chat = await self.create_chat(title)
            await self.send(
                text_data=json.dumps({
                    "event_type": "chat_created",
                    "chat_id": str(new_chat.id),
                })
            )

        # SEND PROMPT TO OPENROUTER
        full_message = ""

        async for chunk in stream_client([{"role": "user", "content": user_prompt}]):
            if chunk:
                full_message += chunk
                await self.send(text_data=json.dumps({"chunk": chunk}))

        await self.send(
            text_data=json.dumps({
                "event_type": "completed",
            })
        )

        if new_chat is not None:
            # SAVE USER MESSAGE
            await self.create_message(
                chat_id=new_chat.id, role="user", content=user_prompt
            )

            # SAVE ASSISTANT MESSAGE
            await self.create_message(
                chat_id=new_chat.id, role="assistant", content=full_message
            )

    # Manage existing chats events on authenticated users.
    async def continue_chat_auth(self, chat_id, user_prompt):

        if self.decoded_token:
            # VALIDATE IF USER OWNS THE CHAT
            is_valid = await self.validate_chat(chat_id)

            if not is_valid:
                await self.send(text_data=json.dumps({"error": "Chat not found"}))
                return

        # BUILD CONTEXT
        message_history = await self.get_message_history(chat_id)
        message_history.append({"role": "user", "content": user_prompt})

        # SEND CONTEXT
        full_message = ""

        async for chunk in stream_client(message_history):
            if chunk:
                full_message += chunk
                await self.send(text_data=json.dumps({"chunk": chunk}))

        await self.send(
            text_data=json.dumps({
                "event_type": "completed",
            })
        )

        if self.decoded_token:
            # SAVE USER MESSAGE
            await self.create_message(chat_id=chat_id, role="user", content=user_prompt)

            # SAVE ASSISTANT MESSAGE
            await self.create_message(
                chat_id=chat_id, role="assistant", content=full_message
            )

    # Manage existing chats events on free users.
    async def continue_chat_free(self, user_prompt):
        full_message = ""

        async for chunk in stream_client(user_prompt):
            if chunk:
                full_message += chunk
                await self.send(text_data=json.dumps({"chunk": chunk}))

        await self.send(
            text_data=json.dumps({
                "full_message": full_message,
            })
        )

        await self.send(
            text_data=json.dumps({
                "event_type": "completed",
            })
        )

    # SAVE CHAT INTO DB
    @database_sync_to_async
    def create_chat(self, title):

        user_id = self.decoded_token["user_id"]
        model = "openrouter/free"

        last_message_at = timezone.now()

        chat_data = {
            "user_id": user_id,
            "model": model,
            "title": title,
            "last_message_at": last_message_at,
        }

        return Chat.objects.create(**chat_data)

    # SAVE MESSAGE INTO DB
    @database_sync_to_async
    def create_message(self, chat_id, role, content):

        return Message.objects.create(
            chat_id=chat_id,
            role=role,
            content=content,
            metadata="",
        )

    # GET MESSAGE HISTORY
    @database_sync_to_async
    def get_message_history(self, chat_id):
        messages = (
            Message.objects
            .filter(chat_id=chat_id)
            .order_by("created_at")
            .values("role", "content")[:20]
        )
        return list(messages)

    # VALIDATE CHAT OWNER
    @database_sync_to_async
    def validate_chat(self, chat_id):

        user_id = self.decoded_token["user_id"]

        return Chat.objects.filter(
            id=chat_id,
            user_id=user_id,
        ).exists()
