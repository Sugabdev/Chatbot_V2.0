from rest_framework import viewsets, status
from apps.chats.serializers import chatSerializer, messageSerializer
from apps.chats.models import Chat, Message
from rest_framework.response import Response


class ChatViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        chats = Chat.objects.filter(user=pk).order_by("created_at")

        serializer = chatSerializer(chats, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        chat = Chat.objects.filter(id=pk).first()

        if not chat:
            return Response(status=status.HTTP_404_NOT_FOUND)

        chat.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class MessageViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):

        chat_messages = Message.objects.filter(chat=pk).order_by("created_at")

        serializer = messageSerializer(chat_messages, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
