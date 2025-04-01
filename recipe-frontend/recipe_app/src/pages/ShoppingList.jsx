import React, { useEffect, useState } from 'react';
import { fetchShoppingList, deleteShoppingListItem, updateShoppingListItem } from '../../api/AuthApi';
import EmailShoppingListButton from '../components/EmailShoppingListButton';

const ShoppingList = ({ base_url, token }) => {
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState(null);
    const [newQty, setNewQty] = useState({}); 
    const [loading, setLoading] = useState(false); // To manage loading state

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const response = await fetchShoppingList(base_url);
            if (response.success) {
                setShoppingList(response.data);
            } else {
                setError(response.error);
            }
            setLoading(false);
        }
        fetchData();
    }, [base_url]);

    const handleDelete = async (itemId) => {
        setLoading(true);
        const response = await deleteShoppingListItem(base_url, itemId);
        if (response.success) {
            setShoppingList((prevList) => prevList.filter(item => item.id !== itemId));
        } else {
            alert("Error deleting item: " + response.error);
        }
        setLoading(false);
    };

    const handleQtyChange = (itemId, value) => {
        setNewQty((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleSaveChanges = async () => {
        setLoading(true);
        let changesMade = false;

        for (const item of shoppingList) {
            if (newQty[item.id] && newQty[item.id] !== item.qty) {
                const response = await updateShoppingListItem(base_url, item.id, newQty[item.id]);
                if (!response.success) {
                    alert(`Error updating item: ${item.item}`);
                    return;
                }
                changesMade = true;
            }
        }

        if (changesMade) {
            alert("Shopping list has been updated!");
        } else {
            alert("No changes made to the shopping list.");
        }
        setLoading(false);
    };

    // Sort alphabetically without mutating state
    const sortedShoppingList = [...shoppingList].sort((a, b) => a.item.localeCompare(b.item));

    return (
        <div>
            <h1>Shopping List</h1>
            <EmailShoppingListButton token={token} baseUrl={base_url} />
            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>} {/* Show loading state */}
            <ul style={{ listStyleType: "none" }}>
                {sortedShoppingList.map(item => (
                    <li key={item.id}>
                        <div>
                            <input
                                type="number"
                                value={newQty[item.id] || Math.round(item.qty)}  
                                onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                min="1"
                            />
                            {item.item} {item.measure || ''}
                            <button onClick={() => handleDelete(item.id)}>x</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button 
                onClick={handleSaveChanges} 
                disabled={loading || Object.keys(newQty).length === 0} // Disable if no changes
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default ShoppingList;
