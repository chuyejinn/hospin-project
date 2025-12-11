// src/pages/AdminApprovals.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import "../styles/AdminApprovals.css";
// ⬇️ 새 API 이름으로 교체
import { fetchPendingUsers, approveUser, rejectUser } from "../api/admin";

export default function AdminApprovals() {
  const [rows, setRows] = useState([]);         // 대기 목록
  const [result, setResult] = useState({});     // { [id]: 'approved' | 'rejected' }
  const [loading, setLoading] = useState(true); // 목록 로딩
  const [busyId, setBusyId] = useState(null);   // 각 행 버튼 로딩
  const [error, setError] = useState("");       // 일반 에러 메시지

  const hasRows = useMemo(() => rows.length > 0, [rows]);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // ⬇️ getPendingAdmins() → fetchPendingUsers()
      const data = await fetchPendingUsers();

      // 배열/래핑 어떤 형태든 흡수
      const list =
        (Array.isArray(data) && data) ||
        data?.items || data?.content || data?.list || data?.data || [];

      // 필드명 유연 매핑
      const normalized = list.map((d) => ({
        id: d.id ?? d.userId ?? d.adminId,
        username: d.username ?? d.userName ?? d.name ?? "",
        phone: d.phone ?? d.phoneNumber ?? d.tel ?? "",
        email: d.email ?? d.emailAddress ?? "",
      }));

      setRows(normalized);
    } catch (e) {
      console.error("[GET /admin/pending] failed:", e?.response || e);
      setError("목록을 불러오지 못했습니다.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const mark = (id, type) => setResult((r) => ({ ...r, [id]: type }));

  const handleApprove = async (id) => {
    try {
      setBusyId(id);
      // ⬇️ approveAdmin(id) → approveUser(id)
      await approveUser(id);
      mark(id, "approved");
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("[PUT /admin/approve/{userId}] failed:", e?.response || e);
      alert("승인 처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setBusyId(id);
      // ⬇️ rejectAdmin(id) → rejectUser(id)
      await rejectUser(id);
      mark(id, "rejected");
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("[PUT /admin/reject/{userId}] failed:", e?.response || e);
      alert("거절 처리에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  const Chip = ({ type }) => {
    if (!type) return null;
    return <span className={`chip ${type}`}>{type === "approved" ? "승인 완료" : "거절됨"}</span>;
  };

  return (
    <div className="ap-wrapper">
      <div className="ap-head">
        <div className="ap-title">
          <span className="ap-plus">＋</span>
          <span>관리자 승인 화면</span>
        </div>
        <button className="ap-res-btn" onClick={fetchPending}>새로고침</button>
      </div>

      {error && <div className="ap-error" style={{ color: "#c0392b", marginBottom: 12 }}>{error}</div>}

      <div className="ap-panel">
        {loading ? (
          <div className="ap-empty">불러오는 중...</div>
        ) : !hasRows ? (
          <div className="ap-empty">대기 중인 신청이 없습니다.</div>
        ) : (
          <div className="ap-table">
            <div className="ap-thead">
              <div className="cell header">아이디</div>
              <div className="cell header">비밀번호</div>
              <div className="cell header">전화번호</div>
              <div className="cell header">이메일</div>
              <div className="cell header actions">승인/거절</div>
            </div>

            {rows.map((r) => (
              <div className="ap-row" key={r.id}>
                <div className="cell">{r.username}</div>
                <div className="cell pw">********</div>
                <div className="cell">{r.phone}</div>
                <div className="cell">{r.email}</div>
                <div className="cell actions">
                  <div className="btns">
                    <button
                      className="btn approve"
                      disabled={busyId === r.id}
                      onClick={() => handleApprove(r.id)}
                    >
                      {busyId === r.id ? "처리중..." : "승인"}
                    </button>
                    <button
                      className="btn reject"
                      disabled={busyId === r.id}
                      onClick={() => handleReject(r.id)}
                    >
                      {busyId === r.id ? "처리중..." : "거절"}
                    </button>
                  </div>
                  <Chip type={result[r.id]} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
