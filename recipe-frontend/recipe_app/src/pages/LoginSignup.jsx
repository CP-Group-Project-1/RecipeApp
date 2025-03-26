import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function LoginSignup({base_url}) {
    const [isLogin, setIsLogin] = useState(true);


    return (
        <div style={{ 
            maxWidth: "400px", 
            margin: "100px auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textAlign: 'center'
        }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "10px"}}>
                <button 
                    onClick={() => setIsLogin(true)} 
                    style={{ 
                        marginRight: "10px",
                        fontWeight: isLogin ? "bold" : "normal",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: isLogin ? "#333" : "#999"
                    }}
                >
                    Login
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    style={{ 
                        fontWeight: !isLogin ? "bold" : "normal",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        color: !isLogin ? "#333" : "#999"
                    }}
                >
                    Sign Up
                </button>
            </div>

            {isLogin ? <Login base_url={base_url}/> : <Signup base_url={base_url}/>}

        </div>
    );
}