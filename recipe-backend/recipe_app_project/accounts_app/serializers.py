
from rest_framework import serializers
#from django.contrib.auth.models import User
from .models import User

class SignUpSerializer(serializers.ModelSerializer):

     # Needed to allow
    email = serializers.EmailField()  # Used for enforcement of validation
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']
        
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        
        # Create user account
        user = User.objects.create_user(
            #username = validated_data['email'],
            password = validated_data['password'],
            email = validated_data['email']
        )
        
        return user
    
    
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #fields = '__all__'  # Return all fields
        fields = ['id', 'email']


    def update(self, usr_instance, validated_data):
        """ Without this DRF will not allow update of email since its the Username """
        
        if "email" in validated_data:
            usr_instance.email = validated_data['email']
        
        if "password" in validated_data:
            usr_instance.set_password(validated_data['password'])

        usr_instance.save()
        return usr_instance

