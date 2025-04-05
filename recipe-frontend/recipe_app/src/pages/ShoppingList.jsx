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

    const toFraction = (decimal) => {
        if (!decimal || isNaN(decimal)) return '';
        const tolerance = 1.0E-6;
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = decimal;
    
        do {
            const a = Math.floor(b);
            const aux = h1; h1 = a * h1 + h2; h2 = aux;
            const aux2 = k1; k1 = a * k1 + k2; k2 = aux2;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    
        const whole = Math.floor(h1 / k1);
        const remainder = h1 % k1;
    
        if (whole > 0 && remainder > 0) {
            return `${whole} ${remainder}/${k1}`;
        } else if (whole > 0) {
            return `${whole}`;
        } else {
            return `${h1}/${k1}`;
        }
    };
    

    // Sort alphabetically without mutating state
    const sortedShoppingList = [...shoppingList].sort((a, b) => a.item.localeCompare(b.item));

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

        <EmailShoppingListButton className="email-button" token={token} baseUrl={base_url} />
        {error && <p>{error}</p>}
        {loading && <p>Loading...</p>}
        <ul className="shopping-list">
            {sortedShoppingList.map(item => (
                <li key={item.id}>
                    <input
                    className="qty-input"
                    type="text"
                    value={newQty[item.id] !== undefined ? newQty[item.id] : toFraction(item.qty)}
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    placeholder="e.g. 1/2"
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
