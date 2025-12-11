// src/pages/AdminRecordsEdit.js
import React, { useEffect, useMemo, useState } from "react";
import AdminRoute from "../routes/AdminRoute";
import "../styles/AdminRecordsEdit.css";
import {
  getVisitsByUser, createVisit, updateVisit, deleteVisit,
} from "../api/userRecords";
import { searchUsers } from "../api/users";

const emptyVisit = {
  id: null,
  date: "",
  department: "",
  doctor: "",
  content: "",
  prescription: "",
};

export default function AdminRecordsEdit() {
  /* ===== 환자 선택: 검색 + 수동 ID ===== */
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [manualId, setManualId] = useState("");

  const onSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const list = await searchUsers(query.trim());
    setOptions(list);
    setSearching(false);

    if (list.length === 0) {
      const d = window.__lastSearchDebug;
      console.error("[검색 디버그]", d);
      const reason = d
        ? `\n\n▶ 요청: ${d.url}\n▶ 상태: ${d.status ?? "N/A"}\n▶ 메시지: ${d.message ?? ""}`
        : "";
      alert("검색 결과가 없거나 검색 API가 없습니다. '환자 ID'로 불러오기를 사용하세요." + reason);
    }
  };

  const onPickUser = (u) => {
    setSelectedUserId(String(u.id));
    setManualId(String(u.id));
    setOptions([]);
    setQuery(`${u.username ?? u.name ?? ""} (${u.email})`);
  };

  const onLoadByManualId = () => {
    if (!manualId.trim()) return;
    setSelectedUserId(manualId.trim());
    setOptions([]);
  };

  /* ===== 데이터 ===== */
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyVisit);
  const hasRows = useMemo(() => rows.length > 0, [rows]);

  // 공통 정렬: 날짜 내림차순
  const sortRows = (arr) =>
    [...arr].sort((a, b) => new Date(b.date) - new Date(a.date));

  // 환자 선택 시 목록 로드
  useEffect(() => {
    if (!selectedUserId) { setRows([]); return; }
    (async () => {
      setLoading(true);
      const data = await getVisitsByUser(selectedUserId);
      const normalized = (data || []).map(v => ({
        id: v.recordId ?? v.id,
        date: (v.date ?? v.visitDate ?? "").slice(0, 10),
        department: v.department ?? v.departmentName ?? "",
        doctor: v.doctor ?? v.doctorName ?? "",
        content: v.content ?? v.diagnosis ?? "",
        prescription: v.prescription ?? "",
      }));
      setRows(sortRows(normalized));
      setLoading(false);
    })();
  }, [selectedUserId]);

  /* ===== CRUD ===== */
  const onAdd = () => { setEditingId("NEW"); setDraft(emptyVisit); };
  const onEdit = (row) => { setEditingId(row.id); setDraft(row); };
  const onCancel = () => { setEditingId(null); setDraft(emptyVisit); };

  const onSave = async () => {
    if (!selectedUserId) return alert("환자를 먼저 선택하세요.");
    if (!draft.date) return alert("날짜를 입력하세요(YYYY-MM-DD).");
    if (!draft.content) return alert("진료 내용을 입력하세요.");

    const fixed = { ...draft, date: (draft.date || "").slice(0, 10) };

    if (editingId === "NEW") {
      try {
        const created = await createVisit(selectedUserId, fixed);
        const row = {
          id: created.recordId ?? created.id,
          date: (created.date ?? fixed.date).slice(0, 10),
          department: created.department ?? fixed.department,
          doctor: created.doctor ?? fixed.doctor,
          content: created.content ?? fixed.content,
          prescription: created.prescription ?? fixed.prescription,
        };
        setRows(prev => sortRows([row, ...prev]));
        onCancel();
      } catch (e) {
        console.error(e);
        alert("등록 실패");
      }
    } else {
      try {
        await updateVisit(editingId, fixed);
        setRows(prev =>
          sortRows(prev.map(r => (r.id === editingId ? { ...fixed, id: editingId } : r)))
        );
        onCancel();
      } catch (e) {
        alert("수정 API가 백엔드에 없습니다. (PUT /medical-records/{recordId})");
      }
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await deleteVisit(id);
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      alert("삭제 API가 백엔드에 없습니다. (DELETE /medical-records/{recordId})");
    }
  };

  return (
    <AdminRoute type="approved">
      <div className="are-wrap">
        {/* ===== 환자 선택 바 ===== */}
        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          <div className="are-userpick" style={{ display:"flex", gap:8, alignItems:"center" }}>
            <label>환자 검색:</label>
            <input
              className="ipt"
              placeholder="이름(username) / 이메일 / 전화"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              onKeyDown={(e)=> e.key === "Enter" && onSearch()}
              style={{ width: 260 }}
            />
            <button className="btn" onClick={onSearch} disabled={searching || !query.trim()}>
              {searching ? "검색중…" : "검색"}
            </button>

            <span style={{ marginLeft: 16, opacity:.8 }}>또는</span>
            <label style={{ marginLeft: 8 }}>환자 ID:</label>
            <input className="ipt" placeholder="예: 1" value={manualId}
                   onChange={(e)=>setManualId(e.target.value)} style={{ width:120 }} />
            <button className="btn" onClick={onLoadByManualId} disabled={!manualId.trim()}>
              불러오기
            </button>

            {selectedUserId && (
              <span style={{ marginLeft:8, opacity:.8 }}>선택됨: {selectedUserId}</span>
            )}
          </div>

          {options.length > 0 && (
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:8 }}>
              {options.map(u => (
                <button key={u.id} className="btn"
                        style={{ display:"block", width:"100%", textAlign:"left", marginBottom:6 }}
                        onClick={()=>onPickUser(u)}>
                  {(u.username ?? u.name) || "(이름없음)"} · {u.email} {u.phone ? `· ${u.phone}` : ""} (id: {u.id})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== 진료 기록 ===== */}
        <div className="are-head"><span className="plus">＋</span><h1>진료 기록 관리</h1></div>

        <div className="are-table">
          <div className="are-thead">
            <div className="cell header w140">날짜</div>
            <div className="cell header w160">진료과</div>
            <div className="cell header w160">의료진</div>
            <div className="cell header w260">진료 내용</div>
            <div className="cell header w220">처방</div>
            <div className="cell header w180">작업</div>
          </div>

          {loading ? (
            <div className="are-empty">불러오는 중…</div>
          ) : !hasRows ? (
            <div className="are-empty">데이터가 없습니다.</div>
          ) : (
            rows.map(r => (
              editingId === r.id ? (
                <div className="are-row" key={r.id}>
                  <div className="cell">
                    <input className="ipt" value={draft.date ?? ""}
                           onChange={e=>setDraft(d=>({ ...d, date:e.target.value }))} placeholder="2025-11-08" />
                  </div>
                  <div className="cell">
                    <input className="ipt" value={draft.department ?? ""}
                           onChange={e=>setDraft(d=>({ ...d, department:e.target.value }))} placeholder="보존과" />
                  </div>
                  <div className="cell">
                    <input className="ipt" value={draft.doctor ?? ""}
                           onChange={e=>setDraft(d=>({ ...d, doctor:e.target.value }))} placeholder="홍길동" />
                  </div>
                  <div className="cell">
                    <input className="ipt" value={draft.content ?? ""}
                           onChange={e=>setDraft(d=>({ ...d, content:e.target.value }))} placeholder="레진" />
                  </div>
                  <div className="cell">
                    <input className="ipt" value={draft.prescription ?? ""}
                           onChange={e=>setDraft(d=>({ ...d, prescription:e.target.value }))} placeholder="진통제 3일" />
                  </div>
                  <div className="cell actions">
                    <button className="btn save"  onClick={onSave} disabled={!selectedUserId}>저장</button>
                    <button className="btn ghost" onClick={onCancel}>취소</button>
                  </div>
                </div>
              ) : (
                <div className="are-row" key={r.id}>
                  <div className="cell">{r.date}</div>
                  <div className="cell">{r.department}</div>
                  <div className="cell">{r.doctor}</div>
                  <div className="cell">{r.content}</div>
                  <div className="cell">{r.prescription}</div>
                  <div className="cell actions">
                    <button className="btn"        onClick={()=>onEdit(r)} disabled={!selectedUserId}>수정</button>
                    <button className="btn danger" onClick={()=>onDelete(r.id)} disabled={!selectedUserId}>삭제</button>
                  </div>
                </div>
              )
            ))
          )}

          {editingId === "NEW" && (
            <div className="are-row">
              <div className="cell">
                <input className="ipt" value={draft.date}
                       onChange={e=>setDraft(d=>({ ...d, date:e.target.value }))} placeholder="2025-11-08" />
              </div>
              <div className="cell">
                <input className="ipt" value={draft.department}
                       onChange={e=>setDraft(d=>({ ...d, department:e.target.value }))} placeholder="보존과" />
              </div>
              <div className="cell">
                <input className="ipt" value={draft.doctor}
                       onChange={e=>setDraft(d=>({ ...d, doctor:e.target.value }))} placeholder="홍길동" />
              </div>
              <div className="cell">
                <input className="ipt" value={draft.content}
                       onChange={e=>setDraft(d=>({ ...d, content:e.target.value }))} placeholder="레진" />
              </div>
              <div className="cell">
                <input className="ipt" value={draft.prescription}
                       onChange={e=>setDraft(d=>({ ...d, prescription:e.target.value }))} placeholder="진통제 3일" />
              </div>
              <div className="cell actions">
                <button className="btn save" onClick={onSave} disabled={!selectedUserId}>추가</button>
                <button className="btn ghost" onClick={onCancel}>취소</button>
              </div>
            </div>
          )}
        </div>

        <div className="are-addbar">
          {!editingId && (
            <button className="btn add" onClick={onAdd} disabled={!selectedUserId}>
              + 행 추가
            </button>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
