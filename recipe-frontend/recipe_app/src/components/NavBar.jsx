import { useAuth } from "../../api/useAuth"
import { logout } from "../../api/AuthApi"
import { Link, useNavigate } from "react-router-dom";
import AuthButton from "./AuthButton";
import Search from "./Search";

export default function NavBar() {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
        <AuthButton />
        <button onClick={() => navigate('/')}>
                Home
        </button> 
        {!isAuthenticated && (
             <>
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
            </>
        )}
        <Search />
        <button onClick={handleLogout}>Logout</button>
        </>
    )
}