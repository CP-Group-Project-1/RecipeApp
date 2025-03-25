import React from "react";
import { useAuth } from "../../api/useAuth";

export default function AuthButton() {
    const isAuthenticated = useAuth();

    const handleClick = () => {
        if (isAuthenticated) {
            const token = localStorage.getItem("token");
            console.log("Token:", token);
        } else {
            console.log("User is not authenticated.");
        }
    };

    return (
        <button onClick={handleClick}>
            Log Token
        </button>
    );
}
