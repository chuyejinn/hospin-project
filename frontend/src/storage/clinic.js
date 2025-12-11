// 단일 소스: 로컬스토리지 'clinicRecords' 배열
// 모든 진료 기록은 ownerId(=사용자 ID)를 반드시 포함
const KEY = "clinicRecords";

export function loadAllClinic() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveAllClinic(list) {
  localStorage.setItem(KEY, JSON.stringify(list || []));
}

export function listClinicByOwner(ownerId) {
  const all = loadAllClinic();
  return all.filter(r => String(r.ownerId) === String(ownerId));
}

export function upsertClinic(record) {
  const all = loadAllClinic();
  const idx = all.findIndex(r => r.id === record.id);
  if (idx >= 0) all[idx] = record;
  else all.push(record);
  saveAllClinic(all);
  return record;
}

export function removeClinic(id) {
  const all = loadAllClinic().filter(r => r.id !== id);
  saveAllClinic(all);
}

export function removeClinicByOwner(ownerId) {
  const all = loadAllClinic().filter(r => String(r.ownerId) !== String(ownerId));
  saveAllClinic(all);
}
