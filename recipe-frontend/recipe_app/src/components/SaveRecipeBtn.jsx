import React from "react";
import { saveRecipe } from "../../api/AuthApi";

export default function SaveRecipeBtn({ recipe, base_url }) {
    const handleSave = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("User not logged in");
            return;
        }

        const response = await saveRecipe(userId, {
            idMeal: recipe.idMeal,
            recipe_title: recipe.strMeal,
            meal_pic_img: recipe.strMealThumb
            //recipe_ingredients: ingredientsArr
        }, base_url);

        if (response.success) {
            alert("Recipe saved successfully!");
        } else {
            alert("Error saving recipe: " + response.error);
        }
    };

    return (
        <button onClick={handleSave}>
            Save Recipe
        </button>
    );
}
