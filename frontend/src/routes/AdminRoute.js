import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");         // 'ADMIN' | 'PATIENT' 등
  const approved = localStorage.getItem("adminApproved") === "true";

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/home" replace />;
  if (!approved) return <Navigate to="/admin-pending" replace />;

  return children;
}
