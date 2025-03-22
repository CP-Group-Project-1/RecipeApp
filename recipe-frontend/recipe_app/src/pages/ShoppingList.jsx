import React, { useState, useEffect } from "react";

export default function ShoppingList() {
    const [shoppingList, setShoppingList] = useState([]);
    const [editedList, setEditedList] = useState([]);

    useEffect(() => {
        const list = JSON.parse(localStorage.getItem("shoppingList")) || [];
        setShoppingList(list);
        setEditedList(list);
    }, []);


    const handleMeasureChange = (index, newMeasure) => {
        const updatedList = [...editedList];
        updatedList[index].measure = newMeasure;
        setEditedList(updatedList);
    };

    const handleCheckItem = (index) => {
        const updatedList = [...editedList];
        updatedList[index].checked = !updatedList[index].checked;
        setEditedList(updatedList);
    };

    const handleDeleteItem = (index) => {
        const updatedList = editedList.filter((_, i) => i !== index);
        setEditedList(updatedList);
    };

    const handleSaveChanges = () => {
        localStorage.setItem("shoppingList", JSON.stringify(editedList));
        alert("List saved");
    };

    return (
        <div>
            <h2>Shopping List</h2>
            {editedList.length === 0 ? (
                <p>Your shopping list is empty.</p>
            ) : (
                <ul>
                    {editedList.map((item, index) => (
                        <li key={index} style={{ listStyle:"none" }}>
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => handleCheckItem(index)}
                            />
                            <input
                                type="text"
                                value={item.measure}
                                onChange={(e) => handleMeasureChange(index, e.target.value)}
                                style={{ width: "100px", marginRight: "10px" }}
                            />
                            <span
                                style={{
                                    textDecoration: item.checked ? "line-through" : "none",
                                    marginRight: "10px",
                                }}
                            >
                                {item.ingredient}
                            </span>
                            <button onClick={() => handleDeleteItem(index)}>x</button>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={handleSaveChanges} style={{ marginTop: "20px" }}>
                Save Changes
            </button>
        </div>
    );
}
