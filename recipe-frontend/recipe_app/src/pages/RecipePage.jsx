import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function RecipePage() {
    const { idMeal } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
        fetch(recipeUrl)
            .then((response) => response.json())
            .then((data) => setRecipe(data.meals[0]))
    }, [idMeal]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{recipe.strMeal}</h2>
            <img src={recipe.strMealThumb} alt={recipe.strMeal}/>
            <p>{recipe.strInstructions}</p>
            <ul>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
                    const ingredient = recipe[`strIngredient${num}`];
                    const measure = recipe[`strMeasure${num}`];
                    return (
                        ingredient && (
                            <li key={num}>
                                {measure} {ingredient}
                            </li>
                        )
                    );
                })}
            </ul>
        </div>
    );
}