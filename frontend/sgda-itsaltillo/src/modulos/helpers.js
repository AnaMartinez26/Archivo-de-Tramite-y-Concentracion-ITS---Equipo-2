// Ayudantes para definir pantallas de cada módulo:
//  - f / campo   = campo de formulario
//  - c / columna = columna de tabla
export const f = (k, label, type = 'text', opciones = {}) => ({
  k,
  name: k,
  label,
  type,
  ...opciones
});

export const c = (k, label) => ({ k, name: k, label });

export const campo = f;
export const columna = c;

export const ESTADO = ['Activo', 'Inactivo'];
export const ROLES = [
  'Administrador',
  'Trabajador RRHH',
  'Encargada de Archivo',
  'Servicio Social',
  'Directivo'
];
export const ID = c('id', 'ID');
