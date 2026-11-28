import { f, c } from '../helpers.js';

// Pantalla: Aseguramiento y Cumplimiento Normativo
export default {
  path: '/auditoria',
  title: 'Aseguramiento y Cumplimiento Normativo',
  sub: 'Bitácora de auditoría e integridad',
  icon: 'ShieldCheck',
  extra: 'integrity',
  search: 'Buscar por usuario, módulo o descripción',
  filters: [
    f('accion', 'Acción Realizada', 'select', {
      options: ['Inicio de Sesión', 'Creación', 'Modificación', 'Eliminación', 'Descarga', 'Verificación', 'Auditoría Manual'],
      ph: 'Todas las acciones'
    })
  ],
  fields: [
    f('periodo', 'Período de Auditoría', 'text', { ph: 'Ej. Noviembre 2026 o 01/11/2026 - 30/11/2026' }),
    f('descripcion', 'Comentarios de Auditoría', 'textarea', { req: 1, ph: 'Escribe observaciones o hallazgos de auditoría' })
  ],
  cols: [
    c('fecha_hora', 'Fecha/Hora'),
    c('usuario', 'Usuario'),
    c('accion', 'Acción Realizada'),
    c('tabla_afectada', 'Módulo'),
    c('descripcion', 'Descripción'),
    c('ip', 'IP')
  ],
  btns: [
    { l: 'Registrar Observación', a: 'save', i: 'Plus' },
    { l: 'Exportar Reporte de Auditoría', a: 'exportar_auditoria', p: 1, i: 'FileDown' },
    { l: 'Ejecutar Verificación de Integridad', a: 'verificar_integridad', c: 1, i: 'ShieldCheck' }
  ]
};
