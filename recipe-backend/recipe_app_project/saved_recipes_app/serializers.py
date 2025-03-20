
from rest_framework import serializers
from .models import Saved_Recipes

class SavedRecipesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Saved_Recipes
        fields = '__all__'  # Return all fields


