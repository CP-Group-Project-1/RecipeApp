import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);

    useEffect(() => {
        const storedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
        setSavedRecipes(storedRecipes);
    }, []);

    if (savedRecipes.length === 0) {
        return <p>No saved recipes yet!</p>;
    }

    const handleDeleteRecipe = (idMeal) => {
        const updatedRecipes = savedRecipes.filter(recipe => recipe.idMeal !== idMeal);
        setSavedRecipes(updatedRecipes);
        localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
    };

    return (
        <div>
            <h2>Saved Recipes</h2>
            <ul>
                {savedRecipes.map((recipe) => (
                    <li key={recipe.idMeal} style={{ marginBottom: "1rem", listStyle:"none" }}>
                        <Link to={`/recipe/${recipe.idMeal}`}>
                            <img
                                src={recipe.strMealThumb}
                                alt={recipe.strMeal}
                                style={{ width: "100px", height: "100px", marginRight: "1rem" }}
                            />
                            <span>{recipe.strMeal}</span>
                        </Link>
                        <button onClick={() => handleDeleteRecipe(recipe.idMeal)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
