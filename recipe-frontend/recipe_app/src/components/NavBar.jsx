import { useAuth } from "../../api/useAuth"
import { logout } from "../../api/AuthApi"
import { useNavigate } from "react-router-dom";
import AuthButton from "./AuthButton";
import { useState, useEffect } from "react";
import Search from "./Search";


export default function NavBar() {
    const navigate = useNavigate();
    const { isAuthenticated, setAuth } = useAuth();
    const [visible, setVisible] = useState(isAuthenticated);

    useEffect(() => {
        setVisible(isAuthenticated);
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout(setAuth);
        navigate("/");
        window.location.reload();
    };

    if (!visible) return null;

   

    return (
        <div style={{ padding: "10px"}}>
            <AuthButton />
            <button onClick={() => navigate('/')}>Home</button> 
            <button onClick={() => navigate('/saved')}>Saved</button>
            <button onClick={() => navigate('/shoplist')}>Shopping List</button> 
            
            <Search />
            
            <div style={{ float: "right" }}>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
