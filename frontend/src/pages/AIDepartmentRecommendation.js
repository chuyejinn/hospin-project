import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* 바로예약과 동일한 레이아웃/버튼/달력/스텝바 스타일 사용 */
import "../styles/OnlineReservation.css";
/* AI 전용(증상칩, 결과카드 등) 보강 스타일 */
import "../styles/AIDepartmentRecommendation.css";

import staff1 from "../assets/staff1.png";
import staff2 from "../assets/staff2.png";
import staff3 from "../assets/staff3.png";
import staff4 from "../assets/staff4.png";
import hospinLogo from "../assets/hospin_logo.png";

/* ====================== 의료진 데이터 ====================== */
const staffData = [
  { img: staff1, name: "구도원", dept: "보존과", schedule: "수, 금 - 월", scheduleDays: [1, 3, 5] },
  { img: staff2, name: "서정민", dept: "교정과", schedule: "월 - 금, 토", scheduleDays: [1, 2, 3, 4, 5, 6] },
  { img: staff3, name: "조준모", dept: "보철과", schedule: "화 - 일", scheduleDays: [2, 3, 4, 5, 6, 0] },
  { img: staff4, name: "박무강", dept: "치주과", schedule: "월 - 수, 금 - 토", scheduleDays: [1, 2, 3, 5, 6] },
];

/* ====================== 증상 ↔ 진료과 매핑 ====================== */
const symptomToDept = {
  "이가 시림": "보존과",
  "충치 의심": "보존과",
  "치아 깨짐/금": "보존과",
  "교정 상담": "교정과",
  "치아 배열 불균형": "교정과",
  "투명 교정 희망": "교정과",
  "틀니 상담": "보철과",
  "임플란트 상담": "보철과",
  "보철물 문제": "보철과",
  "잇몸 질환 의심": "치주과",
  "스케일링": "치주과",
  "잇몸 출혈/붓기": "치주과",
};

/* ====================== 달력/시간 유틸 ====================== */
const timeSlots = ["10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30"];
const WEEKDAYS  = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonthWeekIndex = (y, m) => new Date(y, m, 1).getDay();

const AIDepartmentRecommendation = () => {
  const navigate = useNavigate();

  /* 4단계: info → symptom → doctor → date → complete */
  const [currentStep, setCurrentStep] = useState("info");

  /* 개인정보 */
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const phoneValid = /^010-\d{4}-\d{4}$/.test(phone);

  /* 증상/추천과 */
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [recommendedDept, setRecommendedDept] = useState(null);

  /* 의료진/달력/시간 */
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  /* 완료/중복방지 */
  const [reservation, setReservation] = useState(null);
  const [allReservations, setAllReservations] = useState([]);

  /* 예약 내역 불러오기(바로예약 화면과 키 공유: "reservations") */
  useEffect(() => {
    const saved = localStorage.getItem("reservations");
    if (saved) setAllReservations(JSON.parse(saved));
  }, []);

  /* 증상 분석 */
  const analyze = () => {
    if (!selectedSymptom) return;
    const dept = symptomToDept[selectedSymptom];
    setRecommendedDept(dept);
  };

  /* 추천과가 1명의 의료진만 반환하면, 진입 시 자동선택(체크 해제도 가능) */
  useEffect(() => {
    if (currentStep !== "doctor" || !recommendedDept) return;
    const filtered = staffData.filter((s) => s.dept === recommendedDept);
    if (filtered.length === 1) {
      const idx = staffData.indexOf(filtered[0]);
      setSelectedDoctor(idx);
    }
  }, [currentStep, recommendedDept]);

  /* 달력 생성 */
  const calendarCells = useMemo(() => {
    const first = firstDayOfMonthWeekIndex(viewYear, viewMonth);
    const total = daysInMonth(viewYear, viewMonth);
    const cells = [];
    for (let i = 0; i < first; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
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
  const handleDateClick = (d) => {
    if (!d) return;
    setSelectedDate({ year: viewYear, month: viewMonth, day: d });
    setSelectedTime(null);
  };

  /* 완료 처리(중복 방지 위해 localStorage 저장) */
  const handleComplete = () => {
    if (!patientName || !phoneValid || selectedDoctor === null || !selectedDate || !selectedTime) return;

    const doctor = staffData[selectedDoctor];
    const formattedDate = `${selectedDate.year}.${String(selectedDate.month + 1).padStart(2,"0")}.${String(selectedDate.day).padStart(2,"0")} ${selectedTime}`;

    const newReservation = {
      name: patientName,
      phone,
      doctor: doctor.name,
      dept: doctor.dept,
      date: formattedDate,
      year: selectedDate.year,
      month: selectedDate.month,
      day: selectedDate.day,
      time: selectedTime,
    };

    setReservation(newReservation);
    const updated = [...allReservations, newReservation];
    setAllReservations(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));
    setCurrentStep("complete");
  };

  /* 4단계 스텝 인디케이터 */
  const renderStepIndicator = () => {
    const steps = ["개인정보", "진료과 추천", "의료진 추천", "진료일시"];
    const currentIndex =
      currentStep === "info"     ? 0 :
      currentStep === "symptom"  ? 1 :
      currentStep === "doctor"   ? 2 :
      currentStep === "date"     ? 3 :
      currentStep === "complete" ? 4 : -1;

    const statusOf = (i) => (i === currentIndex ? "current" : currentIndex > i ? "done" : "pending");

    return (
      <aside className="or-step-rail">
        <div className="or-step-oval">
          {steps.map((label, i) => (
            <div key={label} className={`or-step-circle ${statusOf(i)}`}>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </aside>
    );
  };

  return (
    <div className="or-wrap">
      {/* 상단 바 */}
      <header className="staff-header">
        <img src={hospinLogo} alt="HOSPIN 로고" className="staff-logo" onClick={() => navigate("/")} />
        <nav className="staff-menu">
          <button onClick={() => navigate("/medical-record")}>진료 기록 조회</button>
          <button onClick={() => navigate("/online-reservation")}>온라인 예약 및 확인</button>
          <button onClick={() => navigate("/hospital-info")}>병원 소개</button>
          <button onClick={() => navigate("/medical-staff")}>의료진 소개</button>
          <button onClick={() => navigate("/department-recommendation")}>진료과 추천</button>
        </nav>
      </header>

      <header className="or-header">
        <h1>AI 기반 진료과 추천</h1>
      </header>

      <div className="or-body">
        <div className="or-content-row">
          <main className="or-main">
            {/* ① 개인정보 */}
            {currentStep === "info" && (
              <section className="or-section">
                <h2 className="or-title">개인정보 입력</h2>
                <div className="or-form">
                  <div className="or-form-row">
                    <label className="or-form-label">환자이름 :</label>
                    <input
                      className="or-form-input or-input-large"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="이름"
                    />
                  </div>
                  <div className="or-hr" />
                  <div className="or-form-row">
                    <label className="or-form-label">본인 휴대전화 :</label>
                    <input
                      className="or-form-input or-input-large"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-0000-0000"
                    />
                  </div>
                  {!phoneValid && phone.length > 0 && (
                    <p className="or-error">전화번호는 010-0000-0000 형식으로 입력해주세요.</p>
                  )}

                  <div className="or-hr" />
                  <div className="or-actions">
                    <button
                      className="or-btn-primary"
                      onClick={() => setCurrentStep("symptom")}
                      disabled={!patientName || !phoneValid}
                    >
                      다음
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ② 진료과 추천(증상 선택 + 분석) */}
            {currentStep === "symptom" && (
              <section className="or-section">
                <h2 className="or-title">증상 선택</h2>

                <div className="ai-symptoms">
                  {Object.keys(symptomToDept).map((sym) => (
                    <label key={sym} className={`ai-chip ${selectedSymptom === sym ? "on" : ""}`}>
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

                <div className="or-actions two">
                  <button className="or-btn-ghost" onClick={() => setCurrentStep("info")}>
                    이전
                  </button>
                  <button
                    className="or-btn-primary"
                    onClick={analyze}
                    disabled={!selectedSymptom}
                  >
                    분석하기
                  </button>
                </div>

                {recommendedDept && (
                  <div className="ai-result-card">
                    <div className="ai-result-title">AI 분석 결과</div>
                    <div className="ai-result-body">
                      추천 진료과는 <strong>{recommendedDept}</strong> 입니다.
                    </div>
                    <div className="or-actions">
                      <button className="or-btn-primary" onClick={() => setCurrentStep("doctor")}>
                        다음
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* ③ 의료진 선택 */}
            {currentStep === "doctor" && (
              <section className="or-section">
                <h2 className="or-title">추천 진료과의 의료진 선택</h2>

                <div className="or-doc-grid">
                  {staffData
                    .filter((s) => s.dept === recommendedDept)
                    .map((s) => {
                      const index = staffData.indexOf(s);
                      const checked = selectedDoctor === index;
                      return (
                        <div
                          key={s.name}
                          className={`or-doc-card ${checked ? "selected" : ""}`}
                          onClick={() => setSelectedDoctor(checked ? null : index)}
                        >
                          <div className="or-doc-left">
                            <img className="or-doc-img" src={s.img} alt={s.name} />
                          </div>
                          <div className="or-doc-right">
                            <div className="or-doc-name">
                              {s.name}
                              <span className="or-doc-dept"> · {s.dept}</span>
                            </div>
                            <div className="or-doc-line">진료일 | {s.schedule}</div>
                          </div>

                          <div className="ai-check-wrap" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="ai-check"
                              checked={checked}
                              onChange={() => setSelectedDoctor(checked ? null : index)}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="or-actions two">
                  <button className="or-btn-ghost" onClick={() => setCurrentStep("symptom")}>
                    이전
                  </button>
                  <button
                    className="or-btn-primary"
                    onClick={() => setCurrentStep("date")}
                    disabled={selectedDoctor === null}
                  >
                    다음
                  </button>
                </div>
              </section>
            )}

            {/* ④ 진료일시 선택 */}
            {currentStep === "date" && (
              <section className="or-section">
                <h2 className="or-title">진료일시 선택</h2>

                <div className="or-calendar-wrap">
                  <div className="or-cal-top">
                    <button className="or-cal-nav" onClick={goPrevMonth}>◀</button>
                    <div className="or-cal-ym">
                      {viewYear}.{String(viewMonth + 1).padStart(2, "0")}
                    </div>
                    <button className="or-cal-nav" onClick={goNextMonth}>▶</button>
                  </div>

                  <div className="or-cal-grid or-cal-week">
                    {WEEKDAYS.map((wd) => (
                      <div key={wd} className="or-cal-weekcell">{wd}</div>
                    ))}
                  </div>

                  <div className="or-cal-grid">
                    {calendarCells.map((d, idx) => {
                      if (!d) return <div key={idx} className="or-cal-cell empty"></div>;

                      const dateObj = new Date(viewYear, viewMonth, d);
                      const dayOfWeek = dateObj.getDay();
                      const doctor = selectedDoctor !== null ? staffData[selectedDoctor] : null;

                      const isAvailable = doctor && doctor.scheduleDays.includes(dayOfWeek);
                      const isSelected =
                        selectedDate &&
                        selectedDate.year === viewYear &&
                        selectedDate.month === viewMonth &&
                        selectedDate.day === d;

                      return (
                        <div
                          key={idx}
                          className={`or-cal-cell ${!isAvailable ? "disabled" : ""} ${isSelected ? "selected" : ""}`}
                          onClick={() => isAvailable && handleDateClick(d)}
                        >
                          {d}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="or-times">
                    {timeSlots.map((t) => {
                      const reserved =
                        selectedDoctor !== null &&
                        allReservations.some(
                          (r) =>
                            r.year === selectedDate.year &&
                            r.month === selectedDate.month &&
                            r.day === selectedDate.day &&
                            r.time === t &&
                            r.doctor === staffData[selectedDoctor].name
                        );

                      return (
                        <button
                          key={t}
                          className={`or-time ${selectedTime === t ? "on" : ""}`}
                          onClick={() => !reserved && setSelectedTime(t)}
                          disabled={reserved}
                        >
                          {reserved ? "예약됨" : t}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="or-actions two">
                  <button className="or-btn-ghost" onClick={() => setCurrentStep("doctor")}>
                    이전
                  </button>
                  <button
                    className="or-btn-primary"
                    onClick={handleComplete}
                    disabled={!selectedDate || !selectedTime}
                  >
                    예약 완료
                  </button>
                </div>
              </section>
            )}

            {/* 완료 화면 */}
            {currentStep === "complete" && reservation && (
              <section className="or-complete">
                <div className="or-complete-box">
                  <h2>진료 예약 완료</h2>
                  <hr />
                  <p><strong>이름 :</strong> {reservation.name}</p>
                  <p><strong>의료진 · 진료과 :</strong> {reservation.doctor} - {reservation.dept}</p>
                  <p><strong>예약 날짜 :</strong> {reservation.date}</p>
                </div>
              </section>
            )}
          </main>

          {/* 4단계 스텝바 */}
          {renderStepIndicator()}
        </div>
      </div>
    </div>
  );
};

export default AIDepartmentRecommendation;
