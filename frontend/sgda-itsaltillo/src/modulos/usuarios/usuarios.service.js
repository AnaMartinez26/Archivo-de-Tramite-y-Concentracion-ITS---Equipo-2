import { apiFetch } from '../../api/cliente.js';
import { ROLES } from '../helpers.js';

export const mapUsuarioDto = u => ({
  id: u.id,
  nombre: u.nombreCompleto || `${u.nombre || ''} ${u.apellidoP || ''} ${u.apellidoM || ''}`.trim(),
  correo: u.correo,
  numero_empleado: u.numEmpleado,
  departamento: u.departamento || 'Archivo de Concentración',
  rol: u.rol,
  estado: u.estado
});

export async function cargarUsuariosYRoles() {
  const [uRes, rRes] = await Promise.all([
    apiFetch('/usuarios'),
    apiFetch('/usuarios/roles').catch(() => null)
  ]);

  const rows = Array.isArray(uRes?.data) ? uRes.data.map(mapUsuarioDto) : [];
  const rolesMap = {};
  if (Array.isArray(rRes?.data)) {
    rRes.data.forEach(r => {
      rolesMap[r.nombre] = r.id;
    });
  }
  return { rows, rolesMap };
}

export async function crearUsuario(valores, totalFilas, rolesMap = {}) {
  const partes = String(valores.nombre || '')
    .trim()
    .split(/\s+/);
  const nombre = partes[0] || '';
  const apellidoP = partes[1] || partes[0] || '—';
  const apellidoM = partes.slice(2).join(' ') || '—';
  const numEmpleado = parseInt(valores.numero_empleado, 10) || totalFilas + 1000;
  const idRol = rolesMap[valores.rol] || ROLES.indexOf(valores.rol) + 1 || 1;

  const res = await apiFetch('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      numEmpleado,
      nombre,
      apellidoP,
      apellidoM,
      correo: String(valores.correo || '').trim(),
      password: String(valores.contrasena || ''),
      idRol,
      estado: valores.estado || 'Activo'
    })
  });

  const fila = res?.data
    ? {
        ...mapUsuarioDto(res.data),
        departamento: valores.departamento || 'Archivo de Concentración'
      }
    : null;

  return { fila, message: res?.message || 'Usuario registrado correctamente' };
}
