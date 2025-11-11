import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";
import { fetchReservationDetail, fetchPatientHistory } from "../api/reservations";
import "../styles/ReservationPatientDetail.css";

export default function ReservationPatientDetail() {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const d = await fetchReservationDetail(reservationId);
        setDetail(d);
        if (d?.patient?.id !== undefined) {
          const h = await fetchPatientHistory(d.patient.id);
          setHistory(Array.isArray(h) ? h : []);
        }
      } catch {
        setErr("예약 상세 정보를 불러오지 못했습니다.");
      }
    })();
  }, [reservationId]);

  if (err) {
    return <AdminRoute type="approved"><div className="rp-wrap"><div className="rp-error">{err}</div></div></AdminRoute>;
  }
  if (!detail) {
    return <AdminRoute type="approved"><div className="rp-wrap"><div className="rp-empty">불러오는 중...</div></div></AdminRoute>;
  }

  const p = detail.patient || {};

  return (
    <AdminRoute type="approved">
      <div className="rp-wrap">
        <div className="rp-head">
          <div className="rp-title">예약 환자 정보</div>
          <button className="rp-back" onClick={() => navigate(-1)}>뒤로</button>
        </div>

        <div className="rp-grid">
          <div className="rp-card">
            <div className="rp-photo">{p.profileUrl ? <img src={p.profileUrl} alt="profile"/> : <div className="rp-photo-empty">사진</div>}</div>
            <div className="rp-info">
              <div className="rp-name">{p.name || "-"}</div>
              <div className="rp-row">주민번호: {p.ssn || "-"}</div>
              <div className="rp-row">전화번호: {p.phone || "-"}</div>
              <div className="rp-row">성별: {p.gender || "-"}</div>
              <div className="rp-row">이메일: {p.email || "-"}</div>
            </div>
          </div>

          <div className="rp-panel">
            <div className="rp-panel-title">이번 예약 내역</div>
            <div className="rp-kv">진료과: <b>{detail.department || "-"}</b></div>
            <div className="rp-kv">예약 일자: <b>{detail.date}</b></div>
            <div className="rp-kv">예약 시간: <b>{detail.time}</b></div>
            {detail.memo && <div className="rp-kv">증상/메모: <span>{detail.memo}</span></div>}
          </div>
        </div>

        <div className="rp-history">
          <div className="rp-history-head">이전 예약 내역</div>
          {history.length === 0 ? (
            <div className="rp-empty">없음</div>
          ) : (
            <div className="rp-table">
              <div className="rp-thead">
                <div className="c w80">구분</div>
                <div className="c w200">진료 내용</div>
                <div className="c w160">진료 날짜</div>
                <div className="c w200">의료진명</div>
              </div>
              {history.map((h, i) => (
                <div className="rp-row" key={h.id || i}>
                  <div className="c w80">{i+1}</div>
                  <div className="c w200">{h.summary || h.department || "-"}</div>
                  <div className="c w160">{h.date} {h.time || ""}</div>
                  <div className="c w200">{h.hospital || h.doctor || "-"}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
