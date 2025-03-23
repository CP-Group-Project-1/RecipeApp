import { useAuth } from "../../api/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const isAuthenticated = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;