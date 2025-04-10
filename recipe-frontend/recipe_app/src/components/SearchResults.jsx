import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, Typography, Box } from "@mui/material";

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchQuery = location.state?.searchQuery || '';

    useEffect(() => {
        if (searchQuery) {
            const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
            fetch(searchUrl)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResults(data.meals || []);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            navigate('/');
        }
    }, [searchQuery, navigate]);

    const handleRecipeClick = (idMeal) => {
        navigate(`/recipe/${idMeal}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Search Results for "{searchQuery}"
            </Typography>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : searchResults.length > 0 ? (
                <div className="recipe-list">
                    {searchResults.map((recipe) => (
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
            ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                    No recipes found for your search. Please try another term.
                </Typography>
            )}
        </Box>
    );
}