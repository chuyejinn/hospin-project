// src/pages/ReservationPatients.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";
import "../styles/AdminApprovals.css"; // 버튼/틀 스타일 재사용

const MOCK_RESERVATIONS = [
  { id: 11, name: "김민수", phone: "010-1111-2222",  dept: "구강외과",  datetime: "2025-11-02 14:30", status: "대기" },
  { id: 12, name: "박나리", phone: "010-3333-4444",  dept: "교정과",    datetime: "2025-11-03 10:00", status: "확정" },
  { id: 13, name: "이진우", phone: "010-5555-6666",  dept: "보철과",    datetime: "2025-11-04 16:00", status: "대기" },
];

export default function ReservationPatients() {
  const navigate = useNavigate();
  const [rows] = useState(MOCK_RESERVATIONS);

  return (
    <AdminRoute type="super">
      <div className="ap-wrapper">
        <div className="ap-head">
          <div className="ap-title">
            <span className="ap-plus">＋</span>
            <span>예약 환자 정보</span>
          </div>

          <button className="ap-res-btn" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
        </div>

        <div className="ap-panel">
          <div className="ap-table">
            <div className="ap-thead">
              <div className="cell header">환자명</div>
              <div className="cell header">연락처</div>
              <div className="cell header">진료과</div>
              <div className="cell header">예약일시</div>
              <div className="cell header">상태</div>
            </div>

            {rows.map((r) => (
              <div className="ap-row" key={r.id}>
                <div className="cell">{r.name}</div>
                <div className="cell">{r.phone}</div>
                <div className="cell">{r.dept}</div>
                <div className="cell">{r.datetime}</div>
                <div className="cell">{r.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
