import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user's authentication token exists in local storage
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token is found, redirect the user to the login page
    return <Navigate to="/login" replace />;
  }

  // If a token exists, show the page they requested (the children)
  return children;
};

export default ProtectedRoute;