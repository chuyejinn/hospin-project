import React from "react";

const AdminHome = () => {
  return (
    <div style={{ padding: 40 }}>
      <h1>관리자 홈</h1>
      <p>승인된 관리자만 볼 수 있는 영역입니다.</p>
      <ul>
        <li>예: 예약 관리</li>
        <li>예: 의료진 관리</li>
        <li>예: 공지/배너 관리</li>
      </ul>
    </div>
  );
};

export default AdminHome;
