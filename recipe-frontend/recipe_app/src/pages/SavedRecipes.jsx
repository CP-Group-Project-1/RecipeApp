import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRecipe, deleteRecipe } from "../../api/AuthApi";

export default function SavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);

    const userId = localStorage.getItem("user_id");
        
        if (!userId) {
            alert("User not logged in");
            return;
        }

    useEffect(() => {
        //const storedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
        //Get Request
        

        async function retriveRecipe(){
            const response = await getRecipe(userId);
    
            if (response.success) {
                alert("Retrieved recipe successfully!");
                //console.log('DUMPING_RESPONSE')
                //console.log(response.data)
                setSavedRecipes(response.data)

                //Just to view the data in object(s)
                /*response.data.map((recipe) => (
                    console.log(recipe)

                ))*/
            } else {
                alert("Error retrieving recipe: " + response.error);
            }
        }
    
        retriveRecipe()
        //setSavedRecipes(storedRecipes);
        
    }, []);

    if (savedRecipes.length === 0) {
        return <p>No saved recipes yet!</p>;
    }

    const handleDeleteRecipe = async (idMeal, recipeId) => {
        const updatedRecipes = savedRecipes.filter(recipe => recipe.idMeal !== idMeal);
        setSavedRecipes(updatedRecipes);
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
        //console.log(`recipe ID for deletion = ${recipeId}`)
        deleteRecipe(userId, recipeId)
    };

    return (
        <div>
            <h2>Saved Recipes</h2>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe.idMeal} style={{ marginBottom: "1rem", listStyle:"none" }}>
                        {recipe.recipe_title} &nbsp;
                        <Link to={`/recipe/${recipe.idMeal}`}>
                            <img
                                //src={recipe.strMealThumb}
                                src={recipe.meal_pic_img}
                                //alt={recipe.strMeal}
                                alt={recipe.recipe_title}
                                style={{ width: "100px", height: "100px", marginRight: "1rem" }}
                            />
                            <span>{recipe.strMeal}</span>
                        </Link>
                        <button onClick={() => handleDeleteRecipe(recipe.idMeal, recipe.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
