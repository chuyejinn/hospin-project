// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const API_BASE = "http://52.79.75.251:8080";

// ── 유효성 함수들 ───────────────────────────────────────────────
function isValidEmail(v) {
  return /^\S+@\S+\.\S+$/.test(v);
}
// 영문 + 숫자 + 특수문자 포함 8자 이상
function isStrongPassword(v) {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(v);
}
// YYYY-MM-DD, 오늘 이전 날짜
function isValidBirthdate(yyyyMmDd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false;
  const [Y, M, D] = yyyyMmDd.split("-").map(Number);
  const d = new Date(Date.UTC(Y, M - 1, D));
  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  return d < todayUTC;
}

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    gender: "",      // "MALE" | "FEMALE"
    birthdate: "",   // "YYYY-MM-DD"
    roleUI: "",      // 화면 표시용: "일반 환자" | "관리자"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const validate = () => {
    if (!form.roleUI) return "가입 유형(환자/관리자)을 선택해주세요.";

    if (!form.email.trim() || !isValidEmail(form.email.trim())) {
      return "올바른 이메일 형식을 입력해주세요.";
    }
    if (!form.password.trim() || !isStrongPassword(form.password.trim())) {
      return "비밀번호는 영문+숫자+특수문자 포함 8자 이상이어야 합니다.";
    }
    if (!form.username.trim()) {
      return "이름(사용자명)을 입력해주세요.";
    }
    // 서버 정책: 성별은 MALE/FEMALE만 허용
    if (!["MALE", "FEMALE"].includes(form.gender)) {
      return "성별은 MALE/FEMALE 중 하나를 선택해주세요.";
    }
    if (!isValidBirthdate(form.birthdate)) {
      return "생년월일은 과거 날짜(YYYY-MM-DD 형식)여야 합니다.";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setOkMsg("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    // 서버 정책: 가입 시 role은 무조건 PATIENT로 전송
    // (관리자 신청은 이후 승격/승인 프로세스로 처리)
    const payload = {
      email: form.email.trim(),
      password: form.password.trim(),
      username: form.username.trim(),
      gender: form.gender,          // "MALE" | "FEMALE"
      birthdate: form.birthdate,    // "YYYY-MM-DD"
        role: form.roleUI === "관리자" ? "ADMIN_PENDING" : "PATIENT",
    };

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setError("이미 가입된 이메일입니다.");
          return;
        }
        // 서버 메시지 최대한 보여주기
        let serverMsg = "";
        try {
          const errJson = await res.json();
          serverMsg = errJson?.message || errJson?.error || "";
        } catch {
          serverMsg = await res.text().catch(() => "");
        }
        setError(serverMsg || "요청이 올바르지 않습니다. (gender/role/birthdate 형식을 확인해주세요)");
        return;
      }

      setOkMsg("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => navigate("/login"), 900);
    } catch (e) {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">
        <div className="main-title">회원가입</div>

        <div className="signup-form">
          <h2 className="form-title">기본 정보 입력</h2>
          <hr className="divider" />

          {/* 가입 유형 */}
          <div className="role-section">
            <label className="label">가입 유형</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${form.roleUI === "일반 환자" ? "active" : ""}`}
                onClick={() => setForm({ ...form, roleUI: "일반 환자" })}
                disabled={loading}
              >
                일반 환자
              </button>
              <button
                type="button"
                className={`role-btn ${form.roleUI === "관리자" ? "active" : ""}`}
                onClick={() => setForm({ ...form, roleUI: "관리자" })}
                disabled={loading}
              >
                관리자
              </button>
            </div>
          </div>

          {/* 이메일 */}
          <div className="input-section">
            <label className="label">이메일</label>
            <input
              className="input-text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              autoComplete="email"
              disabled={loading}
            />
            <p className="hint">* 로그인 및 비밀번호 찾기에 사용</p>
          </div>

          {/* 비밀번호 */}
          <div className="input-section">
            <label className="label">비밀번호</label>
            <input
              type="password"
              className="input-text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="영문+숫자+특수문자 포함 8자 이상"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          {/* 이름 */}
          <div className="input-section">
            <label className="label">이름</label>
            <input
              className="input-text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="이름 입력"
              disabled={loading}
            />
          </div>

          {/* 성별: MALE/FEMALE만 */}
          <div className="input-section">
            <label className="label">성별</label>
            <select
              className="input-text"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              disabled={loading}
            >
              <option value="">선택</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
            <p className="hint">* 반드시 대문자(MALE/FEMALE)</p>
          </div>

          {/* 생년월일 */}
          <div className="input-section">
            <label className="label">생년월일</label>
            <input
              type="date"
              className="input-text"
              value={form.birthdate}
              onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
              disabled={loading}
            />
            <p className="hint">* 형식: YYYY-MM-DD (오늘 이전 날짜)</p>
          </div>

          {error && <div className="error-text">{error}</div>}
          {okMsg && <div className="ok-text">{okMsg}</div>}

          <div className="button-group">
            <button
              className="btn-prev"
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              이전
            </button>
            <button
              className="btn-next"
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "처리중..." : "가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
