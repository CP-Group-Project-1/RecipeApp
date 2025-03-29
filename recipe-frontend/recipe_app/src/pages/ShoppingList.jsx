import React, { useEffect, useState } from 'react';
import { fetchShoppingList, deleteShoppingListItem, updateShoppingListItem } from '../../api/AuthApi';

const ShoppingList = ({ base_url }) => {
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState(null);
    const [newQty, setNewQty] = useState({}); 

    useEffect(() => {
        async function fetchData() {
            const response = await fetchShoppingList(base_url);
            if (response.success) {
                setShoppingList(response.data);
            } else {
                setError(response.error);
            }
        }
        fetchData();
    }, [base_url]);

    const handleDelete = async (itemId) => {
        const response = await deleteShoppingListItem(base_url, itemId);
        if (response.success) {
            setShoppingList((prevList) => prevList.filter(item => item.id !== itemId));
        } else {
            alert("Error deleting item: " + response.error);
        }
    };

    const handleQtyChange = (itemId, value) => {
        setNewQty((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleSaveChanges = async () => {
        for (const item of shoppingList) {
            if (newQty[item.id] && newQty[item.id] !== item.qty) {
                const response = await updateShoppingListItem(base_url, item.id, newQty[item.id]);
                if (!response.success) {
                    alert(`Error updating item: ${item.item}`);
                    return;
                }
            }
        }
        alert("List has been Updated");
    };

    // Sort alphabetically
    const sortedShoppingList = shoppingList.sort((a, b) => {
        return a.item.localeCompare(b.item);
    });

    return (
        <div>
            <h1>Shopping List</h1>
            {error && <p>{error}</p>}
            <ul style={{ listStyleType: "none" }}>
                {sortedShoppingList.map(item => (
                    <li key={item.id}>
                        <div>
                            <input
                                type="number"
                                value={newQty[item.id] || item.qty}  
                                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                min="1"
                            />
                            {item.item} {item.measure || ''}
                            <button onClick={() => handleDelete(item.id)}>x</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
    );
};

export default ShoppingList;