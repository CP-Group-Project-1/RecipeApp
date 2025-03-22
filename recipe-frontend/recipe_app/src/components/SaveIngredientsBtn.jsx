import React from "react";

export default function SaveIngredientsBtn({ recipe }) {
    const handleSaveIngredients = () => {
        const ingredients = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if (ingredient) {
                ingredients.push({
                    ingredient,
                    measure,
                    quantity: 1,
                    checked: false,
                });
            }
        }

        const savedIngredients = JSON.parse(localStorage.getItem("shoppingList")) || [];

        const updatedList = [
            ...savedIngredients,
            ...ingredients.filter(item => 
                !savedIngredients.some(savedItem => savedItem.ingredient === item.ingredient)
            ),
        ];

        localStorage.setItem("shoppingList", JSON.stringify(updatedList));
        alert("Ingredients saved to shopping list!");
    };

    return <button onClick={handleSaveIngredients}>Save Ingredients to Shopping List</button>;
}
