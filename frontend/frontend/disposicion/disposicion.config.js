import {f,c} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Disposición Documental
export default {path:'/disposicion',title:'Disposición Documental',sub:'Baja o Transferencia',icon:'Archive',select:1,
 fields:[f('tipo_disposicion','Tipo de Disposición','select',{req:1,options:['Baja Documental','Transferencia Secundaria','Transferencia Histórica'],ph:'Seleccionar tipo'}),f('numero_expediente','Número de Expediente','text',{req:1,ph:'Ingresa el número de expediente'}),f('titulo','Asunto','text',{ph:'Ingresa el asunto'}),f('fecha_disposicion','Fecha de Disposición','date'),f('destino','Destino Final (catálogo)','select',{options:['Destrucción','Conservación Permanente'],ph:'Seleccionar destino'}),f('observaciones','Observaciones','textarea',{ph:'Escribe observaciones'})],
 cols:[c('numero_expediente','Núm. Expediente'),c('titulo','Asunto'),c('fecha_disposicion','Fecha de Disposición'),c('tipo_disposicion','Tipo'),c('destino','Destino Final')],
 btns:[{l:'Agregar a Selección',a:'save',i:'Plus'},{l:'Generar Acta de Baja Documental',a:'need',c:1,p:1,i:'FileText'},{l:'Autorizar Transferencia a Histórico',a:'need',c:1,i:'CheckCircle2'},{l:'Descargar Inventario de Disposición',i:'Download'}]};
