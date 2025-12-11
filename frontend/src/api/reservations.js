// src/api/reservations.js
import http from "./http";

/* ───────────── 유틸 ───────────── */
const pad = (n) => n.toString().padStart(2, "0");
const toYmd = (y, m0, d) => `${y}-${pad(m0 + 1)}-${pad(d)}`;   // m0: 0-based

function readLocalReservations() {
  try {
    const raw = localStorage.getItem("reservations");
    const arr = raw ? JSON.parse(raw) : [];
    // 예) { name, phone, doctor, dept, date:"YYYY.MM.DD HH:mm", year, month(0-based), day, time }
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/* ========== [관리자] 월 요약 ========== 
 * GET /admin/reservations/summary?year=YYYY&month=M
 * 백엔드 실패 시 localStorage로 대체
 */
export async function fetchMonthSummary(year, month) {
  try {
    const { data } = await http.get("/admin/reservations/summary", {
      params: { year, month },
    });
    return data || {};
  } catch {
    // Fallback: localStorage 집계
    const map = {};
    const list = readLocalReservations();
    list.forEach((r) => {
      if (r.year === year && r.month === month - 1) {
        const key = toYmd(r.year, r.month, r.day);
        map[key] = (map[key] || 0) + 1;
      }
    });
    return map; // {"YYYY-MM-DD": count}
  }
}

/* ========== [관리자] 날짜별 예약 목록 ========== 
 * GET /admin/reservations?date=YYYY-MM-DD
 * 응답 예: [{id, time, status, patientId, patientName}, ...]
 * 실패 시 localStorage에서 대체
 */
export async function fetchReservationsByDate(dateYmd) {
  try {
    const { data } = await http.get("/admin/reservations", {
      params: { date: dateYmd },
    });
    return Array.isArray(data) ? data : [];
  } catch {
    const list = readLocalReservations();
    const [y, m, d] = dateYmd.split("-").map(Number);
    return list
      .filter((r) => r.year === y && r.month === m - 1 && r.day === d)
      .map((r, idx) => ({
        id: `loc-${y}${m}${d}-${idx}`,
        time: r.time,
        status: "COMPLETED",
        patientId: null,
        patientName: r.name,
        dept: r.dept,
        doctor: r.doctor,
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }
}

/* ========== [관리자] 예약 상세 ========== 
 * GET /admin/reservations/{reservationId}
 * 실패 시 localStorage 임시 정보
 */
export async function fetchReservationDetail(reservationId) {
  try {
    const { data } = await http.get(`/admin/reservations/${reservationId}`);
    return data;
  } catch {
    if (!String(reservationId).startsWith("loc-")) throw new Error("no-fallback");
    const list = readLocalReservations();
    const r = list.find(Boolean);
    if (!r) return null;
    return {
      id: reservationId,
      date: `${r.year}-${pad(r.month + 1)}-${pad(r.day)}`,
      time: r.time,
      department: r.dept,
      memo: "",
      patient: {
        id: null,
        name: r.name,
        phone: r.phone,
        gender: "-",
        email: "-",
        ssn: "-",
        profileUrl: null,
        birthdate: "-"
      }
    };
  }
}

/* ========== [관리자] 환자 과거 내역 ========== 
 * GET /admin/patients/{patientId}/reservations
 * 실패 시 localStorage로 대체
 */
export async function fetchPatientHistory(patientId) {
  try {
    const { data } = await http.get(`/admin/patients/${patientId}/reservations`);
    return Array.isArray(data) ? data : [];
  } catch {
    const list = readLocalReservations();
    return list.map((r, i) => ({
      id: `loc-his-${i}`,
      date: `${r.year}-${pad(r.month + 1)}-${pad(r.day)}`,
      time: r.time,
      hospital: "구도원",
      department: r.dept,
      summary: `${r.doctor} 진료`,
    }));
  }
}

/* ===========================================================
   =============   [사용자] 예약 관련 엔드포인트   ============
   스웨거 스펙:
   - POST   /reservations           { departmentId, doctorId, reservationDate, reservationTime }
   - GET    /reservations/my
   - DELETE /reservations/{reservationId}
   =========================================================== */

/** 예약 생성 */
export const createReservation = async ({
  departmentId,
  doctorId,
  reservationDate,
  reservationTime,
}) => {
  const payload = {
    departmentId: Number(departmentId),
    doctorId: Number(doctorId),
    reservationDate,   // "YYYY-MM-DD"
    reservationTime,   // "HH:mm"
  };
  const { data } = await http.post("/reservations", payload);
  return data;
};

/** 내 예약 목록 조회 */
export const getMyReservations = async () => {
  const { data } = await http.get("/reservations/my");
  return Array.isArray(data) ? data : [];
};

/** 예약 취소 */
export const cancelReservation = async (reservationId) => {
  const { data } = await http.delete(`/reservations/${reservationId}`);
  return data;
};
