import React, { useState, useEffect } from "react";

export default function DebugAuthPanel() {
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "debug@example.com");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    // 초기 상태 표현만
  }, []);

  const setPatient = () => {
    localStorage.setItem("token", token || "dummy");
    localStorage.setItem("userRole", "PATIENT");
    localStorage.setItem("userEmail", email);
    localStorage.removeItem("adminApproved");
    alert("PATIENT 설정 완료");
  };

  const setAdminPending = () => {
    localStorage.setItem("token", token || "dummy");
    localStorage.setItem("userRole", "ADMIN");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("adminApproved", "false");
    alert("ADMIN(미승인) 설정 완료");
  };

  const setAdminApproved = () => {
    localStorage.setItem("token", token || "dummy");
    localStorage.setItem("userRole", "ADMIN");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("adminApproved", "true");
    alert("ADMIN(승인) 설정 완료");
  };

  const setSuper = () => {
    localStorage.setItem("token", token || "dummy");
    localStorage.setItem("userRole", "ADMIN");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("adminApproved", "true");
    alert("SUPER_ADMIN(동일 취급) 설정 완료");
  };

  const clearAll = () => {
    localStorage.clear();
    setToken("");
    alert("localStorage 초기화");
  };

  const role = localStorage.getItem("userRole") || "없음";
  const approved = localStorage.getItem("adminApproved");

  return (
    <div style={{ padding: 24 }}>
      <h2>🔧 Debug Auth Panel (개발용, 운영 전 삭제)</h2>
      <div style={{ marginTop: 8 }}>
        <label>이메일 </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: 300, marginLeft: 8 }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={setPatient}>PATIENT</button>{" "}
        <button onClick={setAdminPending}>ADMIN (미승인)</button>{" "}
        <button onClick={setAdminApproved}>ADMIN (승인)</button>{" "}
        <button onClick={setSuper}>SUPER_ADMIN</button>{" "}
        <button onClick={clearAll}>Clear</button>
      </div>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
        <div><b>role:</b> {role}</div>
        <div><b>email:</b> {email}</div>
        <div><b>adminApproved:</b> {approved ?? "없음"}</div>
        <div><b>token:</b> {localStorage.getItem("token") ? "있음" : "없음"}</div>
      </div>

      <p style={{ marginTop: 16, color: "#c33" }}>
        ⚠ 누구나 이 값을 바꿀 수 있으므로 보안 검증용으로 사용 금지! 오직 UI 흐름 점검용입니다.
      </p>
    </div>
  );
}
