// Cliente de autenticación y comunicación con el Backend (ASP.NET Core API)
export const API_URL =
  (typeof localStorage !== 'undefined' && localStorage.getItem('satc_api_url')) ||
  'http://localhost:5037/api';

const TOKEN_KEY = 'satc_token';
const USER_KEY = 'satc_usuario';
const EXP_KEY = 'satc_expira';

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const exp = localStorage.getItem(EXP_KEY);
    if (exp && new Date(exp) <= new Date()) {
      clearSesion();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function getUsuario() {
  try {
    if (!getToken()) return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSesion({ token, expira, usuario }) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (expira) localStorage.setItem(EXP_KEY, expira);
    if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  } catch {
    // Ignorar errores de almacenamiento local
  }
}

export function clearSesion() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXP_KEY);
  } catch {
    // Ignorar errores de almacenamiento local
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor (${API_URL}). Verifica que el Backend esté en ejecución.`
    );
  }

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (res.status === 401 && path !== '/auth/login') {
    clearSesion();
    location.hash = '/login';
  }

  if (!res.ok || (json && json.success === false)) {
    const valMsg =
      json?.errors &&
      Object.values(json.errors)
        .flat()
        .join(' ');
    const msg = json?.message || valMsg || `Error del servidor (${res.status}).`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }

  return json;
}

export async function loginApi(usuario, password) {
  const json = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      usuario: usuario.trim(),
      password
    })
  });
  if (json?.data) {
    setSesion(json.data);
  }
  return json;
}

export async function fetchMeApi() {
  const json = await apiFetch('/auth/me');
  if (json?.data) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(json.data));
    } catch {}
  }
  return json?.data;
}

