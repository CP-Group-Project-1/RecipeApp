from django.db import models
from accounts_app.models import User

class Saved_Recipes(models.Model):

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    idMeal = models.SmallAutoField(blank=False, unique=True)
    recipe_title = models.CharField(max_length=100, blank=False, unique=True)


    def __str__(self):
        msg = f'| user_id: {self.user_id} | idMeal: {self.idMeal} | recipe_title: {self.recipe_title}'
   
