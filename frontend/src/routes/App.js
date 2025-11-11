import React from "react";
import { Routes, Route } from "react-router-dom";

import Main from "../components/Main";
import MedicalRecord from "../pages/MedicalRecord";
import OnlineReservation from "../pages/OnlineReservation";
import DepartmentRecommendation from "../pages/DepartmentRecommendation";
import HospitalInfo from "../pages/HospitalInfo";
import Login from "../pages/Login";
import MedicalStaff from "../pages/MedicalStaff";
import Signup from "../pages/Signup";
import AIDepartmentRecommendation from "../pages/AIDepartmentRecommendation";

// 새로 추가
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminApprovals from "../pages/admin/AdminApprovals";
import AdminSettings from "../pages/admin/AdminSettings";
import {
  RequireAdminApproved,
  RequireSuperAdmin,
  RequireLogin,
} from "../components/guards";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Main />} />

      <Route path="/medical-record" element={<MedicalRecord />} />
      <Route path="/online-reservation" element={<OnlineReservation />} />
      <Route path="/department-recommendation" element={<DepartmentRecommendation />} />
      <Route path="/hospital-info" element={<HospitalInfo />} />
      <Route path="/medical-staff" element={<MedicalStaff />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ai-recommendation" element={<AIDepartmentRecommendation />} />

      {/* 관리자 (승인 완료 필요) */}
      <Route
        path="/admin"
        element={
          <RequireLogin>
            <RequireAdminApproved>
              <AdminDashboard />
            </RequireAdminApproved>
          </RequireLogin>
        }
      />

      {/* SUPER_ADMIN 전용 */}
      <Route
        path="/admin/approvals"
        element={
          <RequireLogin>
            <RequireSuperAdmin>
              <AdminApprovals />
            </RequireSuperAdmin>
          </RequireLogin>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireLogin>
            <RequireSuperAdmin>
              <AdminSettings />
            </RequireSuperAdmin>
          </RequireLogin>
        }
      />
    </Routes>
  );
}
