import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const getToken = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  };

  const token = getToken();

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  // Render child routes if token exists
  return <Outlet />;
};

export default ProtectedRoute;