import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SaveRecipeBtn from "../components/SaveRecipeBtn";
import ShopListBtn from "../components/SaveIngredientsBtn";


export default function RecipePage({base_url}) {
    const { idMeal } = useParams();
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();

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
            <SaveRecipeBtn recipe={recipe} base_url={base_url}/>
            <ShopListBtn recipe={recipe} base_url={base_url}/>
        
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