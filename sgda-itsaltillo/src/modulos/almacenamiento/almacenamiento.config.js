import {f,c,ESTADO} from '../../core/helpers.js';

// Pantalla: Almacenamiento Sistematizado
export default {path:'/almacenamiento',title:'Almacenamiento Sistematizado',sub:'Ubicación Física',icon:'Warehouse',extra:'map',select:1,
 fields:[f('numero_caja','Caja Número','text',{req:1,ph:'Ingresa el número de caja'}),f('codigo_etiqueta','Código de Etiqueta','text',{ph:'Ingresa el código de etiqueta'}),f('ubicacion','Ubicación (pasillo, estante, batería)','text',{req:1,ph:'Ej. Pasillo 1, Estante 2, Batería 3'}),f('capacidad','Capacidad','number',{ph:'Capacidad de la caja'}),f('estado','Estado','select',{options:ESTADO,ph:'Seleccionar estado'})],
 cols:[c('numero_caja','Caja Número'),c('codigo_etiqueta','Código Etiqueta'),c('ubicacion','Ubicación Física'),c('capacidad','Capacidad'),c('estado','Estado')],
 btns:[{l:'Asignar Ubicación Física',a:'save',p:1,i:'MapPin'},{l:'Mover de Ubicación',i:'Move'},{l:'Imprimir Guía de Pasillo',i:'Printer'}]};
