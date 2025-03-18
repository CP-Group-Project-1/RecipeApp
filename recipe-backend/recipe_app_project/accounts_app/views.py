from rest_framework.generics import CreateAPIView
from rest_framework.views import Response
#from django.contrib.auth.models import User
from .models import User
from .serializers import SignUpSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.db.utils import IntegrityError

class UserSignUp(CreateAPIView):
    users = User.objects.all()
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        
        try:
            response = super().create(request, *args, **kwargs)
            user = User.objects.get(email=response.data['email'])  # Retrievs user object from serializer
            # Generate token
            token, created = Token.objects.get_or_create(user=user)
            msg = f"Account created for email [{response.data['email']}]"
            return Response({"message": msg, "token": token.key})
        except IntegrityError as err:
            # err.args is split to extract the details for whats needed
            return Response({"ERROR": err.args[0].split('DETAIL')[1]})


