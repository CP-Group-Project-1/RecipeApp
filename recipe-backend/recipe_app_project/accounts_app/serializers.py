
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
        print("Validated data:", validated_data)
        # Create user account
        user = User.objects.create_user(
            #username = validated_data['email'],
            password = validated_data['password'],
            email = validated_data['email']
        )
        
        return user
    
    
class UsersSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        #fields = '__all__'  # Return all fields
        fields = ['id', 'email', 'password']


    def update(self, instance, validated_data):
        """ Without this DRF will not allow update of email since its the Username """
        #import logging

        #logger = logging.getLogger(__name__)

        #logger.info('In UserSerializer update method')
        #logger.info(f'instance = {instance}')
        #logger.info(f'validated_data = {validated_data}')
        
        if "email" in validated_data:
            instance.email = validated_data['email']
        
        if "password" in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance

