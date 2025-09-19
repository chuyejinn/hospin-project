import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    alert("회원가입 완료!");
    navigate("/login");
  };

  return (
    <div className="signup-screen">
      <div className="signup-container">

        {/* 상단 큰 제목 */}
        <div className="main-title">회원가입</div>

        <div className="signup-form">
          <h2 className="form-title">기본 정보 입력</h2>
          <hr className="divider" />

          {/* 아이디 */}
          <div className="input-section">
            <label className="label">아이디</label>
            <input
              className="input-text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="아이디 입력"
            />
            <p className="hint">* 영문, 숫자 조합 5~20자 이내</p>
          </div>

          {/* 비밀번호 */}
          <div className="input-section">
            <label className="label">비밀번호</label>
            <input
              type="password"
              className="input-text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="비밀번호 입력"
            />
            <p className="hint">* 영문, 숫자, 특수문자 포함 8자 이상</p>
          </div>

          {/* 연락처 */}
          <div className="input-section">
            <label className="label">연락처</label>
            <input
              className="input-text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000"
            />
            <p className="hint">* 휴대전화 번호</p>
          </div>

          {/* 이메일 */}
          <div className="input-section">
            <label className="label">이메일</label>
            <input
              className="input-text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
            />
            <p className="hint">* 비밀번호 찾기 등에 사용</p>
          </div>

          {/* 버튼 */}
          <div className="button-group">
            <button className="btn-prev" onClick={() => navigate("/login")}>
              이전
            </button>
            <button className="btn-next" onClick={handleSubmit}>
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
