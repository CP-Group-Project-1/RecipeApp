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
            <h1 className="selected-title1">Saved Recipes</h1>
            <ul className="recipe-list1">
                {savedRecipes.map((recipe) => (
                    <li className="recipe-container1" key={recipe.id}>
                        <button style={{alignSelf:"flex-end"}} onClick={() => handleDeleteRecipe(recipe.idMeal, recipe.id)}>x</button>
                        <Link to={`/recipe/${recipe.idMeal}`} style={{ color:"black", textDecoration:"none" }}>
                        <span>
                            <div className="recipe-title-format">{recipe.recipe_title}
                            </div>
                            </span>
                            <img
                                className="recipe-img"
                                src={recipe.meal_pic_img}
                                alt={recipe.recipe_title}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
