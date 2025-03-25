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

            <div style={{ display: "inline-block", marginLeft: "20px" }}>
                <h2>Search Recipe by:</h2>
                <button onClick={() => navigate('/bycat')}>Category</button> 
                <button onClick={() => navigate('/byingredient')}>Ingredient</button> 
                <button onClick={() => navigate('/bycuisine')}>Cuisines</button> 
            </div>
            <Search />
            <div style={{ float: "right" }}>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

// import { useAuth } from "../../api/useAuth"
// import { logout } from "../../api/AuthApi"
// import { useNavigate } from "react-router-dom";
// import AuthButton from "./AuthButton";
// import Search from "./Search";

// export default function NavBar() {
//     const isAuthenticated = useAuth();
//     const navigate = useNavigate();
    
//     const handleLogout = () => {
//         logout();
//         navigate("/login");
//     };

//     return (
//         <>
//         <AuthButton />
//         <button onClick={() => navigate('/')}>
//                 Home
//         </button> 
//         {!isAuthenticated && (
//              <>
//                 <Link to="/signup">Signup</Link>
//                 <Link to="/login">Login</Link>
//             </>
//         )}
//         <Search />
//         <button onClick={handleLogout}>Logout</button>
//         </>
//     )
// }