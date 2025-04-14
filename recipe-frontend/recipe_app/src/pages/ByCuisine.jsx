import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

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
            <FormControl sx={{marginTop:"30px"}} fullWidth>
            <InputLabel>Select a Cuisine</InputLabel>
            <Select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                label ="Select a Cuisine"
                sx={{
                    // backgroundColor: "white",
                    // color: "#333",
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
                {cuisines.map((cuisine) => (
                    <MenuItem 
                        key={cuisine.strArea} 
                        value={cuisine.strArea} 
                        sx={{
                            fontSize: "18px",
                            "&:hover": {
                                backgroundColor: "#FE8427",
                            },
                        }}
                    >
                        {cuisine.strArea}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
            {recipes.length > 0 && (
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
            )}
        </>
    );
}
