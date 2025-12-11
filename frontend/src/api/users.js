// src/api/users.js
import http from "./http";

/**
 * 관리자 사용자 검색
 * GET /admin/users/search?keyword=...
 */
export const searchUsers = async (keyword) => {
  const q = keyword?.trim();
  if (!q) return [];

  try {
    const { data } = await http.get("/admin/users/search", {
      params: { keyword: q },
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    // 상태/메시지 콘솔로만 남기고, 화면은 기존 로직대로 처리
    console.error(
      "[searchUsers] 실패:",
      err?.response?.status ?? "N/A",
      err?.message
    );
    return [];
  }
};
