from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"  # makes email the login field
    REQUIRED_FIELDS = []  # WOthout this will throw SystemCheckError from DRF


    def __str__(self):
        msg = f'Accoount created for User [${self.email}]'
       
        return msg
