import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const token = authService.getToken();
  const user = authService.getCurrentUser();
  const hostname = window.location.hostname;
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If password change is required, force redirect to /change-password
  if (user?.mustChangePassword && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  // Domain-based role checks to separate logins
  if (hostname === 'ecommerce.paidhuethicalfoods.com' && user?.role === 'ACCOUNTS_ADMIN') {
    authService.logout();
    alert("Access Denied: Accounts Admin must log in at accounts.paidhuethicalfoods.com");
    return <Navigate to="/login" replace />;
  }

  if (hostname === 'accounts.paidhuethicalfoods.com' && user?.role === 'ECOMMERCE_ADMIN') {
    authService.logout();
    alert("Access Denied: E-Commerce Admin must log in at ecommerce.paidhuethicalfoods.com");
    return <Navigate to="/login" replace />;
  }

  // If password change is NOT required but user manually visits /change-password, redirect to dashboard
  if (!user?.mustChangePassword && window.location.pathname === '/change-password') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
