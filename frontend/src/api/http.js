// src/api/http.js
import axios from "axios";

/**
 * ⚙️ 서버 주소 (배포/로컬에 맞게 수정)
 *  - 로컬: "http://localhost:8080"
 *  - 배포:  "http://52.79.75.251:8080"
 */
const BASE_URL = "http://52.79.75.251:8080";

const http = axios.create({
  baseURL: BASE_URL,
  // 쿠키/세션 미사용 → CORS 단순화 (JWT 헤더만 보낼 때 권장)
  withCredentials: false,
});

/**
 * 🔐 요청 인터셉터
 * - accessToken 우선 사용
 * - 없으면 auth:v1.token 사용
 */
http.interceptors.request.use((config) => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    try {
      const parsed = JSON.parse(localStorage.getItem("auth:v1") || "{}");
      token = parsed?.token;
    } catch {
      /* ignore */
    }
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default http;
