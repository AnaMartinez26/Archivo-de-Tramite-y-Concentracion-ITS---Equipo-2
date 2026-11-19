import { f, c, ID } from '../helpers.js';

export const ESTADOS_TRAMITE = ['Pendiente', 'En Revisión por Archivo', 'Aprobado', 'Rechazado'];

// Pantalla: Control de Flujo de Información
export default {
  path: '/workflow',
  title: 'Control de Flujo de Información',
  sub: 'Workflow de Aprobación',
  icon: 'GitBranch',
  extra: 'timeline',
  select: 1,
  search: 'Buscar por folio, expediente, solicitante o solicitud...',
  filters: [
    f('estado', 'Estatus', 'select', { options: ESTADOS_TRAMITE, ph: 'Todos los estatus' })
  ],
  fields: [
    f('folio_pase_salida', 'Folio del Trámite', 'text', { req: 1, ph: 'Ingresa el folio' }),
    f('numero_expediente', 'Número de Expediente', 'text', {
      req: 1,
      ph: 'Ingresa el número de expediente'
    }),
    f('numero_empleado', 'Núm. de Empleado del Solicitante', 'text', {
      req: 1,
      ph: 'Ingresa el número de empleado'
    }),
    f('tipo_movimiento', 'Solicitud', 'text', { ph: 'Describe la solicitud' }),
    // Al registrar solo se permite iniciar como Pendiente o En Revisión
    f('estado', 'Estado Inicial del Trámite', 'select', {
      options: ['Pendiente', 'En Revisión por Archivo'],
      ph: 'Pendiente (por defecto)'
    }),
    f('motivo', 'Notas de Observación/Correcciones', 'textarea', {
      ph: 'Obligatorio para rechazar un trámite'
    }),
    f('firma', 'Firma Electrónica / Token de Autorización', 'password', {
      ph: 'Obligatorio para aprobar un trámite'
    })
  ],
  cols: [
    ID,
    c('folio_pase_salida', 'Folio'),
    c('numero_expediente', 'Expediente'),
    c('numero_empleado', 'Solicitante'),
    c('tipo_movimiento', 'Solicitud'),
    c('motivo', 'Observaciones'),
    c('revisor', 'Revisó'),
    c('ingreso', 'Fecha de Ingreso'),
    c('estado', 'Estatus')
  ],
  btns: [
    { l: 'Registrar Trámite', a: 'save', i: 'Plus' },
    { l: 'Aprobar Trámite', a: 'status', s: 'Aprobado', p: 1, i: 'Check', c: 1 },
    { l: 'Rechazar con Observaciones', a: 'status', s: 'Rechazado', d: 1, i: 'X', c: 1 },
    { l: 'Reenviar a Revisión', a: 'status', s: 'En Revisión por Archivo', i: 'Send' },
    { l: 'Actualizar Lista', a: 'reload', i: 'RefreshCw' }
  ]
};
