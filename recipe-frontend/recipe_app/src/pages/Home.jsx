import { useNavigate } from "react-router-dom";
import { useAuth } from "../../api/useAuth";

export default function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div style={{ padding: "20px" }}>
            <h2>Welcome to Cook n Cart</h2>
            {/* The following is needed for to see login/signup */}
            {!isAuthenticated ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <p>Please login or sign up to access all features</p>
                    <button 
                        onClick={() => navigate('/auth')}
                        style={{ marginTop: "20px", padding: "10px 20px" }}
                    >
                        Login / Sign Up
                    </button>
                </div>
            ) : (
                <div style={{ marginTop: "30px" }}>
                    <h3>Browse Recipes By:</h3>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button onClick={() => navigate('/bycat')}>Category</button>
                        <button onClick={() => navigate('/byingredient')}>Ingredient</button>
                        <button onClick={() => navigate('/bycuisine')}>Cuisine</button>
                    </div>
                    
                    <div style={{ marginTop: "30px" }}>
                        <h3>Your Saved Content:</h3>
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button onClick={() => navigate('/saved')}>Saved Recipes</button>
                            <button onClick={() => navigate('/shoplist')}>Shopping List</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
