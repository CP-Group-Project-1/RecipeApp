import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    
    return (
        <>
            <h2>Home Page</h2>
            
            <button onClick={() => navigate('/login')}>
                Login
            </button> 

            <button onClick={() => navigate('/signup')} style={{ marginLeft: "10px"  }}>
                Sign Up
            </button>
    
        </>
    )
}