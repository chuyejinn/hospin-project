// src/api/admin.js
import http from "./http";

// 대기 목록
export const fetchPendingUsers = async () => {
  const { data } = await http.get("/admin/pending");
  return data;
};

// 승인
export const approveUser = async (userId) => {
  // Swagger: PUT /admin/approve/{userId}
  await http.put(`/admin/approve/${userId}`);
};

// 거절
export const rejectUser = async (userId) => {
  // Swagger: PUT /admin/reject/{userId}
  await http.put(`/admin/reject/${userId}`);
};
