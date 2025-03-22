"""
This script injects sample data into the database for development.

Usage: python manage.py shell < inject.py
"""

from accounts_app.models import User
from saved_recipes_app.models import Saved_Recipes
from rest_framework.authtoken.models import Token

# ==============================
# Create Users with Password "birdistheword"
# ==============================
user_data = [
    {"email": "peter.griffin@quahog.com"},
    {"email": "marge.simpson@springfield.com"},
    {"email": "rick.sanchez@citadel.com"}
]

users = []
for user_info in user_data:
    user = User.objects.create_user(email=user_info["email"], password="birdistheword")  # ✅ Set same password
    Token.objects.create(user=user)  # Generate auth token for the user
    users.append(user)

# ==============================
# Create Saved Recipes
# ==============================
recipe_data = [
    {"idMeal": "52772", "strMeal": "Teriyaki Chicken Casserole"},
    {"idMeal": "52893", "strMeal": "Beef Stroganoff"},
    {"idMeal": "52948", "strMeal": "Spaghetti Carbonara"},
    {"idMeal": "52977", "strMeal": "Chicken Alfredo"},
    {"idMeal": "53013", "strMeal": "Tandoori Chicken"},
    {"idMeal": "53064", "strMeal": "Shrimp Scampi"},
    {"idMeal": "52768", "strMeal": "Lasagna"},
    {"idMeal": "52785", "strMeal": "Chili Con Carne"},
    {"idMeal": "52912", "strMeal": "Lemon Garlic Salmon"}
]

# Assign 3 recipes to each user
saved_recipes = []
for i, user in enumerate(users):
    user_recipes = recipe_data[i * 3: (i + 1) * 3]  # Get 3 unique recipes for each user
    for recipe in user_recipes:
        saved_recipe = Saved_Recipes.objects.create(
            user_id=user,
            idMeal=recipe["idMeal"],
            recipe_title=recipe["strMeal"]
        )
        saved_recipes.append(saved_recipe)

print("✅ Sample users and saved recipes injected successfully!")