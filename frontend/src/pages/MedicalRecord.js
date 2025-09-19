import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MedicalRecord.css";

import hospinLogo from "../assets/hospin_logo.png"; // MedicalStaff와 동일한 로고

const MedicalRecord = () => {
  const navigate = useNavigate();

  // 초기 상태는 빈 배열 (백엔드 연동 시 데이터 채움)
  const [summaryData, setSummaryData] = useState([]);
  const [detailData, setDetailData] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(1);
  const [visitsOfYear, setVisitsOfYear] = useState(0);

  // 연도 선택 시 방문 수 초기화
  useEffect(() => {
    const yearData = summaryData.find(r => r.year.toString() === selectedYear);
    setVisitsOfYear(yearData ? yearData.visits : 0);
    setSelectedVisit(1);
  }, [selectedYear, summaryData]);

  // 선택된 연도와 방문 기준으로 진료 내용 필터링
  const filteredDetail = detailData
    .filter(d => new Date(d.date).getFullYear().toString() === selectedYear)
    .slice(selectedVisit - 1, selectedVisit);

  return (
    <div className="record-screen">
      {/* 상단 바 (MedicalStaff와 동일하게 통일) */}
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

      {/* 진료 이용 현황 */}
      <section className="record-summary">
        <h2>진료 이용 현황</h2>
        <table>
          <thead>
            <tr>
              <th>연도</th>
              <th>진료 횟수</th>
              <th>총 진료비</th>
              <th>최근 진료과</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.length === 0 ? (
              <tr>
                <td colSpan="4">데이터가 없습니다.</td>
              </tr>
            ) : (
              summaryData.map((rec, i) => (
                <tr key={i}>
                  <td>{rec.year}</td>
                  <td>{rec.visits}</td>
                  <td>{rec.totalCost.toLocaleString()}</td>
                  <td>{rec.lastDept}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* 진료 내용 */}
      <section className="record-detail">
        <h2>진료 내용</h2>
        <div className="filters">
          <label>
            연도:
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="">선택</option>
              {summaryData.map((r) => (
                <option key={r.year} value={r.year}>
                  {r.year}
                </option>
              ))}
            </select>
          </label>

          <label>
            방문:
            <select
              value={selectedVisit}
              onChange={(e) => setSelectedVisit(Number(e.target.value))}
            >
              {Array.from({ length: visitsOfYear }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>

        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>진료 내용</th>
              <th>진료 날짜</th>
              <th>의료진명</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetail.length === 0 ? (
              <tr>
                <td colSpan="4">데이터가 없습니다.</td>
              </tr>
            ) : (
              filteredDetail.map((rec) => (
                <tr key={rec.recordId}>
                  <td>{rec.recordId}</td>
                  <td>{rec.content}</td>
                  <td>{rec.date}</td>
                  <td>{rec.doctor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* 하단 바 */}
      <footer className="staff-footer">
        <img src={hospinLogo} alt="HOSPIN 로고" />
        <p>대표전화: 02-528-8258</p>
        <p>인스타그램</p>
      </footer>
    </div>
  );
};

export default MedicalRecord;
