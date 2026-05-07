import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-600/20 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard if they try to access unauthorized role routes
    const dashboardMap = {
      student: '/student/dashboard',
      staff: '/staff/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
