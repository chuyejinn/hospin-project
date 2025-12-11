// src/auth/session.js
function safeJsonParse(s) { try { return JSON.parse(s); } catch { return null; } }

// 아주 가벼운 JWT 디코더 (브라우저 atob 사용)
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join("")
    );
    return JSON.parse(json);
  } catch { return null; }
}

function pickRole(obj) {
  // 우선순위: role → authorities(string[]) → authorities([{authority}])
  if (obj?.role) return obj.role;
  if (Array.isArray(obj?.authorities) && obj.authorities.length) {
    const first = obj.authorities[0];
    if (typeof first === "string") return first;
    if (typeof first === "object" && first?.authority) return first.authority;
  }
  return "USER";
}

function normalizeId(idLike) {
  // 정책에 맞춰 문자열로 통일 (숫자로 통일하고 싶으면 Number(...)로 바꿔도 됨)
  if (idLike == null) return null;
  return String(idLike);
}

/**
 * 현재 로그인 사용자 정보 표준화:
 * { id, role, name, token }
 */
export function getCurrentUser() {
  const raw =
    localStorage.getItem("auth:v1") ||
    localStorage.getItem("auth") ||
    localStorage.getItem("user") ||
    localStorage.getItem("loginUser");

  if (raw) {
    const obj = safeJsonParse(raw) || {};

    // 1) { token, user: {...} }
    if (obj.user) {
      const u = obj.user;
      const token = obj.token ?? u.token ?? null;

      // JWT 만료 검사(있으면)
      if (token) {
        const p = decodeJwt(token);
        if (p?.exp && Date.now() >= p.exp * 1000) {
          // 만료 → 로그아웃 or 토큰 제거 (여기선 null 처리)
          return null;
        }
      }

      return {
        id: normalizeId(u.id ?? u.userId ?? u.uid ?? null),
        role: pickRole(u),
        name: u.name ?? u.username ?? "",
        token,
      };
    }

    // 2) { id, role, name, token }
    if (obj.id || obj.userId || obj.uid || obj.token) {
      // JWT 만료 검사
      if (obj.token) {
        const p = decodeJwt(obj.token);
        if (p?.exp && Date.now() >= p.exp * 1000) return null;
      }
      return {
        id: normalizeId(obj.id ?? obj.userId ?? obj.uid ?? null),
        role: pickRole(obj),
        name: obj.name ?? obj.username ?? "",
        token: obj.token ?? null,
      };
    }

    // 3) token만 있을 때 → JWT payload에서 추출
    if (obj.token) {
      const p = decodeJwt(obj.token) || {};
      if (p?.exp && Date.now() >= p.exp * 1000) return null;
      return {
        id: normalizeId(p.id ?? p.userId ?? p.sub ?? null),
        role: pickRole(p),
        name: p.name ?? p.username ?? "",
        token: obj.token,
      };
    }
  }

  // 레거시: userId 단독 저장
  const legacyId = localStorage.getItem("userId");
  if (legacyId) return { id: normalizeId(legacyId), role: "USER", name: "", token: null };

  return null;
}

export function setCurrentUser(userLike) {
  localStorage.setItem("auth:v1", JSON.stringify(userLike || {}));
}

export function isAdmin() {
  const me = getCurrentUser();
  // ROLE_ 접두어를 사용하는 경우도 흔함
  return me?.role === "ADMIN" || me?.role === "ROLE_ADMIN";
}

// ▶ 편의: 인터셉터/가드에서 토큰만 필요할 때
export function getAuthToken() {
  const me = getCurrentUser();
  return me?.token ?? null;
}

// ▶ 편의: 로그아웃
export function logout() {
  localStorage.removeItem("auth:v1");
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  localStorage.removeItem("loginUser");
  // (선택) accessToken 등 별도 키도 함께 정리
  localStorage.removeItem("accessToken");
  // (선택) 페이지 이동은 호출부에서 처리
}

// ✅ 아래 두 함수만 추가 (logout() 바로 아래)

/** 통일된 사용자 ID 조회: me.id 없으면 레거시 localStorage.userId도 허용 */
export function getUserId() {
  const me = getCurrentUser();
  return me?.id ?? localStorage.getItem("userId") ?? null;
}

/** 로그인 여부 편의 함수 */
export function isLoggedIn() {
  return !!getUserId();
}
