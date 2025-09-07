import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'farmer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // redirect to login and preserve location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user && user.role !== requiredRole) {
    // if user is authenticated but does not have required role
    // send to their dashboard or home
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
