import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, checkSession, logout } = useAuth();

  useEffect(() => {
    // Check session validity
    if (isAuthenticated && !checkSession()) {
      logout();
    }
  }, [isAuthenticated, checkSession, logout]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
