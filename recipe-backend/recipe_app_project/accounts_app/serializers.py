
from rest_framework import serializers
from django.contrib.auth.models import User
#from user_app.models import UserProfile

class SignUpSerializer(serializers.ModelSerializer):

     # Needed to allow
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = User
        fields = ['email']
        
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract user-related fields **without modifying validated_data**
        #user_profile_data_dict = {}
        #user_profile_fields = ['first_name', 'last_name', 'email',
                    #'street_number', 'street_name', 'zip_code', 'city', 'state']
        
        # Itearate thru fields and use as a key to get value in validaeted_data
        #for field in user_profile_fields:
            #user_profile_data_dict[field] = validated_data[field]

        # Create user account
        user = User.objects.create_user(
            username = validated_data['email'], 
            password = validated_data['password'],
            email = validated_data['email']
        )
        
        # Create UserProfile
        #UserProfile.objects.create(user=user, **user_profile_data_dict)

        return user

