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
        <div className="recipe-container">
            <div className="recipe-buttons">
                <SaveRecipeBtn recipe={recipe} base_url={base_url}/>
                <ShopListBtn recipe={recipe} base_url={base_url}/>
            </div>
            <h2>{recipe.strMeal}</h2>
                <img 
                    className="recipe-page-img"
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal} 
                    />

            <div className="recipe-ingr-inst">
                <div className="ingredients-container">
                    <h3>Ingredients:</h3>
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

                <div className="instructions-container">
                    <h3>Instructions:</h3>
                    {recipe.strInstructions
                        .replace(/STEP \d+\r\n\r\n/g, "")
                        .split(/\r\n+/)
                        .filter(step => step.trim() !== "")
                        .map((step, index) => (
                            <p key={index}>
                                <strong>STEP {index + 1}: </strong>{step}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
}


