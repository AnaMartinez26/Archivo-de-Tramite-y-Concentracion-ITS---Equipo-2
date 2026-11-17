// Endpoints de autenticación
import { apiFetch } from './cliente.js';
import { setSesion, setUsuario } from './sesion.js';

export async function loginApi(usuario, password) {
  const json = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario: usuario.trim(), password })
  });
  if (json?.data) setSesion(json.data);
  return json;
}

export async function fetchMeApi() {
  const json = await apiFetch('/auth/me');
  if (json?.data) setUsuario(json.data);
  return json?.data;
}
