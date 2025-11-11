// src/utils/auth.js
// auth 상태를 로컬스토리지 한 곳(auth:v1)에만 저장/조회하도록 일원화

const KEY = "auth:v1";

/** JWT payload 디코더(브라우저 atob 사용) */
function decodeJwt(token) {
  try {
    const b64 = token.split(".")[1];
    if (!b64) return null;
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** JWT 또는 문자열에서 role/approved 정보를 추출해 표준화 */
function normalizeFromRoleString(rawRole, approvedHint) {
  let r = (rawRole ?? "").toString().trim().toUpperCase();
  // 예: ROLE_ADMIN, ROLE_ADMIN_APPROVED, ROLE_ADMIN_PENDING, ADMIN, SUPER, ROLE_SUPER_ADMIN
  if (r.startsWith("ROLE_")) r = r.slice(5); // ROLE_ADMIN_* -> ADMIN_*
  if (r === "SUPER") r = "SUPER_ADMIN";

  // 승인 상태를 suffix 로 전달하는 케이스 보정
  let approved = approvedHint;
  if (r.includes("ADMIN")) {
    if (r.includes("APPROVED")) approved = true;
    else if (r.includes("PENDING")) approved = false;
  }

  // 최종 role 표준화
  if (r.includes("SUPER_ADMIN")) r = "SUPER_ADMIN";
  else if (r.includes("ADMIN")) r = "ADMIN";
  else r = "PATIENT";

  // SUPER_ADMIN 은 항상 승인 true
  if (r === "SUPER_ADMIN") approved = true;

  return { role: r, approved };
}

/** token 에서 role/approved 추출(문자열 힌트보다 우선) */
function normalizeFromToken(token, approvedHint) {
  const p = decodeJwt(token);
  if (!p) return { role: undefined, approved: approvedHint };
  const rawRole =
    p.role || p.authority || p.authorities || p.scope || p.scopes || "";
  // authorities 가 배열일 수 있음
  const roleStr = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  return normalizeFromRoleString(roleStr, approvedHint);
}

/** 역할 문자열 최종 표준화 (문자열만 있을 때) */
function normalizeRole(role) {
  return normalizeFromRoleString(role, undefined).role;
}

/** 레거시 키(token/userRole/userEmail/adminApproved)를 auth:v1로 1회 마이그레이션 */
export function migrateLegacyAuth() {
  try {
    const token = localStorage.getItem("token");
    const rawRole = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    const adminApprovedRaw = localStorage.getItem("adminApproved");
    const approvedLegacy =
      adminApprovedRaw === null ? undefined : adminApprovedRaw === "true";

    const hasLegacy = token || rawRole || email || adminApprovedRaw !== null;
    const hasV1 = !!localStorage.getItem(KEY);

    if (hasLegacy && !hasV1) {
      // 우선 token 기준으로 정규화(가장 신뢰할 수 있음)
      let { role, approved } = normalizeFromToken(token, approvedLegacy);
      if (!role) {
        ({ role, approved } = normalizeFromRoleString(rawRole, approvedLegacy));
      }

      const v1 = {
        token: token || "",
        email: email || "",
        role: role || "PATIENT",
        approved:
          role === "SUPER_ADMIN"
            ? true
            : role === "ADMIN"
            ? !!approved
            : true,
      };
      localStorage.setItem(KEY, JSON.stringify(v1));
    }
  } catch {}
}

/** auth 읽기: 저장된 값 + token 으로 1차 교정 */
export function getAuth() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw)
      return { token: "", email: "", role: "PATIENT", approved: true };

    const data = JSON.parse(raw) || {};
    let role = normalizeRole(data.role);
    let approved =
      role === "SUPER_ADMIN"
        ? true
        : role === "ADMIN"
        ? !!data.approved
        : true;

    // token 에 더 신뢰할 수 있는 정보가 있으면 덮어씀
    if (data.token) {
      const fromToken = normalizeFromToken(data.token, approved);
      if (fromToken.role) {
        role = fromToken.role;
        approved =
          role === "SUPER_ADMIN"
            ? true
            : role === "ADMIN"
            ? fromToken.approved ?? approved
            : true;
      }
    }

    return {
      token: data.token || "",
      email: data.email || "",
      role,
      approved,
    };
  } catch {
    return { token: "", email: "", role: "PATIENT", approved: true };
  }
}

/** 저장: token/role/approved 입력 시 모두 표준화 */
export function saveAuth(next) {
  const cur = getAuth();
  const merged = { ...cur, ...next };

  // 1) token 기준으로 먼저 정규화 시도
  let role = merged.role;
  let approved = "approved" in next ? !!merged.approved : cur.approved;

  if (merged.token) {
    const t = normalizeFromToken(merged.token, approved);
    if (t.role) {
      role = t.role;
      approved = t.approved ?? approved;
    }
  }

  // 2) token에서 못 찾았으면 문자열 role 힌트로 보정
  if (!role && merged.role) {
    const r = normalizeFromRoleString(merged.role, approved);
    role = r.role;
    approved = r.approved ?? approved;
  }

  // 3) 최종 기본값
  role = normalizeRole(role);
  if (role === "SUPER_ADMIN") approved = true;
  else if (role === "ADMIN") approved = !!approved;
  else approved = true;

  const final = {
    token: merged.token || "",
    email: merged.email || "",
    role,
    approved,
  };

  localStorage.setItem(KEY, JSON.stringify(final));
  // 표준화된 형태로 반환
  return getAuth();
}

export function clearAuth() {
  localStorage.removeItem(KEY);
  // 레거시 키도 함께 정리(혼선 방지)
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("adminApproved");
}

export function getToken() {
  return getAuth().token;
}

export function setRole(role) {
  const { role: r } = normalizeFromRoleString(role, undefined);
  saveAuth({
    role: r,
    approved: r === "SUPER_ADMIN" ? true : r === "ADMIN" ? false : true,
  });
}

export function setApproved(flag) {
  const a = getAuth();
  if (a.role === "SUPER_ADMIN") return saveAuth({ approved: true });
  return saveAuth({ approved: !!flag });
}

/** 파생 헬퍼 */
export function isLoggedIn() {
  return !!getAuth().token;
}
export function isAdmin() {
  return getAuth().role === "ADMIN";
}
export function isSuperAdmin() {
  return getAuth().role === "SUPER_ADMIN";
}
export function isAdminApproved() {
  const a = getAuth();
  if (a.role === "SUPER_ADMIN") return true;
  return a.role === "ADMIN" && !!a.approved;
}
export function isAdminPending() {
  const a = getAuth();
  return a.role === "ADMIN" && !a.approved;
}
