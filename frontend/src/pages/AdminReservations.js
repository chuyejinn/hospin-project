// src/pages/AdminReservations.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OnlineReservation.css";

function normalizeOne(r) {
  // 1) date 문자열이 있으면 최우선으로 파싱
  if (typeof r?.date === "string") {
    try {
      const [ymd] = r.date.split(" ");
      const [yy, mm, dd] = ymd.split(".").map(Number);
      if (yy && mm && dd) {
        return {
          ...r,
          year: yy,
          month: mm,           // 1~12
          day: dd,
        };
      }
    } catch {}
  }
  // 2) 숫자화 + 월 0~11 이면 +1 보정
  const y = Number(r?.year);
  let m = Number(r?.month);
  const d = Number(r?.day);
  if (!Number.isNaN(m) && m >= 0 && m <= 11) m = m + 1;
  return { ...r, year: y, month: m, day: d };
}

export default function AdminReservations() {
  const navigate = useNavigate();

  // 달력(좌측): month는 0~11로 보유
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth0, setViewMonth0] = useState(today.getMonth()); // 0~11
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // 데이터 & 필터
  const [all, setAll] = useState([]);
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [q, setQ] = useState("");

  // 로컬 스토리지에서 읽고 정규화
  useEffect(() => {
    const raw = localStorage.getItem("reservations");
    const list = raw ? JSON.parse(raw) : [];
    const normalized = list.map(normalizeOne);
    setAll(normalized);
  }, []);

  // 캘린더 유틸
  const daysInMonth = (y, m0) => new Date(y, m0 + 1, 0).getDate();
  const firstDayOfMonthWeekIndex = (y, m0) => new Date(y, m0, 1).getDay();

  const calendarCells = useMemo(() => {
    const first = firstDayOfMonthWeekIndex(viewYear, viewMonth0);
    const total = daysInMonth(viewYear, viewMonth0);
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth0]);

  const selectedY = viewYear;
  const selectedM1 = viewMonth0 + 1; // 1~12
  const selectedD = selectedDay;

  // 우측 리스트 필터 (숫자 강제 + 월 1기준)
  const filtered = useMemo(() => {
    const s = (q || "").trim().toLowerCase();
    return all
      .filter(r => Number(r.year) === selectedY &&
                   Number(r.month) === selectedM1 &&
                   Number(r.day) === selectedD)
      .filter(r => (deptFilter === "ALL" ? true : r.dept === deptFilter))
      .filter(r => {
        if (!s) return true;
        const hay = `${r.name} ${r.phone} ${r.doctor} ${r.dept} ${r.ownerId}`.toLowerCase();
        return hay.includes(s);
      })
      .sort((a,b) => (a.time || "").localeCompare(b.time || ""));
  }, [all, selectedY, selectedM1, selectedD, deptFilter, q]);

  const goPrevMonth = () => {
    if (viewMonth0 === 0) { setViewYear(viewYear - 1); setViewMonth0(11); }
    else setViewMonth0(viewMonth0 - 1);
    setSelectedDay(1);
  };
  const goNextMonth = () => {
    if (viewMonth0 === 11) { setViewYear(viewYear + 1); setViewMonth0(0); }
    else setViewMonth0(viewMonth0 + 1);
    setSelectedDay(1);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800 }}>＋ 예약 관리 시스템</h2>

      <div style={{ display: "grid", gridTemplateColumns: "520px 1fr", gap: 24, marginTop: 12 }}>
        {/* 캘린더 */}
        <div className="or-calendar-wrap" style={{ background: "rgba(200,220,255,0.3)", borderRadius: 16, padding: 12 }}>
          <div className="or-cal-top" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="or-cal-nav" onClick={goPrevMonth}>◀</button>
            <div className="or-cal-ym" style={{ fontWeight: 700 }}>
              {viewYear}.{String(selectedM1).padStart(2,"0")}
            </div>
            <button className="or-cal-nav" onClick={goNextMonth}>▶</button>
          </div>

          <div className="or-cal-grid or-cal-week" style={{ marginTop: 8 }}>
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map(w => (
              <div key={w} className="or-cal-weekcell">{w}</div>
            ))}
          </div>

          <div className="or-cal-grid">
            {calendarCells.map((d, idx) => {
              if (!d) return <div key={idx} className="or-cal-cell empty" />;
              const isSelected = d === selectedDay;
              return (
                <div
                  key={idx}
                  className={`or-cal-cell ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedDay(d)}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 패널 */}
        <div style={{ background: "rgba(210,220,230,0.25)", borderRadius: 16, padding: 16, minHeight: 420 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>
              {selectedY}-{String(selectedM1).padStart(2,"0")}-{String(selectedD).padStart(2,"0")}
            </div>
            <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
              <option value="ALL">ALL</option>
              <option value="보존과">보존과</option>
              <option value="교정과">교정과</option>
              <option value="보철과">보철과</option>
              <option value="치주과">치주과</option>
            </select>
            <input
              placeholder="이름/전화/의료진/과/ownerId"
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="or-btn-ghost"
              onClick={() => { setQ(""); setDeptFilter("ALL"); }}
              title="필터 초기화"
            >
              초기화
            </button>
            <button className="or-btn-primary" onClick={() => navigate("/admin/clinic")}>
              예약 환자 정보 보기
            </button>
          </div>

          {filtered.length === 0 ? (
            <p style={{ opacity: 0.7, padding: "24px 8px" }}>해당 조건의 예약이 없습니다.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {filtered.map(r => (
                <div key={r.id} className="or-complete-box" style={{ margin: 0 }}>
                  <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p><strong>시간 :</strong> {r.time}</p>
                      <p><strong>환자 :</strong> {r.name} · {r.phone}</p>
                      <p><strong>의료진 :</strong> {r.doctor} · {r.dept}</p>
                      <p style={{ opacity: 0.7 }}><strong>ownerId :</strong> {r.ownerId}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="or-btn-primary" onClick={() => navigate(`/admin/reservations/${r.id}`)}>상세</button>
                      <button
                        className="or-btn-ghost"
                        onClick={() => {
                          if (!confirm("이 예약을 삭제할까요?")) return;
                          const next = all.filter(x => x.id !== r.id);
                          localStorage.setItem("reservations", JSON.stringify(next));
                          setAll(next.map(normalizeOne));
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
