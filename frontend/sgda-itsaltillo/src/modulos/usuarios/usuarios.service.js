import { apiFetch } from '../../api/cliente.js';
import { downloadCsv } from '../../utils.js';

export const mapUsuarioDto = u => ({
  id: u.id,
  nombre: u.nombreCompleto || `${u.nombre || ''} ${u.apellidoP || ''} ${u.apellidoM || ''}`.trim(),
  nombre_pila: u.nombre || '',
  apellido_p: u.apellidoP || '',
  apellido_m: u.apellidoM || '',
  correo: u.correo,
  numero_empleado: u.numEmpleado,
  departamento: u.departamento || 'Archivo de Concentración',
  departamento_raw: u.departamento || '',
  puesto: u.puesto || '',
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

export async function actualizarUsuario(id, valores, rolesMap = {}) {
  const numEmpleado = Number(String(valores.numero_empleado || '').trim());
  if (!Number.isInteger(numEmpleado) || numEmpleado <= 0) {
    throw new Error('Ingresa un número de empleado entero mayor a 0.');
  }

  const idRol = rolesMap[valores.rol];
  if (!idRol) {
    throw new Error('No se pudo resolver el rol seleccionado. Recarga la página e intenta de nuevo.');
  }

  const passwordNueva = String(valores.contrasena || '');
  if (passwordNueva && passwordNueva.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
  }

  const res = await apiFetch(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      numEmpleado,
      nombre: String(valores.nombre || '').trim(),
      apellidoP: String(valores.apellido_p || '').trim(),
      apellidoM: String(valores.apellido_m || '').trim(),
      correo: String(valores.correo || '').trim(),
      password: passwordNueva || null,
      idRol,
      estado: valores.estado || 'Activo',
      departamento: String(valores.departamento || '').trim() || null,
      puesto: String(valores.puesto || '').trim() || null
    })
  });

  return {
    dto: res?.data || null,
    fila: res?.data ? mapUsuarioDto(res.data) : null,
    message: res?.message || 'Usuario actualizado correctamente.'
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

export async function restablecerPasswordUsuario(id, nuevaPassword) {
  const pwd = String(nuevaPassword || '');
  if (pwd.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
  }

  const res = await apiFetch(`/usuarios/${id}/password`, {
    method: 'PATCH',
    body: JSON.stringify({ nuevaPassword: pwd })
  });

  return {
    message: res?.message || 'Contraseña restablecida correctamente.'
  };
}

export async function eliminarUsuario(id) {
  const res = await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
  return {
    message: res?.message || 'Usuario eliminado correctamente.'
  };
}

export function exportarUsuariosCsv({ rows, toast }) {
  if (!rows.length) {
    return toast('No hay usuarios registrados para exportar.', 'err');
  }

  downloadCsv(
    `usuarios-sgda-${new Date().toISOString().slice(0, 10)}.csv`,
    [
      'ID',
      'Nombre Completo',
      'Correo Institucional',
      'Núm. Empleado',
      'Área/Departamento',
      'Puesto',
      'Rol Asignado',
      'Estado'
    ],
    rows.map(r => [
      r.id,
      r.nombre,
      r.correo,
      r.numero_empleado,
      r.departamento,
      r.puesto || '—',
      r.rol,
      r.estado
    ])
  );

  toast(`Lista exportada (${rows.length} usuario(s))`, 'info');
}
