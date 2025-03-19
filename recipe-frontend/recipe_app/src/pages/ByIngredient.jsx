import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ByIngredient() {
    const ingredientsUrl = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState("");
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(ingredientsUrl)
            .then((response) => response.json())
            .then((data) => {
                const sortedIngredients = data.meals.sort((a, b) =>
                    a.strIngredient.localeCompare(b.strIngredient)
                );
                setIngredients(sortedIngredients);
            })
    }, []);

    useEffect(() => {
        if (selectedIngredient) {
            const recipesUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${selectedIngredient}`;
            fetch(recipesUrl)
                .then((response) => response.json())
                .then((data) => setRecipes(data.meals))
        }
    }, [selectedIngredient]);

    const handleRecipeClick = (idMeal) => {
        navigate(`/recipe/${idMeal}`);
    };

    return (
        <>
            <select onChange={(e) => setSelectedIngredient(e.target.value)} value={selectedIngredient}>
                <option value="">Select an Ingredient</option>
                {ingredients.map((ingredient) => (
                    <option key={ingredient.strIngredient} value={ingredient.strIngredient}>
                        {ingredient.strIngredient}
                    </option>
                ))}
            </select>

            {recipes.length > 0 && (
                <ul>
                    {recipes.map((recipe) => (
                        <li key={recipe.idMeal}>
                            <button onClick={() => handleRecipeClick(recipe.idMeal)}>
                                {recipe.strMeal}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
