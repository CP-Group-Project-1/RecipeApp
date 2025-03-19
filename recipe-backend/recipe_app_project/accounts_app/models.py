from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


    
class CustomUserManager(BaseUserManager):
    """
        Custom user model manager, due to email being the unique username
            - Also needed to allow for creation of superuser, without this
             a superuser could not be created.
    """

    def create_user(self, email, password, **extra_fields):
        """ Create and save user """

        if not email:
            raise ValueError('Missing email')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        """ 
            Create and save a SuperUser
        """

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD = "email"  # makes email the login field
    REQUIRED_FIELDS = []  # WOthout this will throw SystemCheckError from DRF

    objects = CustomUserManager()
    def __str__(self):
        msg = f'Accoount created for User [${self.email}]'
       
        return msg
