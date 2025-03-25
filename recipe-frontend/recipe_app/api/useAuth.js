import { useState, useEffect } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState( 
        () => !!localStorage.getItem("token")
    );

     // Create a stable reference for the setter function
     const setAuth = (authenticated) => {
        if (authenticated) {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const syncAuthState = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        };

        // Listen for token changes (login/logout)
        window.addEventListener("auth-change", syncAuthState);
        return () => window.removeEventListener("auth-change", syncAuthState);
    }, []);

    return { isAuthenticated, setAuth};
}
