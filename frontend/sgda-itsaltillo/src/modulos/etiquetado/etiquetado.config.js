import { f, c, ESTADO } from '../helpers.js';
import {
  api,
  generarEtiqueta,
  imprimirMarbete
} from './etiquetado.api.js';

export default {
  path: '/etiquetado',
  title: 'Clasificación y Etiquetado Documental',
  sub: 'Expediente y marbete',
  icon: 'Tags',
  extra: 'label',
  api,

  fields: [
    f('numero_expediente', 'Número de Expediente', 'text', {
      req: 1,
      ph: 'Ej. ITS-2026-001'
    }),
    f('titulo', 'Título / Asunto', 'text', {
      req: 1,
      ph: 'Ingresa el título del expediente'
    }),
    f('clasificacion', 'Clasificación Archivística', 'select', {
      catalog: 'clasificaciones',
      ph: 'Selecciona una clasificación'
    }),
    f('caja', 'Caja', 'select', {
      catalog: 'cajas',
      ph: 'Selecciona una caja'
    }),
    f('fecha_apertura', 'Fecha de Apertura', 'date'),
    f('estado', 'Estado', 'select', {
      options: ESTADO,
      ph: 'Seleccionar estado'
    })
  ],

  cols: [
    c('numero_expediente', 'Núm. Expediente'),
    c('titulo', 'Título'),
    c('codigo_etiqueta', 'Código Etiqueta'),
    c('clasificacion', 'Clasificación'),
    c('caja', 'Caja'),
    c('estado', 'Estado')
  ],

  btns: [
    {
      l: 'Generar Etiqueta',
      a: 'custom',
      need: 1,
      run: generarEtiqueta,
      i: 'Tag'
    },
    {
      l: 'Imprimir Marbete',
      a: 'custom',
      need: 1,
      run: imprimirMarbete,
      i: 'Printer'
    },
    { l: 'Generar QR', a: 'flag', i: 'QrCode' },
    { l: 'Generar Código de Barras', a: 'flag', i: 'Barcode' },
    {
      l: 'Guardar Expediente',
      a: 'save',
      p: 1,
      i: 'Save'
    }
  ]
};