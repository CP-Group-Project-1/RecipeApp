import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchedRef = useRef(false); // 👈 Prevent double-fetch

  const fetchRandomRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      setRecipe(data.meals[0]);
    } catch (error) {
      console.error('Error fetching recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return; // 👈 Already fetched? Don't run again.
    fetchedRef.current = true;
    fetchRandomRecipe();
  }, []);

  if (loading || !recipe) return <p>Loading random recipe...</p>;

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.idMeal}`);
  };

  return (
    <div className="random-container">
      <button style={{ background: "none" }} onClick={handleRecipeClick}>
        <h3 className="recipe-title-format1">{recipe.strMeal}</h3>
        <img 
          className="recipe-img"
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
        />
      </button>
    </div>
  );
};

export default RandomRecipe;
