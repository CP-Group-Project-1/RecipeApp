import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

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
        <FormControl sx={{marginTop:"30px"}} fullWidth>
            <InputLabel>Select a Category</InputLabel>
            <Select
                value={selectedIngredient}
                onChange={(e) => setSelectedIngredient(e.target.value)}
                label ="Select a Category"
                sx={{
                    backgroundColor: "white",
                    color: "#333",
                    fontSize: "16px",
                    borderRadius: "8px",
                    paddingBottom: "10px",
                    height: "60px",
                    width: "100%",
                    "& .MuiSelect-select": {
                        display: "flex",
                        justifyContent: "center", 
                        alignItems: "center",
                        fontSize: "26px",
                        textDecoration: "underline",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                    },
                        }}
            >
                {ingredients.map((ingredient) => (
                    <MenuItem 
                        key={ingredient.strIngredient} 
                        value={ingredient.strIngredient} 
                        sx={{
                            fontSize: "18px",
                            "&:hover": {
                                backgroundColor: "#FE8427",
                            },
                        }}
                    >
                        {ingredient.strIngredient}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
           
            <h1 className="selected-title">{selectedIngredient}</h1>
            {recipes.length > 0 && (
                <ul>
                    {recipes.map((recipe) => (
                        <div className="recipe-list">
                        {recipes.map((recipe) => (
                            <div key={recipe.idMeal} className="recipe-container">
                                <button className="recipe-format" onClick={() => handleRecipeClick(recipe.idMeal)}>
                                    {recipe.strMeal}
                                </button>
                                <img 
                                    className="recipe-img" 
                                    onClick={() => handleRecipeClick(recipe.idMeal)}
                                    src={recipe.strMealThumb} 
                                    alt={recipe.strMeal} 
                                />
                            </div>
                        ))}
                    </div>
                    ))}
                </ul>
            )}
        </>
    );
}
