"""urls"""

from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet, LoginView, LogoutView, MeView, RefreshView

router = routers.DefaultRouter()
router.register(r"users", UserViewSet, basename="user")

auth_patterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("refresh/", RefreshView.as_view(), name="refresh"),
]

urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include(auth_patterns)),
]
