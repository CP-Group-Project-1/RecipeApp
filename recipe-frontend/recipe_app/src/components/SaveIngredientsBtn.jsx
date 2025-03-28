import React from "react";
import { saveShoppingList } from "../../api/AuthApi";
import { useAuth } from "../../api/useAuth";

export default function SaveIngredientsBtn({ recipe, base_url }) {
    console.log('In_SaveIngredientsBtn')
    const isAuthenticated = useAuth();

    const handleSave = async () => {
        if (isAuthenticated) {
            const token = localStorage.getItem("token");
            console.log("Token:", token);

            // Prepare the meals data from the recipe
            const meals = [{
                idMeal: recipe.idMeal,
                strMeal: recipe.strMeal,
                strCategory: recipe.strCategory,
                strArea: recipe.strArea,
                strInstructions: recipe.strInstructions,
                strMealThumb: recipe.strMealThumb,
                strTags: recipe.strTags,
                strYoutube: recipe.strYoutube,
                // Loop through all ingredients and measures
                ...Array.from({ length: 20 }, (_, index) => {
                    return {
                        [`strIngredient${index + 1}`]: recipe[`strIngredient${index + 1}`],
                        [`strMeasure${index + 1}`]: recipe[`strMeasure${index + 1}`],
                    };
                }).reduce((acc, item) => ({ ...acc, ...item }), {}),
            }];

            // Send the data to the API
            const response = await saveShoppingList(token, { meals }, base_url);

            if (response.success) {
                alert("Ingredients saved successfully!");
            } else {
                alert("Error saving ingredients: " + response.error);
            }
        } else {
            alert("User is not authenticated.");
        }
    };

    return (
        <button onClick={handleSave}>Save Ingredients</button>
    );
}


// import React from "react";

// export default function SaveIngredientsBtn({ recipe }) {
//     const handleSaveIngredients = () => {
//         const ingredients = [];

//         for (let i = 1; i <= 20; i++) {
//             const ingredient = recipe[`strIngredient${i}`];
//             const measure = recipe[`strMeasure${i}`];

//             if (ingredient) {
//                 ingredients.push({
//                     ingredient,
//                     measure,
//                     quantity: 1,
//                     checked: false,
//                 });
//             }
//         }

//         const savedIngredients = JSON.parse(localStorage.getItem("shoppingList")) || [];

//         const updatedList = [
//             ...savedIngredients,
//             ...ingredients.filter(item => 
//                 !savedIngredients.some(savedItem => savedItem.ingredient === item.ingredient)
//             ),
//         ];

//         localStorage.setItem("shoppingList", JSON.stringify(updatedList));
//         alert("Ingredients saved to shopping list!");
//     };

//     return <button onClick={handleSaveIngredients}>Save Ingredients to Shopping List</button>;
// }
