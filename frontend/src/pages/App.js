import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "../components/Main";
import MedicalRecord from "./MedicalRecord";
import OnlineReservation from "./OnlineReservation";
import DepartmentRecommendation from "./DepartmentRecommendation";
import HospitalInfo from "./HospitalInfo";
import Login from "./Login";
import MedicalStaff from "./MedicalStaff";
import Signup from "./Signup";
import AIDepartmentRecommendation from "./AIDepartmentRecommendation";

import AdminHome from "./AdminHome";         // ✅ 추가
import AdminPending from "./AdminPending";   // ✅ 추가
import AdminRoute from "../routes/AdminRoute"; // ✅ 추가

// 개발 중 시뮬레이터 (운영 전 삭제!)
import DebugAuthPanel from "./DebugAuthPanel"; // ✅ 추가

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Main />} />
      <Route path="/medical-record" element={<MedicalRecord />} />
      <Route path="/online-reservation" element={<OnlineReservation />} />
      <Route path="/department-recommendation" element={<DepartmentRecommendation />} />
      <Route path="/hospital-info" element={<HospitalInfo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/medical-staff" element={<MedicalStaff />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ai-recommendation" element={<AIDepartmentRecommendation />} />

      {/* ✅ 관리자 보호 라우트: 승인 되었을 때만 /admin 접근 가능 */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        }
      />

      {/* ✅ 관리자 승인 대기 페이지(ADMIN이면 접근 가능) */}
      <Route path="/admin-pending" element={<AdminPending />} />

      {/* ✅ 개발용 시뮬레이터 (운영 전 삭제) */}
      <Route path="/debug-auth" element={<DebugAuthPanel />} />
    </Routes>
  );
};

export default App;
