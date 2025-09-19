import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = () => {
    alert("로그인 성공!");
    localStorage.setItem("token", "dummy-token");
    setIsLoggedIn(true);
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  if (isLoggedIn) {
    return (
      <div className="login-screen">
        <div className="login-container">
          <div className="login-form-box">
            <p>이미 로그인 상태입니다.</p>
            <button className="btn-next" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              placeholder="이메일 입력"
              className="input-text"
            />
          </div>
         
          <div className="input-row password-row">
            <label className="label" htmlFor="password">비밀번호 :</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="input-text"
            />
          </div>
          
          <div className="button-group">
            <button className="btn-prev" onClick={() => navigate("/")}>이전</button>
            <button className="btn-next" onClick={handleLogin}>다음</button>
          </div>
        </div>
        <div className="title">로그인</div>
        <div
          className="signup-text"
          onClick={() => navigate("/signup")}
        >
          회원가입 하기
        </div>
      </div>
    </div>
  );
};

export default Login;
