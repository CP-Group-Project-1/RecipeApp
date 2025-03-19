import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ByCuisine() {
    const cuisineUrl = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState("");
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(cuisineUrl)
            .then((response) => response.json())
            .then((data) => {
                const sortedCuisines = data.meals.sort((a, b) =>
                    a.strArea.localeCompare(b.strArea)
                );
                setCuisines(sortedCuisines);
            })
    }, []);

    useEffect(() => {
        if (selectedCuisine) {
            const recipesUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedCuisine}`;
            fetch(recipesUrl)
                .then((response) => response.json())
                .then((data) => setRecipes(data.meals))
        }
    }, [selectedCuisine]);

    const handleRecipeClick = (idMeal) => {
        navigate(`/recipe/${idMeal}`);
    };

    return (
        <>
            <select onChange={(e) => setSelectedCuisine(e.target.value)} value={selectedCuisine}>
                <option value="">Select a Cuisine</option>
                {cuisines.map((cuisine) => (
                    <option key={cuisine.strArea} value={cuisine.strArea}>
                        {cuisine.strArea}
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
