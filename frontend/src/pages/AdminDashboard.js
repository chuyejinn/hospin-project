// src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminApproved } from "../utils/auth";

const AdminDashboard = () => {
  const nav = useNavigate();
  useEffect(() => {
    if (!isAdminApproved()) {
      alert("승인된 관리자만 접근할 수 있습니다.");
      nav("/home");
    }
  }, [nav]);

  return (
    <div style={{ padding: 40 }}>
      <h1>관리자 홈</h1>
      <p>승인된 관리자만 볼 수 있는 영역입니다.</p>
      <ul>
        <li>예: 예약 관리</li>
        <li>예: 의료진 관리</li>
        <li>예: 공지/배너 관리</li>
      </ul>
    </div>
  );
};
export default AdminDashboard;
