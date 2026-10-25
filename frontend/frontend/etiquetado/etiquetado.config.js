import {f,c,ESTADO} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Clasificación y Etiquetado Documental
export default {path:'/etiquetado',title:'Clasificación y Etiquetado Documental',sub:'Expediente y marbete',icon:'Tags',extra:'label',
 fields:[f('numero_expediente','Número de Expediente','text',{req:1,ph:'Ingresa el número de expediente'}),f('titulo','Título/Asunto','text',{req:1,ph:'Ingresa el título'}),f('codigo_etiqueta','Código de Etiqueta','text',{req:1,ph:'Ingresa el código de etiqueta'}),f('clasificacion','Clasificación Archivística','text',{ph:'Ingresa la clasificación'}),f('caja','Número de Caja','text',{ph:'Ingresa el número de caja'}),f('fecha_apertura','Fecha de Apertura','date'),f('estado','Estado','select',{options:ESTADO,ph:'Seleccionar estado'})],
 cols:[c('numero_expediente','Núm. Expediente'),c('titulo','Título'),c('codigo_etiqueta','Código Etiqueta'),c('clasificacion','Clasificación'),c('caja','Caja'),c('estado','Estado')],
 btns:[{l:'Generar Etiqueta',a:'flag',i:'Tag'},{l:'Imprimir Marbete',i:'Printer'},{l:'Generar QR',a:'flag',i:'QrCode'},{l:'Generar Código de Barras',a:'flag',i:'Barcode'},{l:'Guardar Clasificación',a:'save',p:1,i:'Save'}]};
