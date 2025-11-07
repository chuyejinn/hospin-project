import React from "react";

const AdminPending = () => {
  const email = localStorage.getItem("userEmail") || "";

  return (
    <div style={{ padding: 40 }}>
      <h1>관리자 승인 대기</h1>
      <p>
        {email && <b>{email}</b>} 계정의 관리자 승인 절차가 진행 중입니다.
        <br />승인이 완료되면 “관리자 페이지”에 접속할 수 있습니다.
      </p>
      <p style={{ marginTop: 16, color: "#666" }}>
        (개발 중이라면 <code>/debug-auth</code>에서 <b>ADMIN(승인)</b>을 눌러 흐름을 점검하세요.)
      </p>
    </div>
  );
};

export default AdminPending;
