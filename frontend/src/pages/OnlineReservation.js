// src/pages/OnlineReservation.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OnlineReservation.css";

import calendarIcon from "../assets/calendar_icon.png";
import aiIcon from "../assets/ai_icon.png";
import staff1 from "../assets/staff1.png";
import staff2 from "../assets/staff2.png";
import staff3 from "../assets/staff3.png";
import staff4 from "../assets/staff4.png";
import hospinLogo from "../assets/hospin_logo.png";

// ✅ 로그인 정보
import { getCurrentUser, getUserId, isLoggedIn } from "../auth/session";

/* ====================== 의료진 데이터 ====================== */
const staffData = [
  { img: staff1, name: "구도원", dept: "보존과", schedule: "수, 금 - 월", specialty: ["충치 치료, 신경 치료", "레진", "크라운", "근관치료"], scheduleDays: [1, 3, 5] },
  { img: staff2, name: "서정민", dept: "교정과", schedule: "월 - 금, 토", specialty: ["치아 배열 및 위치 교정", "고정식 교정기", "투명 교정"], scheduleDays: [1, 2, 3, 4, 5, 6] },
  { img: staff3, name: "조준모", dept: "보철과", schedule: "화 - 일", specialty: ["크라운, 브리지, 틀니, 임플란트", "기능", "외형 회복"], scheduleDays: [2, 3, 4, 5, 6, 0] },
  { img: staff4, name: "박무강", dept: "치주과", schedule: "월 - 수, 금 - 토", specialty: ["잇몸 질환 치료", "스케일링", "치은염", "치주염"], scheduleDays: [1, 2, 3, 5, 6] },
];

/* ====================== 시간 슬롯 ====================== */
const timeSlots = ["10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30"];
const WEEKDAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonthWeekIndex = (year, month) => new Date(year, month, 1).getDay();

const OnlineReservation = () => {
  const navigate = useNavigate();
  const me = getCurrentUser();

  // me.id 없을 때도 localStorage.userId 사용
  const userId = useMemo(() => {
    const id = getUserId();
    return id ? String(id) : null;
  }, [me?.id]);

  const [currentStep, setCurrentStep] = useState("home");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [reservation, setReservation] = useState(null);
  const [allReservations, setAllReservations] = useState([]);
  const [myReservations, setMyReservations] = useState([]);

  // ✅ 예약 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem("reservations");
    const parsed = saved ? JSON.parse(saved) : [];
    setAllReservations(parsed);

    if (userId) {
      setMyReservations(parsed.filter(r => String(r.ownerId) === String(userId)));
    } else {
      setMyReservations([]);
    }
  }, [userId]);

  /* ---------------- 달력 ---------------- */
  const calendarCells = useMemo(() => {
    const firstWeekIdx = firstDayOfMonthWeekIndex(viewYear, viewMonth);
    const totalDays = daysInMonth(viewYear, viewMonth);
    const cells = [];
    for (let i = 0; i < firstWeekIdx; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    return cells;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
    setSelectedDate(null); setSelectedTime(null);
  };
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
    setSelectedDate(null); setSelectedTime(null);
  };

  /* ---------------- 핸들러 ---------------- */
  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate({ year: viewYear, month: viewMonth, day });
    setSelectedTime(null);
  };
  const handleTimeClick = (t) => setSelectedTime(t);
  const phoneValid = /^010-\d{4}-\d{4}$/.test(phone);

  // ✅ 추가: 바로 예약하기/좌측 진행 버튼 공통 가드
  const startReservationFlow = () => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    setCurrentStep("info");
  };

  /* ---------------- 예약 완료 ---------------- */
  const handleComplete = () => {
    if (!patientName || !phoneValid || selectedDoctor === null || !selectedDate || !selectedTime) return;

    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const doctor = staffData[selectedDoctor];
    const formattedDate =
      `${selectedDate.year}.${String(selectedDate.month+1).padStart(2,"0")}.${String(selectedDate.day).padStart(2,"0")} ${selectedTime}`;

    const newReservation = {
      id: Date.now(),
      ownerId: userId,      // 통일
      name: patientName,
      phone,
      doctor: doctor.name,
      dept: doctor.dept,
      date: formattedDate,
      year: selectedDate.year,
      month: selectedDate.month + 1, // 1부터 저장
      day: selectedDate.day,
      time: selectedTime,
    };

    setReservation(newReservation);
    const updatedAll = [...allReservations, newReservation];
    setAllReservations(updatedAll);
    setMyReservations(prev => [...prev, newReservation]);

    localStorage.setItem("reservations", JSON.stringify(updatedAll));
    setCurrentStep("complete");
  };

  /* ---------------- 단계 인디케이터 ---------------- */
  const renderStepIndicator = () => {
    const steps = ["개인정보","진료과-의료진","진료일시"];
    const statusOfIndex = (idx) => {
      const currentIndex = currentStep==="info"?0:currentStep==="doctor"?1:currentStep==="date"?2:currentStep==="complete"?3:-1;
      if (idx === currentIndex) return "current";
      if (currentIndex > idx) return "done";
      return "pending";
    };
    return (
      <aside className="or-step-rail">
        <div className="or-step-oval">
          {steps.map((label,i)=>
            <div key={label} className={`or-step-circle ${statusOfIndex(i)}`}><span>{label}</span></div>
          )}
        </div>
      </aside>
    );
  };

  /* ---------------- UI 렌더 ---------------- */
  return (
    <div className="or-wrap">
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
          <button
            onClick={() => {
              setCurrentStep("home");
              navigate("/online-reservation");
            }}
          >
            온라인 예약 및 확인
          </button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/department-recommendation")}>진료과 추천</button>
        </nav>
      </header>

      <header className="or-header">
        <h1>온라인 예약</h1>
      </header>

      <div className="or-body">
        {["home","progress","check"].includes(currentStep) && (
          <nav className="or-left-menu">
            {/* ✅ 진행 버튼도 동일하게 로그인 가드 */}
            <button onClick={() => setCurrentStep("progress")}>온라인 예약 진행</button>
            <button onClick={() => setCurrentStep("check")}>온라인 예약 확인</button>
          </nav>
        )}

        <div className="or-content-row">
          <main className="or-main">
            {currentStep==="home" && <p>좌측 메뉴에서 원하는 기능을 선택하세요.</p>}

            {/* 예약 방법 선택 */}
            {currentStep==="progress" && (
              <section className="or-method">
                <h2 className="or-title">진료 예약 방법 선택</h2>
                <div className="or-card-list">
                  {/* ✅ 바로 예약하기도 로그인 가드 */}
                  <div className="or-card" onClick={startReservationFlow}>
                    <img src={calendarIcon} alt="바로 예약하기"/>
                    <p>바로 예약하기</p>
                  </div>
                  <div className="or-card" onClick={() => navigate("/ai-recommendation")}>
                    <img src={aiIcon} alt="AI 추천"/>
                    <p>AI 기반 추천받기</p>
                  </div>
                </div>
              </section>
            )}

            {/* 개인정보 입력 */}
            {currentStep==="info" && (
              <section className="or-section">
                <h2 className="or-title">개인정보 입력</h2>
                <div className="or-form">
                  <div className="or-form-row">
                    <label className="or-form-label">환자이름 :</label>
                    <input className="or-form-input or-input-large" type="text" value={patientName} onChange={(e)=>setPatientName(e.target.value)} placeholder="이름"/>
                  </div>
                  <div className="or-hr"/>
                  <div className="or-form-row">
                    <label className="or-form-label">본인 휴대전화 :</label>
                    <input className="or-form-input or-input-large" type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="010-0000-0000"/>
                  </div>
                  {!phoneValid && phone.length>0 && <p className="or-error">전화번호는 010-0000-0000 형식으로 입력해주세요.</p>}
                  <div className="or-hr"/>
                  <div className="or-actions">
                    <button className="or-btn-primary" onClick={()=>setCurrentStep("doctor")} disabled={!patientName||!phoneValid}>다음</button>
                  </div>
                </div>
              </section>
            )}

            {/* 의료진 선택 */}
            {currentStep==="doctor" && (
              <section className="or-section">
                <h2 className="or-title">진료과 · 의료진 선택</h2>
                <div className="or-doc-grid">
                  {staffData.map((s,i)=>{
                    const checked = selectedDoctor===i;
                    return (
                      <div key={s.name} className={`or-doc-card ${checked?"selected":""}`} onClick={()=>setSelectedDoctor(i)}>
                        <div className="or-doc-left"><img className="or-doc-img" src={s.img} alt={s.name}/></div>
                        <div className="or-doc-right">
                          <div className="or-doc-name">{s.name}<span className="or-doc-dept"> · {s.dept}</span></div>
                          <div className="or-doc-line">진료일 | {s.schedule}</div>
                          <div className="or-doc-line">전문분야 | {s.specialty.map((sp,idx)=><span key={idx} className="or-chip">{sp}</span>)}</div>
                        </div>
                        <div className="or-check-wrap" onClick={(e)=>e.stopPropagation()}>
                          <input type="checkbox" className="or-check" checked={checked} onChange={()=>setSelectedDoctor(i)}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="or-actions two">
                  <button className="or-btn-ghost" onClick={()=>setCurrentStep("info")}>이전</button>
                  <button className="or-btn-primary" onClick={()=>setCurrentStep("date")} disabled={selectedDoctor===null}>다음</button>
                </div>
              </section>
            )}

            {/* 진료일시 선택 */}
            {currentStep==="date" && (
              <section className="or-section">
                <h2 className="or-title">진료일시 선택</h2>
                <div className="or-calendar-wrap">
                  <div className="or-cal-top">
                    <button className="or-cal-nav" onClick={goPrevMonth}>◀</button>
                    <div className="or-cal-ym">{viewYear}.{String(viewMonth+1).padStart(2,"0")}</div>
                    <button className="or-cal-nav" onClick={goNextMonth}>▶</button>
                  </div>
                  <div className="or-cal-grid or-cal-week">{WEEKDAYS.map((wd)=><div key={wd} className="or-cal-weekcell">{wd}</div>)}</div>
                  <div className="or-cal-grid">
                    {calendarCells.map((d,idx)=>{
                      if(!d) return <div key={idx} className="or-cal-cell empty"></div>;
                      const dateObj=new Date(viewYear,viewMonth,d);
                      const dayOfWeek=dateObj.getDay();
                      const doctor=selectedDoctor!==null?staffData[selectedDoctor]:null;
                      const isAvailable=doctor&&doctor.scheduleDays.includes(dayOfWeek);
                      const isSelected=selectedDate&&selectedDate.year===viewYear&&selectedDate.month===viewMonth&&selectedDate.day===d;
                      return (
                        <div key={idx} className={`or-cal-cell ${!isAvailable?"disabled":""} ${isSelected?"selected":""}`} onClick={()=>isAvailable&&handleDateClick(d)}>{d}</div>
                      );
                    })}
                  </div>
                </div>
                {selectedDate && (
                  <div className="or-times">
                    {timeSlots.map((t)=>{
                      const reserved=allReservations.some(r=>
                        r.year===selectedDate.year &&
                        r.month===(selectedDate.month + 1) &&
                        r.day===selectedDate.day &&
                        r.time===t &&
                        r.doctor===staffData[selectedDoctor].name
                      );
                      return (
                        <button key={t} className={`or-time ${selectedTime===t?"on":""}`} onClick={()=>!reserved&&handleTimeClick(t)} disabled={reserved}>
                          {reserved?"예약됨":t}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="or-actions two">
                  <button className="or-btn-ghost" onClick={()=>setCurrentStep("doctor")}>이전</button>
                  <button className="or-btn-primary" onClick={handleComplete} disabled={!selectedDate||!selectedTime}>예약 완료</button>
                </div>
              </section>
            )}

            {/* 예약 완료 */}
            {currentStep==="complete" && reservation && (
              <section className="or-complete">
                <div className="or-complete-box">
                  <h2>진료 예약 완료</h2>
                  <hr/>
                  <p><strong>이름 :</strong> {reservation.name}</p>
                  <p><strong>의료진 · 진료과 :</strong> {reservation.doctor} - {reservation.dept}</p>
                  <p><strong>예약 날짜 :</strong> {reservation.date}</p>
                </div>
              </section>
            )}

            {/* 예약 확인 */}
            {currentStep==="check" && (
              <section className="or-section">
                <h2 className="or-title">예약 확인</h2>
                {myReservations.length>0 ? myReservations.map((r)=>(
                  <div key={r.id} className="or-complete-box" style={{marginBottom:"20px"}}>
                    <p><strong>이름 :</strong> {r.name}</p>
                    <p><strong>의료진 · 진료과 :</strong> {r.doctor} - {r.dept}</p>
                    <p><strong>예약 날짜 :</strong> {r.date}</p>
                  </div>
                )):<p>예약 내역이 없습니다.</p>}
              </section>
            )}
          </main>
          {renderStepIndicator()}
        </div>
      </div>
    </div>
  );
};

export default OnlineReservation;
