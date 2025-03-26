import { useNavigate } from "react-router-dom";

export default function Search() {
    const navigate = useNavigate();

    return (
        <div style={{ display: "inline-block", marginLeft: "20px" }}>
            <h2>Search Recipe by:</h2>
            <button onClick={() => navigate('/bycat')}>Category</button> 
            <button onClick={() => navigate('/byingredient')}>Ingredient</button> 
            <button onClick={() => navigate('/bycuisine')}>Cuisines</button>
        </div>
    );
}