import { f, c } from '../helpers.js';
import {
  api,
  generarActaBaja,
  autorizarTransferencia,
  descargarInventario
} from './disposicion.api.js';

export default {
  path: '/disposicion',
  title: 'Disposición Documental',
  sub: 'Baja o Transferencia',
  icon: 'Archive',
  select: 1,
  api,

  fields: [
    f('id_expediente', 'Expediente', 'select', {
      req: 1,
      catalog: 'expedientes',
      ph: 'Selecciona un expediente registrado'
    }),
    f('tipo_disposicion', 'Tipo de Disposición', 'select', {
      req: 1,
      options: [
        'Baja Documental',
        'Transferencia Secundaria',
        'Transferencia Histórica'
      ],
      ph: 'Seleccionar tipo'
    }),
    f('fecha_disposicion', 'Fecha de Disposición', 'date'),
    f('destino', 'Destino Final', 'select', {
      options: [
        'Destrucción',
        'Conservación Permanente'
      ],
      ph: 'Seleccionar destino'
    }),
    f('observaciones', 'Observaciones', 'textarea', {
      ph: 'Escribe observaciones'
    })
  ],

  cols: [
    c('numero_expediente', 'Núm. Expediente'),
    c('titulo', 'Asunto'),
    c('fecha_disposicion', 'Fecha de Disposición'),
    c('tipo_disposicion', 'Tipo'),
    c('destino', 'Destino Final'),
    c('estado', 'Estado'),
    c('numero_acta', 'Núm. Acta')
  ],

  btns: [
    { l: 'Registrar Disposición', a: 'save', i: 'Plus' },
    {
      l: 'Generar Acta de Baja Documental',
      a: 'custom',
      need: 1,
      c: 1,
      p: 1,
      run: generarActaBaja,
      i: 'FileText'
    },
    {
      l: 'Autorizar Transferencia',
      a: 'custom',
      need: 1,
      c: 1,
      run: autorizarTransferencia,
      i: 'CheckCircle2'
    },
    {
      l: 'Descargar Inventario de Disposición',
      a: 'custom',
      run: descargarInventario,
      i: 'Download'
    }
  ]
};