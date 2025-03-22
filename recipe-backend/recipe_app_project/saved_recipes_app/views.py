
from rest_framework.views import Response, APIView
from .models import Saved_Recipes
from .serializers import SavedRecipesSerializer
from django.core.exceptions import ValidationError
from accounts_app.models import User

class AllSavedRecipes(APIView):
    def get(self, request):
        """ This method returns all users recipes """
        saved_recipes = Saved_Recipes.objects.all()  # get all users saved recipes
        serialize_saved_recipes = SavedRecipesSerializer(saved_recipes, many=True)
        clean_serilize_data = SavedRecipesSerializer.serialize_clean(serialize_saved_recipes)
        
        #print(serialize_saved_recipes.data)
        return Response(clean_serilize_data)

class UserSavedRecipes(APIView):

    def get(self, request, user_id):
        """ This method returns a single user, saved recipes """
        saved_recipes = Saved_Recipes.objects.filter(user_id=user_id)  # get all recipes user saved
        serialize_saved_recipes = SavedRecipesSerializer(saved_recipes, many=True)
        clean_serilize_data = SavedRecipesSerializer.serialize_clean(serialize_saved_recipes)
        
        #print(serialize_saved_recipes.data)
        return Response(clean_serilize_data)
    
    def post(self, request, user_id):
        """ This method creates a new saved recipe """
        
        new_recipe = Saved_Recipes(
            idMeal = request.data['idMeal'],
            user_id = User.objects.get(pk=user_id),
            recipe_title = request.data['recipe_title'],
            meal_pic_img = request.data['meal_pic_img']
            #recipe_ingredients = request.data['recipe_ingredients']
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
    
class UserSingleRecipe(APIView):
     
     def get(self, request, user_id, recipe_id):
        """ This method returns a single user, saved recipes """
        saved_recipe = Saved_Recipes.objects.filter(pk=recipe_id)  # get all recipes user saved
        serialize_saved_recipe = SavedRecipesSerializer(saved_recipe, many=True)
        clean_serilize_data = SavedRecipesSerializer.serialize_clean(serialize_saved_recipe)
        
        #print(serialize_saved_recipes.data)
        return Response(clean_serilize_data)


     def delete(self, request, user_id, recipe_id):
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

        
        saved_recipe = Saved_Recipes.objects.get(pk=recipe_id)  # get saved_recipe instance by id 
        recipe_title = saved_recipe.recipe_title
        
        saved_recipe.delete()
        return Response(f'Recipe for [{recipe_title}], Record {recipe_id} has been removed ')