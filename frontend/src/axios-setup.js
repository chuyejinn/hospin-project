// 모든 axios & fetch 호출을 EC2로 강제 연결
import axios from "axios";

const BASE = "http://52.79.75.251:8080"; // 로컬 테스트 시 "http://localhost:8080"

// ----- axios 전역 설정 -----
axios.defaults.baseURL = BASE;
axios.defaults.withCredentials = true;

// 디버깅용: 실제로 어디로 나가는지 로그
axios.interceptors.request.use((config) => {
  const full = (config.baseURL || "") + (config.url || "");
  console.log("AXIOS →", full);
  return config;
});

// ----- fetch도 강제 프리픽스 (상대경로로 부르면 자동으로 BASE를 붙임) -----
const _origFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  let url = input;

  // Request 객체면 url만 꺼내서 처리
  if (input instanceof Request) url = input.url;

  // "http"로 시작하지 않는 상대경로면 BASE를 붙임
  if (typeof url === "string" && /^\/(?!\/)/.test(url)) {
    url = BASE + url;
  }
  console.log("FETCH →", url);
  return _origFetch(url, init);
};
