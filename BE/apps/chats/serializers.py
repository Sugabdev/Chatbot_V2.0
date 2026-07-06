from rest_framework import serializers
from apps.chats.models import Chat, Message


class chatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ["id", "user", "title", "model", "created_at", "last_message_at"]


class messageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "chat", "role", "content", "created_at"]
