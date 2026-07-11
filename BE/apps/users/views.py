from rest_framework import viewsets, status
from rest_framework.response import Response
from apps.users.models import User
from apps.users.serializers import userSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


# USERS
class UserViewSet(viewsets.ViewSet):
    def create(self, request):

        serializer = userSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def partial_update(self, request, pk=None):

        user = User.objects.filter(id=pk).first()

        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = userSerializer(user, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):

        user = User.objects.filter(id=pk).first()

        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


# LOGIN
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):

        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")
        refresh = response.data.get("refresh")

        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            samesite="None",
            secure=True,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh,
            httponly=True,
            samesite="None",
            secure=True,
        )

        response.data = {"authenticated": True}

        return response


# LOGOUT
class LogoutView(APIView):
    def post(self, request):

        response = Response(
            {"authenticated": False},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


# AUTH ME SESSION
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response({
            "authenticated": True,
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })


# REFRESH SESSION
class RefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"authenticated": False}, status=401)

        request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")

        response.set_cookie(
            key="access_token",
            value=access,
            httponly=True,
            samesite="Lax",
            secure=False,
        )

        response.data = {"authenticated": True}

        return response
