import {f,c} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Gestión de Vigencias Documentales
export default {path:'/vigencias',title:'Gestión de Vigencias Documentales',sub:'Vigencia de expedientes y alertas',icon:'CalendarClock',extra:'badges',search:'Búsqueda por número de expediente',
 filters:[f('apertura','Año de Apertura','number',{ph:'Año',on:'fecha_inicio'}),f('cierre','Año de Cierre','number',{ph:'Año',on:'fecha_vencimiento'})],
 fields:[f('numero_expediente','Número de Expediente','text',{req:1,ph:'Ingresa el número de expediente'}),f('fecha_inicio','Fecha de Inicio','date',{req:1}),f('fecha_vencimiento','Fecha de Vencimiento','date',{req:1}),f('estado','Alerta de Vencimiento','select',{options:['Vigente','Próximo a vencer','Vencido'],ph:'Seleccionar alerta'})],
 cols:[c('numero_expediente','Expediente'),c('fecha_inicio','Fecha de Inicio'),c('fecha_vencimiento','Fecha de Vencimiento'),c('estado','Alerta de Vencimiento')],
 btns:[{l:'Registrar Vigencia',a:'save',i:'Plus'},{l:'Actualizar Tablas de Retención (CADIDO)',p:1,c:1,i:'RefreshCw'},{l:'Notificar Expedientes Vencidos',c:1,i:'BellRing'},{l:'Generar Alertas',i:'AlertTriangle'}]};
