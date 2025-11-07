import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HospitalInfo.css";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import hospinLogo from "../assets/hospin_logo.png";

const HospitalInfo = () => {
  const navigate = useNavigate();

  // 로그인 상태/표시용(메인과 동일 동작)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleText, setRoleText] = useState("");
  const [emailText, setEmailText] = useState("");

  const syncFromStorage = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");       // ADMIN / PATIENT
    const email = localStorage.getItem("userEmail") || "";
    setIsLoggedIn(!!token);
    setRoleText(role === "ADMIN" ? "관리자" : role ? "일반 환자" : "");
    setEmailText(email);
  };

  useEffect(() => {
    syncFromStorage();
    const onStorage = () => syncFromStorage();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    syncFromStorage();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <div className="main-container">
      {/* 왼쪽 사이드바 */}
      <aside className="sidebar">
        <div className="logo-text">HOSPIN</div>

        <nav className="menu">
          <button onClick={() => navigate("/medical-record")}>진료 기록 조회</button>
          <button onClick={() => navigate("/online-reservation")}>온라인 예약 및 확인</button>
          <button onClick={() => navigate("/department-recommendation")}>진료과 추천</button>
          <hr />
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>
        </nav>

        <div className="login-section">
          {!isLoggedIn ? (
            <button className="logout-btn" onClick={() => navigate("/login")}>
              회원가입/로그인
            </button>
          ) : (
            <div className="auth-box">
              <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
              <div className="user-meta">
                {roleText && <span className="user-pill">{roleText}</span>}
                {emailText && <span className="user-email">({emailText})</span>}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 오른쪽 컨텐츠 영역 */}
      <section className="hospital-info-content">
        <img src={hospinLogo} alt="HOSPIN 로고" className="hospin-logo" />

        {/* 흐릿한 배경 사진 타일 */}
        <div className="image-tetris dimmed" aria-hidden>
          <img src={img1} alt="" className="img1" />
          <img src={img2} alt="" className="img2" />
          <img src={img3} alt="" className="img3" />
          <img src={img4} alt="" className="img4" />
        </div>

        {/* 소개 오버레이 카드 */}
        <div className="hospital-info-overlay">
          <h1>미소를 지키는 전문가들,</h1>
          <h1 className="highlight">HOSPIN 치과 병원은 당신의 건강한 미소를 약속합니다.</h1>
          <hr />
          <p>
            HOSPIN 치과 병원은 환자 중심의 진료 철학을 바탕으로, 편안하고 신뢰할 수 있는 의료 환경을 제공합니다.
            최신 의료 장비와 첨단 기술을 바탕으로, 환자 한 분 한 분의 건강한 미소를 지키기 위해 노력하고 있습니다.
          </p>
          <p>
            일반 치과 진료는 물론, 교정, 임플란트, 치주 치료 등 다양한 전문 과목을 갖추고 있으며,
            각 분야의 숙련된 전문의들이 유기적으로 협력하여 환자에게 가장 적합한 맞춤형 치료 계획을 제안합니다.
          </p>
          <p>
            저희의 목표는 단순한 치아 치료를 넘어, 환자의 전반적인 구강 건강과 삶의 질을 향상시키는 데 있습니다.
            HOSPIN 치과는 치료의 전 과정에서 환자와의 소통을 중시하며, 따뜻하고 세심한 진료를 통해
            신뢰와 안정을 드리는 병원이 되고자 합니다.
          </p>
          <p>
            여러분의 건강한 내일을 위한 든든한 파트너, <br />HOSPIN 치과 병원입니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HospitalInfo;
