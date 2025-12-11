// src/components/guards.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { isAdmin, isAdminApproved, isSuperAdmin, getToken } from "../utils/auth";

export const RequireLogin = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
};

export const RequireAdminApproved = ({ children }) => {
  if (isAdmin() && isAdminApproved()) return children;
  return <Navigate to="/login" replace />;
};

export const RequireSuperAdmin = ({ children }) => {
  if (isSuperAdmin()) return children;
  return <Navigate to="/login" replace />;
};
