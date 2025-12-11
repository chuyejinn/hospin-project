import axios from "axios";

const BASE = "http://52.79.75.251:8080";   // 새 API 주소

export const loginApi = (email, password) =>
  axios.post(`${BASE}/auth/login`, { email, password });

export const signupApi = (data) =>
  axios.post(`${BASE}/auth/signup`, data);
