import { useAuth } from "../../api/useAuth"
import { logout } from "../../api/AuthApi"
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
        <button onClick={() => navigate('/')}>
                Home
        </button> 
        {!isAuthenticated && (
             <>
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
            </>
        )}
        {!isAuthenticated && (
            <>
                <button onClick={() => navigate('/saved')}>
                        Saved
                    </button> 

                <button onClick={() => navigate('/shoplist')}>
                    Shopping List
                </button> 

                <div>
                <h2>Search Recipe by:</h2>
                <button onClick={() => navigate('/bycat')}>
                    Category
                </button> 

                <button onClick={() => navigate('/byingredient')}>
                    Ingredient
                </button> 

                <button onClick={() => navigate('/bycuisine')}>
                    Cuisines
                </button> 

                <button onClick={handleLogout}>Logout</button>

                </div>
            </>
        )}
        </>
    )
}