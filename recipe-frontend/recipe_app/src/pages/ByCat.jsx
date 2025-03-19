import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ByCat() {
    const categoriesUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(categoriesUrl)
            .then((response) => response.json())
            .then((data) => {
                const sortedCategories = data.meals.sort((a, b) =>
                    a.strCategory.localeCompare(b.strCategory)
                );
                setCategories(sortedCategories);
            })
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const recipesUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
            fetch(recipesUrl)
                .then((response) => response.json())
                .then((data) => setRecipes(data.meals))
        }
    }, [selectedCategory]);

    const handleRecipeClick = (idMeal) => {
        navigate(`/recipe/${idMeal}`);
    };

    return (
        <>
            <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                <option value="">Select a Category</option>
                {categories.map((category) => (
                    <option key={category.strCategory} value={category.strCategory}>
                        {category.strCategory}
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
