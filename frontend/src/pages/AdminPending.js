// src/pages/AdminPending.js
import React from "react";
import AdminRoute from "../routes/AdminRoute";
import { getAuth } from "../utils/auth";
import "../styles/AdminPending.css";

export default function AdminPending() {
  const me = getAuth();
  const email = me?.email || "debug@example.com";

  return (
    <AdminRoute type="pending">
      <div className="ap-wrapper">
        <div className="ap-card">
          {/* 헤더 */}
          <div className="ap-header">
            <div className="ap-icon">ADM</div>
            <h1 className="ap-title">관리자 승인 대기</h1>
          </div>

          <p className="ap-sub">
            관리자로 신청이 완료되었습니다. 운영자의 승인이 끝나면 관리자 기능을 사용할 수 있습니다.
          </p>

          {/* 현재 상태 */}
          <div className="ap-status">
            <span className="ap-badge wait">승인 대기</span>
            <span className="ap-email">신청 이메일: {email}</span>
          </div>

          {/* 단계 가이드 */}
          <ul className="ap-steps">
            <li className="ap-step">
              <div className="ap-step-index">1</div>
              <div className="ap-step-title">관리자 승인 검토 중</div>
              <div className="ap-step-label">운영자가 승인 후 자동 반영됩니다</div>
            </li>
            <li className="ap-step">
              <div className="ap-step-index">2</div>
              <div className="ap-step-title">관리자 대시보드 활성화</div>
              <div className="ap-step-label">승인 후 좌측 메뉴에서 자동으로 보입니다</div>
            </li>
            <li className="ap-step">
              <div className="ap-step-index">3</div>
              <div className="ap-step-title">권한 새로고침</div>
              <div className="ap-step-label">권한 반영이 늦으면 로그아웃 후 재로그인하세요</div>
            </li>
          </ul>

      
          {/* 액션 버튼 */}
          <div className="ap-actions">
            <button className="ap-btn ghost" onClick={() => window.history.back()}>
              뒤로
            </button>
            <button className="ap-btn" onClick={() => window.location.reload()}>
              새로고침
            </button>
            <button className="ap-btn primary" onClick={() => (window.location.href = "/")}>
              홈으로
            </button>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
