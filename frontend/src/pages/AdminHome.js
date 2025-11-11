// src/pages/AdminHome.js
import React from "react";
import { useNavigate } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";
import { isSuperAdmin } from "../utils/auth";
import "../styles/AdminDashboard.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const superAdmin = isSuperAdmin();

  return (
    <AdminRoute>
      <div className="ad-wrap">
        <div className="ad-card">
          <h1 className="ad-title">관리자 대시보드</h1>

          <p className="ad-desc" style={{ marginTop: 4, opacity: 0.8 }}>
            필요한 메뉴를 선택하세요.
          </p>

          <div className="ad-btns" style={{ display: "grid", gap: 12, marginTop: 20 }}>
            

            {/* 슈퍼관리자 전용: 관리자 승인 화면 */}
            {superAdmin && (
              <button
                className="ad-btn"
                onClick={() => navigate("/admin/approvals")}
                aria-label="관리자 승인 화면으로 이동"
              >
                관리자 승인 화면
              </button>
            )}

            {/* 예약 관리(전체 예약 조회) */}
            <button
              className="ad-btn"
              onClick={() => navigate("/admin/reservations")}
              aria-label="예약 관리 시스템으로 이동"
            >
              예약 관리 시스템
            </button>

            {/* 진료 이용내역/차트 편집 */}
            <button
              className="ad-btn"
              onClick={() => navigate("/admin/clinic")}
              aria-label="진료 관련 수정 화면으로 이동"
            >
              진료 관련 수정
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="ad-back" onClick={() => navigate(-1)} title="뒤로가기">
              ↩
            </button>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminHome;
