// src/api/userRecords.js
import api from "./http";

/** 특정 환자(userId)의 진료 기록 목록 */
export async function getVisitsByUser(userId) {
  if (!userId) return [];
  const res = await api.get(`/medical-records/${userId}`);
  return Array.isArray(res.data) ? res.data : [];
}

/** 진료기록 생성 (관리자) */
export async function createVisit(userId, payload) {
  // userId 반드시 포함 + 날짜는 yyyy-MM-dd
  const body = {
    userId: Number(userId),
    date: (payload.date || "").slice(0, 10),
    department: payload.department?.trim() || "",
    doctor: payload.doctor?.trim() || "",
    content: payload.content?.trim() || "",
    prescription: payload.prescription?.trim() || "",
  };
  const res = await api.post("/medical-records", body);
  return res.data;
}

/** 진료기록 수정 */
export async function updateVisit(recordId, payload) {
  const body = {
    date: (payload.date || "").slice(0, 10),
    department: payload.department?.trim() || "",
    doctor: payload.doctor?.trim() || "",
    content: payload.content?.trim() || "",
    prescription: payload.prescription?.trim() || "",
  };
  const res = await api.put(`/medical-records/${recordId}`, body);
  return res.data;
}

/** 진료기록 삭제 */
export async function deleteVisit(recordId) {
  await api.delete(`/medical-records/${recordId}`);
}
