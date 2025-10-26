import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const API_BASE = "http://3.38.239.246:8080";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token: "" }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message;
        alert(msg || "가입되지 않은 회원입니다.");
        setError(msg || "");
        return;
      }

      const token = data?.token;
      const role  = data?.role || data?.userRole || "PATIENT";
      const userEmail = data?.email || email;
      const adminApproved = (typeof data?.adminApproved === "boolean")
        ? data.adminApproved
        : (role === "ADMIN" ? false : null);

      if (!token) {
        alert("서버에서 토큰을 받지 못했습니다.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", userEmail);
      if (adminApproved !== null) {
        localStorage.setItem("adminApproved", String(adminApproved));
      } else {
        localStorage.removeItem("adminApproved");
      }

      navigate("/home");
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-form-box">
          <div className="input-row">
            <label className="label" htmlFor="email">이메일 :</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="이메일 입력"
              className="input-text"
              autoComplete="username"
            />
          </div>

          <div className="input-row password-row">
            <label className="label" htmlFor="password">비밀번호 :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="비밀번호 입력"
              className="input-text"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="button-group">
            <button className="btn-prev" onClick={() => navigate("/")}>이전</button>
            <button className="btn-next" onClick={handleLogin} disabled={loading}>
              {loading ? "확인중..." : "다음"}
            </button>
          </div>
        </div>

        <div className="title">로그인</div>
        <div className="signup-text" onClick={() => navigate("/signup")}>
          회원가입 하기
        </div>
      </div>
    </div>
  );
};

export default Login;
