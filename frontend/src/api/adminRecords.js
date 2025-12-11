// src/api/adminRecords.js
import http from "./http";

/**
 * 현재 스웨거에 /admin/year-stats, /admin/visits 엔드포인트가 없음.
 * 서버가 준비되지 않았을 때도 화면이 깨지지 않도록 LocalStorage Fallback을 둔다.
 * - key: "ADMIN_YEAR_STATS"   => [{id,year,count,cost,dept}]
 * - key: "ADMIN_VISITS"       => [{id,type,content,date,clinic}]
 */
const LS_YEAR = "ADMIN_YEAR_STATS";
const LS_VISIT = "ADMIN_VISITS";

// -------- LocalStorage helpers --------
const readLS = (k) => {
  try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; }
  catch { return []; }
};
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ========== ① 연도별 진료 이용 현황 ==========
export const fetchYearStats = async () => {
  try {
    const { data } = await http.get("/admin/year-stats"); // 서버에 있으면 사용
    return Array.isArray(data) ? data : (data?.items ?? []);
  } catch {
    // Fallback
    return readLS(LS_YEAR);
  }
};

export const createYearStat = async (row) => {
  try {
    const { data } = await http.post("/admin/year-stats", row);
    return data;
  } catch {
    // Fallback
    const list = readLS(LS_YEAR);
    const id = crypto.randomUUID ? crypto.randomUUID() : `loc-${Date.now()}`;
    const created = { id, ...row };
    writeLS(LS_YEAR, [...list, created]);
    return created;
  }
};

export const updateYearStat = async (row) => {
  try {
    const { data } = await http.put(`/admin/year-stats/${row.id}`, row);
    return data;
  } catch {
    // Fallback
    const list = readLS(LS_YEAR);
    const next = list.map((x) => (x.id === row.id ? { ...x, ...row } : x));
    writeLS(LS_YEAR, next);
    return next.find((x) => x.id === row.id);
  }
};

export const deleteYearStat = async (id) => {
  try {
    await http.delete(`/admin/year-stats/${id}`);
    return true;
  } catch {
    // Fallback
    const list = readLS(LS_YEAR).filter((x) => x.id !== id);
    writeLS(LS_YEAR, list);
    return true;
  }
};

// ========== ② 진료 내역(완료 예약) ==========
export const fetchCompletedVisits = async () => {
  try {
    const { data } = await http.get("/admin/visits/completed"); // 서버에 있으면 사용
    return Array.isArray(data) ? data : (data?.items ?? []);
  } catch {
    // Fallback
    return readLS(LS_VISIT);
  }
};

export const createVisit = async (row) => {
  try {
    const { data } = await http.post("/admin/visits", row);
    return data;
  } catch {
    // Fallback
    const list = readLS(LS_VISIT);
    const id = crypto.randomUUID ? crypto.randomUUID() : `loc-${Date.now()}`;
    const created = { id, ...row };
    writeLS(LS_VISIT, [...list, created]);
    return created;
  }
};

export const updateVisit = async (row) => {
  try {
    const { data } = await http.put(`/admin/visits/${row.id}`, row);
    return data;
  } catch {
    // Fallback
    const list = readLS(LS_VISIT);
    const next = list.map((x) => (x.id === row.id ? { ...x, ...row } : x));
    writeLS(LS_VISIT, next);
    return next.find((x) => x.id === row.id);
  }
};

export const deleteVisit = async (id) => {
  try {
    await http.delete(`/admin/visits/${id}`);
    return true;
  } catch {
    // Fallback
    const list = readLS(LS_VISIT).filter((x) => x.id !== id);
    writeLS(LS_VISIT, list);
    return true;
  }
};
