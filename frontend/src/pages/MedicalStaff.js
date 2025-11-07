import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MedicalStaff.css";

import staff1 from "../assets/staff1.png";
import staff2 from "../assets/staff2.png";
import staff3 from "../assets/staff3.png";
import staff4 from "../assets/staff4.png";

import hospinLogo from "../assets/hospin_logo.png";

const staffData = [
  {
    img: staff1,
    name: "구도원",
    dept: "보존과",
    schedule: "수, 금 - 월",
    specialty: ["충치 치료, 신경 치료", "레진", "크라운", "근관치료"]
  },
  {
    img: staff2,
    name: "서정민",
    dept: "교정과",
    schedule: "월 - 금, 토",
    specialty: ["치아 배열 및 위치 교정", "고정식 교정기", "투명 교정"]
  },
  {
    img: staff3,
    name: "조준모",
    dept: "보철과",
    schedule: "화 - 일",
    specialty: ["크라운, 브리지, 틀니, 임플란트", "기능", "외형 회복"]
  },
  {
    img: staff4,
    name: "박무강",
    dept: "치주과",
    schedule: "월 - 수, 금 - 토",
    specialty: ["잇몸 질환 치료", "스케일링", "치은염", "치주염"]
  }
];

const MedicalStaff = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null); // 찾은 의료진 객체
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    const found = staffData.find(
      (s) => s.name.toLowerCase() === q.toLowerCase()
    );
    if (found) {
      setSearchResult(found);
      setShowModal(true);
      setNotFound(false);
    } else {
      setSearchResult(null);
      setShowModal(false);
      setNotFound(true);
      // 알림 3초 후 자동 사라짐
      setTimeout(() => setNotFound(false), 3000);
    }
  };

  // 엔터키로 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 모달 열렸을 때 ESC로 닫기 및 스크롤 숨김 처리
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    if (showModal) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
    setSearchResult(null);
  };

  return (
    <div className="staff-screen">
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
          <button onClick={() => navigate("/online-reservation")}>온라인 예약 및 확인</button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/department-recommendation")}>진료과 추천</button>
        </nav>
      </header>

      {/* 검색 알림 (의료진 없음) */}
      {notFound && (
        <div className="search-notice">의료진 명이 존재하지 않습니다.</div>
      )}

      {/* 검색 바 */}
      <div className="staff-search">
        <input
          type="text"
          placeholder="의료진 명 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

       {/* 기본 의료진 카드 리스트 */}
      <div className="staff-cards">
        {staffData.map((staff, index) => (
          <div className="staff-card" key={index}>
            <img src={staff.img} alt={staff.name} className="staff-img" />
            <div className="staff-info">
              <h3>
                {staff.name} <span>_ {staff.dept}</span>
              </h3>
              <p>
                <strong>진료일:</strong> {staff.schedule}
              </p>
              <p>
                <strong>전문분야:</strong>
              </p>
              <ul>
                {staff.specialty.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 바 */}
      <footer className="staff-footer">
        <img src={hospinLogo} alt="HOSPIN 로고" />
        <p>대표전화: 02-528-8258</p>
        <p>인스타그램</p>
      </footer>

      {/* 모달: 검색된 의료진이 있을 때만 노출 */}
      {showModal && searchResult && (
        <div
          className="modal-overlay"
          onClick={closeModal} /* 바깥 클릭 닫기 */
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img className="modal-img" src={searchResult.img} alt={searchResult.name} />
            <div className="modal-name">{searchResult.name}</div>
            <div className="modal-dept">_ {searchResult.dept}</div>
            <div className="modal-schedule"><strong>진료일:</strong> {searchResult.schedule}</div>
            <div className="modal-specialty"><strong>전문분야:</strong>
              <ul>
                {searchResult.specialty.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <button className="modal-close-button" onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalStaff;
