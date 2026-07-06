"""urls"""

from rest_framework import routers
from .views import ChatViewSet, MessageViewSet

router = routers.DefaultRouter()
router.register(r"chats", ChatViewSet, basename="chats")
router.register(r"chats/messages", MessageViewSet, basename="messages")
urlpatterns = router.urls
