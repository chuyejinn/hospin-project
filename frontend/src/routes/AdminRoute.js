// src/routes/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn, isAdminApproved, isAdminPending, isSuperAdmin } from "../utils/auth";

// type: "approved" | "pending" | "super"
export default function AdminRoute({ type = "approved", children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  if (type === "super") {
    return isSuperAdmin() ? children : <Navigate to="/home" replace />;
  }

  if (type === "pending") {
    return isAdminPending() ? children : <Navigate to="/home" replace />;
  }

  // approved
  return isAdminApproved() ? children : <Navigate to="/admin/pending" replace />;
}
