import { c, ESTADO, f, ID, ROLES } from '../helpers.js';
import { exportarUsuariosCsv } from './usuarios.service.js';

// Pantalla: Gestión de Usuarios
export default {
  path: '/usuarios',
  title: 'Gestión de Usuarios',
  sub: 'Usuarios, roles y trabajadores',
  icon: 'Users',
  modal: 'Registrar Nuevo Usuario',
  search: 'Buscar por nombre, correo o número de empleado...',
  filters: [
    f('rol', 'Rol', 'select', { options: ROLES, ph: 'Todos los roles' }),
    f('estado', 'Estado', 'select', { options: ESTADO, ph: 'Todos los estados' })
  ],
  fields: [
    f('nombre', 'Nombre(s)', 'text', { req: 1, ph: 'Ej. Ana Paola' }),
    f('apellido_p', 'Apellido Paterno', 'text', { req: 1, ph: 'Ej. Martínez' }),
    f('apellido_m', 'Apellido Materno', 'text', { req: 1, ph: 'Ej. Hernández' }),
    f('correo', 'Correo Institucional', 'email', { req: 1, ph: 'correo@saltillo.tecnm.mx' }),
    f('contrasena', 'Contraseña', 'password', { req: 1, ph: 'Mínimo 8 caracteres' }),
    f('rol', 'Rol Asignado', 'select', { req: 1, options: ROLES, ph: 'Seleccionar rol' }),
    f('estado', 'Estado', 'select', { options: ESTADO, ph: 'Seleccionar estado' }),
    f('numero_empleado', 'Número de Empleado', 'number', { req: 1, ph: 'Ej. 1001' }),
    f('departamento', 'Área/Departamento', 'text', { ph: 'Ingresa el área o departamento' }),
    f('puesto', 'Puesto', 'text', { ph: 'Ingresa el puesto' })
  ],
  cols: [
    ID,
    c('nombre', 'Nombre Completo'),
    c('correo', 'Correo Institucional'),
    c('numero_empleado', 'Núm. Empleado'),
    c('departamento', 'Área/Departamento'),
    c('rol', 'Rol Asignado'),
    c('estado', 'Estado')
  ],
  acts: [
    'Editar',
    fila => (fila.estado === 'Activo' ? 'Desactivar' : 'Activar'),
    'Restablecer contraseña',
    'Eliminar'
  ],
  btns: [
    { l: 'Registrar Nuevo Usuario', a: 'open', p: 1, i: 'Plus' },
    { l: 'Exportar Lista', a: 'custom', run: exportarUsuariosCsv, i: 'Download' },
    { l: 'Guardar Cambios', a: 'saveUserBtn', i: 'Save' },
    { l: 'Cancelar', a: 'cancel', i: 'X' }
  ]
};
