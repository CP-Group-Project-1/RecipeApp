
from rest_framework.views import Response, APIView
from .models import Saved_Recipes
from .serializers import SavedRecipesSerializer
from django.core.exceptions import ValidationError
from accounts_app.models import User

class AllSavedRecipes(APIView):
    def get(self, request):
        """ This method returns all users recipes """
        saved_recipes = Saved_Recipes.objects.all()  # get all users from table
        # Setting 'many=True' for nested representration
        serialize_saved_recipes = SavedRecipesSerializer(saved_recipes, many=True)
        print(serialize_saved_recipes.data)
        return Response(serialize_saved_recipes.data)

class UserSavedRecipes(APIView):

    def get(self, request, id):
        """ This method returns user single saved recipes """
        saved_recipes = Saved_Recipes.objects.get(pk=id)  # get category instance by id
        serialize_saved_recipes = SavedRecipesSerializer(saved_recipes)
        print(serialize_saved_recipes.data)
        return Response(serialize_saved_recipes.data)
    
    def delete(self, request, id):
        """ This method delets a specific recipe record """
        
        print(request.data)
        """
            Have for debugging purposes to see output in browser
        try:
            id = request.data['id']
        except MultiValueDictKeyError as err:
            msg = f"ERROR: Key error request.data = {request.data} | REASON: {err} | fk_user_id = {fk_user_id} | maint_id = {maint_id}"
            return Response(msg)
        """

        
        saved_recipes = Saved_Recipes.objects.get(pk=id)  # get category instance by id 
        recipe_title = saved_recipes.recipe_title

        saved_recipes.delete()
        return Response(f'Recipe for [{recipe_title}], Record {id} has been removed ')
    
    def post(self, request):
        """ This method creates a new item """
        
        new_recipe = Saved_Recipes(
            idMeal = request.data['idMeal'],
            user_id = User.objects.get(pk=request.data['user_id'])
            recipe_title = request.data['recipe_title']
        )
        
        
        try:
            new_recipe.full_clean()
        except ValidationError as err:
            msg = f"ERROR: Unable to create new recipe | REASON: {err.message_dict}"
            return Response(msg)

        new_recipe.save()
        serialize_new_recipe = SavedRecipesSerializer(new_recipe)
        print(serialize_new_recipe.data)

        msg = f'New Recipe [{new_recipe.recipe_title} Created.'
        #return Response(serialize_user.data)
        return Response(msg)