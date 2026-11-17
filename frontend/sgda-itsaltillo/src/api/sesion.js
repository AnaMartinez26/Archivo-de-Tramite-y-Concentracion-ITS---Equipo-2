// Sesión del usuario guardada en localStorage (token JWT, expiración y datos del usuario)

const TOKEN_KEY = 'satc_token';
const USER_KEY = 'satc_usuario';
const EXP_KEY = 'satc_expira';

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const expira = localStorage.getItem(EXP_KEY);
    if (expira && new Date(expira) <= new Date()) {
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

export function setUsuario(usuario) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
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
