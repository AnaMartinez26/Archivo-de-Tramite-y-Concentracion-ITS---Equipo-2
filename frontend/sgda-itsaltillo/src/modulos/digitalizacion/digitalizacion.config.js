import { f, c } from '../helpers.js';

// Pantalla: Digitalización y Resguardo
export default {
  path: '/digitalizacion',
  title: 'Digitalización y Resguardo',
  sub: 'Documentos y réplicas digitales',
  icon: 'ScanLine',
  extra: 'upload',
  select: 1,
  fields: [
    f('folio', 'Folio', 'text', { req: 1, ph: 'Ingresa el folio' }),
    f('titulo', 'Título del Documento', 'text', { req: 1, ph: 'Ingresa el título' }),
    f('tipo_documento', 'Tipo de Documento', 'text', { ph: 'Ingresa el tipo de documento' }),
    f('numero_expediente', 'Número de Expediente', 'text', {
      ph: 'Opcional: expediente al que pertenece'
    }),
    f('fecha_creacion', 'Fecha de Creación', 'date')
  ],
  search: 'Buscar por folio, título, tipo o expediente...',
  cols: [
    c('folio', 'Folio'),
    c('titulo', 'Título'),
    c('tipo_documento', 'Tipo'),
    c('numero_expediente', 'Expediente'),
    c('ruta_archivo', 'Ruta del Archivo'),
    c('formato', 'Formato'),
    c('fecha_digitalizacion', 'Fecha de Digitalización')
  ],
  acts: [
    'Editar',
    fila => (fila.ruta_archivo && fila.ruta_archivo !== '—' ? 'Descargar PDF' : null),
    'Eliminar'
  ],
  btns: [
    { l: 'Registrar Documento', a: 'save', i: 'Plus' },
    { l: 'Guardar Cambios', a: 'update', i: 'Save' },
    { l: 'Subir Archivo Adjunto', a: 'pick', p: 1, i: 'Upload' },
    { l: 'Eliminar Seleccionados', a: 'del', d: 1, i: 'Trash2' },
    { l: 'Sincronizar Resguardo Digital', c: 1, i: 'RefreshCw' },
    { l: 'Limpiar Lote', a: 'clear', i: 'Eraser' }
  ]
};
