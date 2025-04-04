import React from "react";
import { saveRecipe } from "../../api/AuthApi";
import { toast } from 'react-toastify';


export default function SaveRecipeBtn({ recipe, base_url }) {
    const handleSave = async () => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            toast.error("User not logged in");
            return;
        }

        const response = await saveRecipe(userId, {
            idMeal: recipe.idMeal,
            recipe_title: recipe.strMeal,
            meal_pic_img: recipe.strMealThumb
        }, base_url);

        if (response.success) {
            toast.success("Recipe saved successfully!");
        } else {
            toast.error("Error saving recipe: " + response.error);
        }
    };

    return (
        <>
            <button onClick={handleSave}>Save Recipe</button>
        </>
    );
}

