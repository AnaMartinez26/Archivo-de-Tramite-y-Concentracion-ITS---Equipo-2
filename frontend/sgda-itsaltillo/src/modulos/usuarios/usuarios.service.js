import { apiFetch } from '../../api/cliente.js';

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

export async function crearUsuario(valores, rolesMap = {}) {
  const numEmpleado = Number(String(valores.numero_empleado || '').trim());
  if (!Number.isInteger(numEmpleado) || numEmpleado <= 0) {
    throw new Error('Ingresa un número de empleado entero mayor a 0.');
  }

  const idRol = rolesMap[valores.rol];
  if (!idRol) {
    throw new Error('No se pudo resolver el rol seleccionado. Recarga la página e intenta de nuevo.');
  }

  const res = await apiFetch('/usuarios', {
    method: 'POST',
    body: JSON.stringify({
      numEmpleado,
      nombre: String(valores.nombre || '').trim(),
      apellidoP: String(valores.apellido_p || '').trim(),
      apellidoM: String(valores.apellido_m || '').trim(),
      correo: String(valores.correo || '').trim(),
      password: String(valores.contrasena || ''),
      idRol,
      estado: valores.estado || 'Activo',
      departamento: String(valores.departamento || '').trim() || null,
      puesto: String(valores.puesto || '').trim() || null
    })
  });

  return {
    fila: res?.data ? mapUsuarioDto(res.data) : null,
    message: res?.message || 'Usuario registrado correctamente'
  };
}

export async function cambiarEstadoUsuario(id, estado) {
  const res = await apiFetch(`/usuarios/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estado })
  });

  return {
    fila: res?.data ? mapUsuarioDto(res.data) : null,
    message:
      res?.message ||
      (estado === 'Activo'
        ? 'Usuario activado correctamente.'
        : 'Usuario desactivado correctamente.')
  };
}
