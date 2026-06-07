import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Wraps a route and redirects to /login if no auth token is found.
 * Usage: <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  // If no token, redirect to login immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // Otherwise, render the requested component
  return children;
};

export default ProtectedRoute;
