from rest_framework.generics import CreateAPIView
from rest_framework.views import Response, APIView
#from django.contrib.auth.models import User
from .models import User
from .serializers import SignUpSerializer, UsersSerializer
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
        
class SingleUser(APIView):
    def get(self, request, id):
        """ This method returns a user instance """

        user = User.objects.get(pk=id)  # get user by id
        serialize_user = UsersSerializer(user)
        print(serialize_user.data)
        return Response(serialize_user.data)
    
    def delete(self, request, id):
        """ This method deletes a specific user profile """

        user = User.objects.get(pk=id)  # get user by id  
        user.delete()
        return Response(f'User [{user.email}], with user id [{id}] has been removed ')
    
    def put(self, request, id):
        """ This method updates a users information """

        user = User.objects.get(pk=id)  # get user by id 
        print(request.data)

        user.full_clean()
        user.save()
        #serialize_user = UsersSerializer(user)
        
        #TODO: Maybe need a condition to render if nothing was changed
        msg = f"Updated for User [{user.email}] whose User Id is [{id}]"
        
        return Response(msg)


