import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SaveRecipeBtn from "../components/SaveRecipeBtn";
import ShopListBtn from "../components/SaveIngredientsBtn";

export default function RecipePage({ base_url }) {
  const { idMeal } = useParams();
  const [recipe, setRecipe] = useState(null);


  useEffect(() => {
    const recipeUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;
    fetch(recipeUrl)
      .then((response) => response.json())
      .then((data) => setRecipe(data.meals[0]));
  }, [idMeal]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const cleanInstructions = (instructions) => {
    if (!instructions) return [];

    let cleaned = instructions.replace(/\r\n/g, '\n').trim();
    cleaned = cleaned.replace(/STEP\s*\d+\s*[-:\.]?\s*/gi, '');

    const numberedStepRegex = /^\d+[\.\)]?\s+/;
    const rawLines = cleaned.split('\n').map(line => line.trim()).filter(Boolean);

    const numberedLines = rawLines.filter(line => numberedStepRegex.test(line));
    const isNumbered = numberedLines.length >= rawLines.length / 2;

    let steps;

    if (isNumbered) {
        steps = rawLines.map(line => line.replace(numberedStepRegex, '').trim());
    } else if (cleaned.includes('\n\n')) {
        steps = cleaned.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    } else {
        steps = cleaned.split(/(?<=[.!?])\s+(?=[A-Z])/).map(p => p.trim()).filter(Boolean);
    }

    return steps.map((step, index) => ({
        step,
        stepNumber: index + 1
    }));
};

  const formattedInstructions = cleanInstructions(recipe.strInstructions);

  return (
    <div className="recipe-container">
      <div className="recipe-buttons">
        <SaveRecipeBtn recipe={recipe} base_url={base_url} />
        <ShopListBtn recipe={recipe} base_url={base_url} />
      </div>
      <h2 style={{fontSize:"30px", marginBottom:"0px"}}>{recipe.strMeal}</h2>
      <div className="recipe-ingr-inst">
        <img className="recipe-page-img" src={recipe.strMealThumb} alt={recipe.strMeal} />
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
      </div>
      <div className="instructions-container">
        <h3 style={{textDecoration:"underline", fontSize:"20px"}} >Instructions:</h3>
        {formattedInstructions.map(({ step, stepNumber }) => (
          <p key={stepNumber}>
            <strong>STEP {stepNumber}:</strong> {step}
          </p>
    ))}
  </div>
    </div>
  );
}
