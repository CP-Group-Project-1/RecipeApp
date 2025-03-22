import React from "react";
import { saveRecipe } from "../../api/AuthApi";

export default function SaveRecipeBtn({ recipe }) {
    const handleSave = async () => {
        //console.log('In_handleSave')
        //console.log(`recipe to save = ${JSON.stringify(recipe)}`)
        //console.log('Iterating thru recipe for ingerdient keys')

        /*const ingredientsArr = []  //Stores ingredients
        // Iterating thru recipe for strIngredient keys and saving data in array
        for(const tmpKey in recipe){
            if(tmpKey.includes('strIngredient')){
                console.log(`tmpKey = [${tmpKey}]`)
                // Checking for empty data
                if(recipe[tmpKey].trim().length != 0){
                    ingredientsArr.push(recipe[tmpKey])
                }
                
            }  
        }
        console.log(`ingredientsArr ${ingredientsArr}`)*/
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            alert("User not logged in");
            return;
        }

        const response = await saveRecipe(userId, {
            idMeal: recipe.idMeal,
            recipe_title: recipe.strMeal,
            meal_pic_img: recipe.strMealThumb
            //recipe_ingredients: ingredientsArr
        });

        if (response.success) {
            alert("Recipe saved successfully!");
        } else {
            alert("Error saving recipe: " + response.error);
        }
    };

    return (
        <button onClick={handleSave}>
            Save Recipe
        </button>
    );
}
