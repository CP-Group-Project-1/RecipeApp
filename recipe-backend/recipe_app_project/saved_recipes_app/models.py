from django.db import models
from accounts_app.models import User
from .validators import validate_id_meal

class Saved_Recipes(models.Model):

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    idMeal = models.CharField(max_length=5, blank=False, unique=True, validators=[validate_id_meal])
    recipe_title = models.CharField(max_length=100, blank=False, unique=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['idMeal', 'recipe_title'], name='unique_recipe')]


    def __str__(self):
        msg = f'| user_id: {self.user_id} | idMeal: {self.idMeal} | recipe_title: {self.recipe_title}'
        return msg
   
