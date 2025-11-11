// src/pages/App.js
import "../axios-setup";
import React from "react";
import { Routes, Route } from "react-router-dom";

/* ===== 사용자 페이지 ===== */
import Main from "../components/Main";
import MedicalRecord from "./MedicalRecord";
import OnlineReservation from "./OnlineReservation";
import DepartmentRecommendation from "./DepartmentRecommendation";
import HospitalInfo from "./HospitalInfo";
import Login from "./Login";
import MedicalStaff from "./MedicalStaff";
import Signup from "./Signup";
import AIDepartmentRecommendation from "./AIDepartmentRecommendation";

/* ===== 관리자 페이지 ===== */
import AdminHome from "./AdminHome";
import AdminPending from "./AdminPending";
import AdminApprovals from "./AdminApprovals";
import AdminReservations from "./AdminReservations";           // ✅ 전체 예약(관리자)
import ReservationPatientDetail from "./ReservationPatientDetail";

/* ✅ 추가: 진료이용내역(관리자 편집) */
import AdminRecordsEdit from "./AdminRecordsEdit";

export default function App() {
  return (
    <Routes>
      {/* 기본 */}
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Main />} />

      {/* 사용자 */}
      <Route path="/medical-record" element={<MedicalRecord />} />
      <Route path="/online-reservation" element={<OnlineReservation />} />
      <Route path="/department-recommendation" element={<DepartmentRecommendation />} />
      <Route path="/hospital-info" element={<HospitalInfo />} />
      <Route path="/medical-staff" element={<MedicalStaff />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ai-recommendation" element={<AIDepartmentRecommendation />} />

      {/* 관리자 */}
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/pending" element={<AdminPending />} />
      <Route path="/admin/approvals" element={<AdminApprovals />} />
      <Route path="/admin/reservations" element={<AdminReservations />} />         {/* ✅ 추가됨 */}
      <Route path="/admin/reservations/:reservationId" element={<ReservationPatientDetail />} />
      <Route path="/admin/clinic" element={<AdminRecordsEdit />} />                {/* ✅ 추가됨 */}

      {/* 선택: 404
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      */}
    </Routes>
  );
}
