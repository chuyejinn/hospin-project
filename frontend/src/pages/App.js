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
import AIDepartmentRecommendation from "./AIDepartmentRecommendation"; // ✅ AI 추천 컴포넌트 추가

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/home" element={<Main />} /> {/* /home 경로도 메인 */}
      <Route path="/medical-record" element={<MedicalRecord />} />
      <Route path="/online-reservation" element={<OnlineReservation />} />
      <Route path="/department-recommendation" element={<DepartmentRecommendation />} />
      <Route path="/hospital-info" element={<HospitalInfo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/medical-staff" element={<MedicalStaff />} />
      <Route path="/signup" element={<Signup />} /> 
      
      {/* ✅ AI 기반 추천 페이지 라우트 추가 */}
      <Route path="/ai-recommendation" element={<AIDepartmentRecommendation />} />

    </Routes>
  );
};

export default App;
