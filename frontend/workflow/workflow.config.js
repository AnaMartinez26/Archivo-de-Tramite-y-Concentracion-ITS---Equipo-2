import {f,c,ID} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Control de Flujo de Información
export default {path:'/workflow',title:'Control de Flujo de Información',sub:'Workflow de Aprobación',icon:'GitBranch',extra:'timeline',select:1,
 fields:[f('folio_pase_salida','Folio del Trámite','text',{req:1,ph:'Ingresa el folio'}),f('numero_expediente','Número de Expediente','text',{req:1,ph:'Ingresa el número de expediente'}),f('numero_empleado','Núm. de Empleado del Solicitante','text',{req:1,ph:'Ingresa el número de empleado'}),f('tipo_movimiento','Solicitud','text',{ph:'Describe la solicitud'}),f('estado','Estado del Trámite','select',{options:['Pendiente','En Revisión por Archivo','Aprobado','Rechazado'],ph:'Seleccionar estado'}),f('motivo','Notas de Observación/Correcciones','textarea',{ph:'Escribe observaciones'}),f('firma','Firma Electrónica / Token de Autorización','password',{ph:'Ingresa el token'})],
 cols:[ID,c('folio_pase_salida','Folio'),c('numero_expediente','Expediente'),c('numero_empleado','Solicitante'),c('tipo_movimiento','Solicitud'),c('ingreso','Fecha de Ingreso'),c('estado','Estatus')],
 btns:[{l:'Registrar Trámite',a:'save',i:'Plus'},{l:'Aprobar Trámite',a:'status',s:'Aprobado',p:1,i:'Check'},{l:'Rechazar con Observaciones',a:'status',s:'Rechazado',d:1,i:'X'},{l:'Reenviar a Revisión',a:'status',s:'En Revisión por Archivo',i:'Send'}]};
