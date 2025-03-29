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
        if id == 'single_user':
            user = User.objects.get(email=request.user.email) # For token request
        else:
            user = User.objects.get(pk=id)  # get user by id

        serialize_user = UsersSerializer(user)
        print(serialize_user.data)
        return Response(serialize_user.data)
    
    def delete(self, request, id):
        """ This method deletes a specific user profile """

        user = User.objects.get(pk=id)  # get user by id
        email = user.email
        user.delete()
        return Response(f'User [{email}], with user id [{id}] has been removed ')
    
    def put(self, request, id):
        """ This method updates a users information """

        user = User.objects.get(pk=id)  # get user by id 
        print(request.data)

        #user.full_clean()
        #user.save()
        """ 
            By default, serializers must be passed values for all required fields or 
            they will raise validation errors. You can use the partial argument in 
            order to allow partial updates.
            https://www.django-rest-framework.org/api-guide/serializers/
        """
        current_email = user.email
        current_pw = user.password
        serialize_user = UsersSerializer(instance=user, data=request.data, partial=True)

        if serialize_user.is_valid():
            serialize_user.save()
            msg = ''
            if serialize_user.data['email'] != current_email:
                msg += f'UPDATED, account email to [{serialize_user.data["email"]}]\n'

           
            if 'password' in request.data:
                if request.data['password'] != current_pw and msg != '':
                    msg += "Password updated"
                elif request.data['password'] != current_pw and msg == '':
                    msg += f'UPDATED, User [{serialize_user.data["email"]}] password'

            if msg == '':
                msg += f'No updates to apply for user [{serialize_user.data["email"]}]'

            return Response(msg)
        else:
            return Response(serialize_user.errors)

    
class AllUserProfiles(APIView):
    def get(self, request):
        """ This method returns all users """
        users = User.objects.all()  # get all users from table
        # Setting 'many=True' for nested representration
        serialize_users = UsersSerializer(users, many=True)
        print(serialize_users.data)
        return Response(serialize_users.data)


