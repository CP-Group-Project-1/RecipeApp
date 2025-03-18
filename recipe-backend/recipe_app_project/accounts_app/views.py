from rest_framework.generics import CreateAPIView
from rest_framework.views import Response
from django.contrib.auth.models import User
from .serializers import SignUpSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

class UserSignUp(CreateAPIView):
    users = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    """
    def perform_create(self, serialized_data):
        # Check if serialized_data is valid
        print('Hello')
        if serialized_data.is_valid():
            user_name = serialized_data.validated_data['username']
            pw = serialized_data.validated_data['password']
            User.objects.create_user(username=user_name, password=pw)
            msg = f"Account created for usersname [${user_name}]"
            return Response(msg)
    """
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])  # Retrievs user object from serializer
        # Generate token
        token, created = Token.objects.get_or_create(user=user)
        return Response({"message": "Account created", "token": token.key})


