// Cliente HTTP para comunicarse con el Backend (ASP.NET Core API)
import { getToken, clearSesion } from './sesion.js';

export const API_URL =
  (typeof localStorage !== 'undefined' && localStorage.getItem('satc_api_url')) ||
  'http://localhost:5037/api';

// Hace la petición agregando el token. Si el servidor responde 401, cierra la sesión.
async function enviar(path, options = {}) {
  const token = getToken();
  const esFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(options.body && !esFormData ? { 'Content-Type': 'application/json' } : {}),
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

  if (res.status === 401 && path !== '/auth/login') {
    clearSesion();
    location.hash = '/login';
  }
  return res;
}

function crearError(mensaje, status) {
  const err = new Error(mensaje);
  err.status = status;
  return err;
}

// Peticiones JSON. Devuelve { success, message, data } o lanza un Error con el mensaje del servidor.
export async function apiFetch(path, options = {}) {
  const res = await enviar(path, options);

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (!res.ok || (json && json.success === false)) {
    const errorsValidacion = json?.errors && Object.values(json.errors).flat().join(' ');
    throw crearError(
      json?.message || errorsValidacion || `Error del servidor (${res.status}).`,
      res.status
    );
  }
  return json;
}

// Descarga de archivos (por ejemplo PDF). Devuelve un Blob.
export async function apiBlob(path) {
  const res = await enviar(path);
  if (!res.ok) throw crearError(`Error del servidor (${res.status}).`, res.status);
  return res.blob();
}
