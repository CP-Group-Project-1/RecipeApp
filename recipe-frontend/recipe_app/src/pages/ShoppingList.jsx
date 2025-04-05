import React, { useEffect, useState } from 'react';
import { fetchShoppingList, deleteShoppingListItem, updateShoppingListItem, clearShoppingList } from '../../api/AuthApi';
import EmailShoppingListButton from '../components/EmailShoppingListButton';
import { toast } from 'react-toastify';

const ShoppingList = ({ base_url, token }) => {
    const [shoppingList, setShoppingList] = useState([]);
    const [error, setError] = useState(null);
    const [newQty, setNewQty] = useState({}); 
    const [loading, setLoading] = useState(false);

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
            toast.success("Item deleted successfully!", { autoClose: 2000 });
        } else {
            toast.error("Error deleting item: " + response.error, { autoClose: 2000 });
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
                    toast.error(`Error updating item: ${item.item}`, { autoClose: 2000 });
                    setLoading(false);
                    return;
                }
                changesMade = true;
            }
        }
    
        setLoading(false);
    
        if (changesMade) {
            toast.success("Shopping list has been updated!", { autoClose: 2000 });
        } else {
            toast.error("No changes made to the shopping list.", { autoClose: 2000 });
        }
    };

    const handleClearAll = async () => {
        setLoading(true);
        const response = await clearShoppingList(base_url);
        if (response.success) {
            setShoppingList([]);
            toast.success("All items cleared!", { autoClose: 2000 });
        } else {
            toast.error("Error clearing shopping list: " + response.error, { autoClose: 2000 });
        }
        setLoading(false);
    };
    
    // Sort alphabetically without mutating state
    const sortedShoppingList = [...shoppingList].sort((a, b) => a.item.localeCompare(b.item));

    if (loading) {
        return <p>Loading...</p>;  // Show "Loading..." while fetching
    }

    return (
        <div className="shopping-list-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    className="clear-button"
                    onClick={handleClearAll}
                    disabled={loading || shoppingList.length === 0}
                >
                    {loading ? 'Clearing...' : 'Clear List'}
                </button>
            </div>

            <h1>Shopping List</h1>

            {/* Only show the Email button if there are items in the list */}
            {shoppingList.length > 0 && (
                <EmailShoppingListButton className="email-button" token={token} baseUrl={base_url} />
            )}

            {error && <p>{error}</p>}
            <ul className="shopping-list">
                {sortedShoppingList.map(item => (
                    <li key={item.id}>
                        <input
                            className="qty-input"
                            type="number"
                            value={newQty[item.id] || Math.round(item.qty)}  
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                            min="1"
                        />
                        <span className="ingredient-name">{item.item} {item.measure || ''}</span>
                        <button onClick={() => handleDelete(item.id)}>
                            x
                        </button>
                    </li>
                ))}
            </ul>

            <button 
                className="save-button"
                onClick={handleSaveChanges} 
                disabled={loading || Object.keys(newQty).length === 0}
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
};

export default ShoppingList;
