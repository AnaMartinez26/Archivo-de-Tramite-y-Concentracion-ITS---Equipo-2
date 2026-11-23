import { f, c } from '../helpers.js';
import {
  api,
  moverUbicacion,
  imprimirGuia
} from './almacenamiento.api.js';

export default {
  path: '/almacenamiento',
  title: 'Almacenamiento Sistematizado',
  sub: 'Ubicación Física',
  icon: 'Warehouse',
  extra: 'map',
  select: 1,
  api,

  fields: [
    f('numero_caja', 'Caja Número', 'number', {
      req: 1,
      ph: 'Ingresa el número de caja'
    }),
    f('codigo_etiqueta', 'Código de Etiqueta', 'text', {
      req: 1,
      ph: 'Ingresa el código de etiqueta'
    }),
    f('ubicacion', 'Ubicación (pasillo, estante, batería)', 'text', {
      req: 1,
      ph: 'Ej. Pasillo 1, Estante 2, Batería 3'
    }),
f('capacidad', 'Capacidad (0 = sin límite)', 'number', {
  ph: 'Capacidad de la caja',
  min: 0,
  step: 1
}),
    f('estado', 'Estado', 'select', {
      options: ['Activo', 'Inactivo'],
      ph: 'Seleccionar estado'
    })
  ],

  cols: [
    c('numero_caja', 'Caja Número'),
    c('codigo_etiqueta', 'Código Etiqueta'),
    c('ubicacion', 'Ubicación Física'),
    c('capacidad', 'Capacidad'),
    c('ocupacion', 'Expedientes'),
    c('estado', 'Estado')
  ],

  btns: [
    {
      l: 'Asignar Ubicación Física',
      a: 'save',
      p: 1,
      i: 'MapPin'
    },
    {
      l: 'Mover de Ubicación',
      a: 'custom',
      c: 1,
      need: 1,
      run: moverUbicacion,
      i: 'Move'
    },
    {
      l: 'Imprimir Guía de Pasillo',
      a: 'custom',
      run: imprimirGuia,
      i: 'Printer'
    }
  ]
};