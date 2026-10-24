import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isAdmin } from "../api";

/**
 * Admin-only route. This only controls what the UI shows; the backend enforces
 * the ADMIN role on every admin endpoint regardless of the client.
 */
const AdminRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin()) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

export default AdminRoute;
