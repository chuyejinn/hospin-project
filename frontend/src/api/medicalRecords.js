// src/api/medicalRecords.js
import api from "./http";

/** 특정 환자(userId)의 진료 기록 목록 (환자 화면) */
export const fetchMedicalRecords = async (userId) => {
  if (!userId) return [];
  try {
    const res = await api.get(`/medical-records/${userId}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("진료 기록 조회 실패:", err);
    return [];
  }
};
