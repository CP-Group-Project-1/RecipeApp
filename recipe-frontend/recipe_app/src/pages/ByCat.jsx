import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";


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
        <FormControl sx={{marginTop:"30px"}} fullWidth>
            <InputLabel>Select a Category</InputLabel>
            <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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
                {categories.map((category) => (
                    <MenuItem 
                        key={category.strCategory} 
                        value={category.strCategory} 
                        sx={{
                            fontSize: "18px",
                            "&:hover": {
                                backgroundColor: "#FE8427",
                            },
                        }}
                    >
                        {category.strCategory}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>


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

// #FE8427
// #05324D
// #3EA79D
// #FFD23A
