import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  const user = authService.getCurrentUser();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If password change is required, force redirect to /change-password
  if (user?.mustChangePassword && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // If password change is NOT required but user manually visits /change-password, redirect to dashboard
  if (!user?.mustChangePassword && window.location.pathname === '/change-password') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
