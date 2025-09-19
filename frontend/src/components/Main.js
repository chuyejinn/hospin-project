import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import hospinLogo from "../assets/hospin_logo.png";

const Main = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="sidebar">
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
          {isLoggedIn ? (
            <button onClick={handleLogout}>로그아웃</button>
          ) : (
            <button onClick={() => navigate("/login")}>회원가입/로그인</button>
          )}
        </div>
      </div>

      <div className="content">
        <img src={hospinLogo} alt="HOSPIN 로고" className="hospin-logo" />
        <div className="image-tetris">
          <img src={img1} alt="의료진1" className="img1" />
          <img src={img2} alt="내부시설1" className="img2" />
          <img src={img3} alt="내부시설2" className="img3" />
          <img src={img4} alt="병원외관" className="img4" />
        </div>
      </div>
    </div>
  );
};

export default Main;
