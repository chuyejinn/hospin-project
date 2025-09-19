import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DepartmentRecommendation.css";

import hospinLogo from "../assets/hospin_logo.png";

/* ====================== 증상별 추천 매핑 ====================== */
const symptomToDept = {
  "이가 시림": "보존과",
  "충치": "보존과",
  "교정 관련": "교정과",
  "투명 교정": "교정과",
  "틀니 관련": "보철과",
  "임플란트 관련": "보철과",
  "잇몸질환": "치주과",
  "스케일링": "치주과",
  "사랑니 통증": "구강외과",
  "턱관절 통증": "구강외과",
};

const DepartmentRecommendation = () => {
  const navigate = useNavigate();
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [recommendedDept, setRecommendedDept] = useState(null);

  const analyzeSymptom = () => {
    if (!selectedSymptom) return;
    setRecommendedDept(symptomToDept[selectedSymptom]);
  };

  return (
    <div className="dept-wrap">
      {/* 상단 바 */}
      <header className="staff-header">
        <img
          src={hospinLogo}
          alt="HOSPIN 로고"
          className="staff-logo"
          onClick={() => navigate("/")}
        />
        <nav className="staff-menu">
          <button onClick={() => navigate("/medical-record")}>진료 기록 조회</button>
          <button onClick={() => navigate("/online-reservation")}>
            온라인 예약 및 확인
          </button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/department-recommendation")}>
            진료과 추천
          </button>
          
        </nav>
      </header>

      {/* 메인 */}
      <main className="dept-main">
        <h2 className="dept-title">증상 기반 진료과 추천</h2>
        <div className="dept-symptoms">
          {Object.keys(symptomToDept).map((sym) => (
            <label key={sym} className="dept-symptom-option">
              <input
                type="radio"
                name="symptom"
                checked={selectedSymptom === sym}
                onChange={() => setSelectedSymptom(sym)}
              />
              {sym}
            </label>
          ))}
        </div>
        <button
          className="dept-btn-primary"
          onClick={analyzeSymptom}
          disabled={!selectedSymptom}
        >
          분석하기
        </button>

        {recommendedDept && (
          <div className="dept-result-card">
            <h3>추천 결과</h3>
            <p>
              선택하신 증상은 <strong>{selectedSymptom}</strong> 입니다.
            </p>
            <p>
              이 경우 <strong className="dept-highlight">{recommendedDept}</strong> 진료과 방문을
              권장드립니다.
            </p>
            <button
              className="dept-btn-secondary"
              onClick={() => navigate("/online-reservation")}
            >
              👉 해당 진료과로 예약하러 가기
            </button>
          </div>
        )}
      </main>

      {/* 하단 바 */}
      <footer className="staff-footer">
        <div className="footer-left">
          <img src={hospinLogo} alt="HOSPIN 로고" />
        </div>
        <div className="footer-right">
          <p>대표전화: 02-528-8258</p>
          <p>인스타그램</p>
        </div>
      </footer>
    </div>
  );
};

export default DepartmentRecommendation;
