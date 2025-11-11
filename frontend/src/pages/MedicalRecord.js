// src/pages/MedicalRecord.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MedicalRecord.css";
import hospinLogo from "../assets/hospin_logo.png";

import { fetchMedicalRecords } from "../api/medicalRecords";
import { getCurrentUser } from "../auth/session";

const MedicalRecord = () => {
  const navigate = useNavigate();

  const [summaryData, setSummaryData] = useState([]);
  const [detailData, setDetailData] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVisit, setSelectedVisit] = useState("ALL"); // ★ 기본: 전체 보기
  const [visitsOfYear, setVisitsOfYear] = useState(0);

  // 로그인 사용자 ID (없으면 로컬 저장소, 최후엔 1)
  const me = getCurrentUser();
  const userId = me?.id || localStorage.getItem("userId") || "1";

  // 공통: 문자열 날짜 → Date
  const toDate = (d) => {
    if (!d) return null;
    const s = String(d).includes("T") ? String(d).slice(0, 10) : String(d);
    // 허용 포맷: 2025-11-08 / 2025.11.08 / 2025/11/08
    const norm = s.replaceAll(".", "-").replaceAll("/", "-");
    const dt = new Date(norm);
    return isNaN(dt.getTime()) ? null : dt;
  };

  // ✅ 백엔드에서 진료기록 불러오기
  useEffect(() => {
    (async () => {
      try {
        const raw = await fetchMedicalRecords(userId);

        // 응답 키 이름이 달라도 안전하게 정규화
        const normalized = (raw || []).map((r, idx) => {
          const dateStr = r.visitDate ?? r.date ?? "";
          const dt = toDate(dateStr);

          const recordId = r.recordId ?? r.id ?? idx + 1;
          const doctor =
            r.doctorName ?? r.doctor ?? r.medicalStaff ?? r.physician ?? "";
          const department =
            r.departmentName ?? r.department ?? r.dept ?? r.clinic ?? "";
          const content = r.content ?? r.diagnosis ?? r.memo ?? "";
          const cost = Number(r.cost ?? r.totalFee ?? 0);

          return {
            recordId,
            content,
            date: dt ? dt.toISOString().slice(0, 10) : "", // yyyy-MM-dd
            doctor,
            department,
            cost,
          };
        });

        // 최신 날짜 우선 정렬
        normalized.sort((a, b) => (toDate(b.date) - toDate(a.date)));
        setDetailData(normalized);

        // 연도별 요약 계산
        const byYear = new Map();
        for (const rec of normalized) {
          const y = toDate(rec.date)?.getFullYear();
          if (!y) continue;
          if (!byYear.has(y)) byYear.set(y, { year: y, visits: 0, totalCost: 0, lastDept: "" });
          const yobj = byYear.get(y);
          yobj.visits += 1;
          yobj.totalCost += rec.cost || 0;
          // 최신 정렬이므로 아직 lastDept 비어있으면 첫 항목이 최신
          if (!yobj.lastDept) yobj.lastDept = rec.department || "";
        }
        const summary = Array.from(byYear.values()).sort((a, b) => b.year - a.year);
        setSummaryData(summary);

        // 기본 선택: 가장 최신 연도 + "전체"
        if (summary.length) {
          setSelectedYear(String(summary[0].year));
          setSelectedVisit("ALL");
        } else {
          setSelectedYear("");
          setSelectedVisit("ALL");
        }
      } catch (e) {
        console.error(e);
        setSummaryData([]);
        setDetailData([]);
        setSelectedVisit("ALL");
      }
    })();
  }, [userId]);

  // 선택된 연도의 리스트
  const yearList = useMemo(() => {
    if (!selectedYear) return [];
    return detailData.filter(
      (d) => String(toDate(d.date)?.getFullYear()) === String(selectedYear)
    );
  }, [detailData, selectedYear]);

  // 방문 번호(해당 연도 내 1..N) 부여
  const withVisitNo = useMemo(() => {
    // 최신 날짜 우선 정렬되어 있으니 1 = 최신 방문
    return yearList.map((r, i) => ({ ...r, visitNo: i + 1 }));
  }, [yearList]);

  // 연도 변경 시 방문 수 갱신 + 선택 초기화
  useEffect(() => {
    setVisitsOfYear(withVisitNo.length);
    // 기본 전체 보기
    setSelectedVisit("ALL");
  }, [withVisitNo.length, selectedYear]);

  // 화면에 보여줄 목록
  const visible = useMemo(() => {
    if (selectedVisit === "ALL") return withVisitNo;
    const n = Number(selectedVisit);
    return withVisitNo.filter((r) => r.visitNo === n);
  }, [withVisitNo, selectedVisit]);

  // 총 진료비(상단 카드용) – 선택 연도 기준
  const totalCostOfYear = useMemo(
    () => yearList.reduce((sum, r) => sum + (r.cost || 0), 0),
    [yearList]
  );

  return (
    <div className="record-screen">
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

      {/* 요약 */}
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
              summaryData.map((rec) => (
                <tr key={rec.year}>
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

      {/* 상세 */}
      <section className="record-detail">
        <h2>진료 내용</h2>
        <div className="filters">
          <label>
            연도:&nbsp;
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">선택</option>
              {summaryData.map((r) => (
                <option key={r.year} value={r.year}>
                  {r.year}
                </option>
              ))}
            </select>
          </label>
          <label>
            방문:&nbsp;
            <select
              value={selectedVisit}
              onChange={(e) => setSelectedVisit(e.target.value)}
            >
              {/* ★ "전체" 옵션 + 1..N 자동 생성 */}
              <option value="ALL">전체</option>
              {Array.from({ length: visitsOfYear }, (_, i) => String(i + 1)).map(
                (num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                )
              )}
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
            {visible.length === 0 ? (
              <tr>
                <td colSpan="4">데이터가 없습니다.</td>
              </tr>
            ) : (
              visible.map((rec) => (
                <tr key={`${rec.recordId}-${rec.visitNo}`}>
                  {/* 구분은 해당 연도 내 방문순번을 보여주는 것이 직관적 */}
                  <td>{rec.visitNo}</td>
                  <td>{rec.content}</td>
                  <td>{rec.date}</td>
                  <td>{rec.doctor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* 하단 */}
      <footer className="staff-footer">
        <img src={hospinLogo} alt="HOSPIN 로고" />
        <p>대표전화: 02-528-8258</p>
        <p>인스타그램</p>
      </footer>
    </div>
  );
};

export default MedicalRecord;
