import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipe, deleteRecipe } from "../../api/AuthApi";

export default function SavedRecipes({base_url}) {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            alert("User not logged in");
            return;
        }

        async function fetchRecipes() {
            const response = await getRecipe(base_url, userId);
            if (response.success) {
                setSavedRecipes(response.data);
            } else {
                alert("Error retrieving recipes: " + response.error);
            }
        }

        fetchRecipes();
    }, [userId]);

    const handleDeleteRecipe = async (idMeal, recipeId) => {
        const response = await deleteRecipe(base_url, userId, recipeId);
        if (response.success) {
            setSavedRecipes((prevRecipes) => prevRecipes.filter(recipe => recipe.idMeal !== idMeal));
        } else {
            alert("Error deleting recipe: " + response.error);
        }
    };

    if (!savedRecipes.length) {
        return <p>No saved recipes yet!</p>;
    }

    return (
        <div>
            <h2>Saved Recipes</h2>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe.id}>
                        <Link to={`/recipe/${recipe.idMeal}`}>
                            <img
                                src={recipe.meal_pic_img}
                                alt={recipe.recipe_title}
                                style={{ width: "100px", height: "100px", marginRight: "1rem" }}
                            />
                            <span>{recipe.recipe_title}</span>
                        </Link>
                        <button onClick={() => handleDeleteRecipe(recipe.idMeal, recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
