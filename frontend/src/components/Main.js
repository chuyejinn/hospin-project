// src/components/Main.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Main.css";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import hospinLogo from "../assets/hospin_logo.png";

import {
  getAuth,
  isLoggedIn,
  isAdminApproved,
  isAdmin,
  clearAuth,
  migrateLegacyAuth,
} from "../utils/auth";

function roleFromAny(auth) {
  // 1) 최우선: auth.role
  let r =
    auth?.role ??
    // 2) 백엔드가 user 안에 넣어주는 경우
    auth?.user?.role ??
    // 3) Spring Security style: authorities: ['ROLE_ADMIN'] or [{authority:'ROLE_ADMIN'}]
    (Array.isArray(auth?.authorities) && auth.authorities.length
      ? typeof auth.authorities[0] === "string"
        ? auth.authorities[0]
        : auth.authorities[0]?.authority
      : null) ??
    // 4) 로컬스토리지에 별도 저장해둔 경우
    localStorage.getItem("role") ??
    // 5) 아무것도 없으면 빈 값
    "";

  r = String(r).toUpperCase().trim();
  if (r.startsWith("ROLE_")) r = r.slice(5); // ROLE_ADMIN -> ADMIN
  // 일부 백엔드에서 'SUPER' 같은 축약 사용
  if (r === "SUPER") r = "SUPER_ADMIN";
  return r; // "ADMIN" | "SUPER_ADMIN" | "PATIENT" | "" ...
}

const Main = () => {
  const navigate = useNavigate();
  const [auth, setAuthState] = useState(getAuth());
  const sync = () => setAuthState(getAuth());

  useEffect(() => {
    migrateLegacyAuth();
    sync();
    const onStorage = () => sync();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    clearAuth();
    sync();
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  // ✅ 역할 정규화 (여러 경로에서 안전하게 추출)
  const normRole = roleFromAny(auth);
  const isSuper = normRole === "SUPER_ADMIN";
  const isAdminLike = isSuper || normRole === "ADMIN" || isAdmin(); // utils 판단도 함께 인정

  const roleLabel = isSuper ? "슈퍼관리자" : isAdminLike ? "관리자" : "일반환자";

  const approvalLabel = isSuper
    ? "승인 완료 (자동)"
    : isAdminLike
    ? auth?.approved
      ? "승인 완료"
      : "승인 대기"
    : "";

  return (
    <div className="main-container">
      {/* ===== 사이드바 ===== */}
      <div className="sidebar">
        <div className="logo-text">HOSPIN</div>

        <nav className="menu">
          <button onClick={() => navigate("/medical-record")}>
            진료 기록 조회
          </button>
          <button onClick={() => navigate("/online-reservation")}>
            온라인 예약 및 확인
          </button>
          <button onClick={() => navigate("/department-recommendation")}>
            진료과 추천
          </button>
          <hr />
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>

          {/* 승인된 관리자 또는 슈퍼관리자만 */}
          {isAdminApproved() && (
            <button onClick={() => navigate("/admin")}>관리자 대시보드</button>
          )}

          {/* 관리자(미승인)만 */}
          {isAdminLike && !auth?.approved && (
            <button onClick={() => navigate("/admin/pending")}>
              관리자 승인 대기
            </button>
          )}
        </nav>

        {/* ===== 로그인/로그아웃 & 권한 표시 ===== */}
        <div className="login-section">
          {isLoggedIn() ? (
            <div className="auth-box">
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
              <div className="user-meta">
                <span className="user-pill">{roleLabel}</span>
                {auth?.email && (
                  <span className="user-email">({auth.email})</span>
                )}
                {approvalLabel && (
                  <span className="approval-pill">{approvalLabel}</span>
                )}
              </div>
            </div>
          ) : (
            <button className="logout-btn" onClick={() => navigate("/login")}>
              회원가입/로그인
            </button>
          )}
        </div>
      </div>

      {/* ===== 오른쪽 메인 콘텐츠 ===== */}
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
