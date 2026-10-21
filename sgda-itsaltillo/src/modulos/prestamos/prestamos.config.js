import {f,c} from '../../core/helpers.js';

// Pantalla: Trazabilidad y Control de Salidas
export default {path:'/prestamos',title:'Trazabilidad y Control de Salidas',sub:'Préstamos y Devoluciones',icon:'ArrowLeftRight',
 fields:[f('folio_pase_salida','Folio de Pase de Salida','text',{req:1,ph:'Ingresa el folio'}),f('numero_expediente','Número de Expediente','text',{req:1,ph:'Ingresa el número de expediente'}),f('numero_empleado','Núm. de Empleado del Solicitante','text',{req:1,ph:'Ingresa el número de empleado'}),f('tipo_movimiento','Tipo de Movimiento','select',{options:['Préstamo','Devolución','Prórroga'],ph:'Seleccionar tipo'}),f('fecha_salida','Fecha Salida','date'),f('fecha_regreso','Fecha de Regreso','date'),f('motivo','Motivo del Préstamo','textarea',{ph:'Describe el motivo'}),f('estado','Estado','select',{options:['En Préstamo','Devuelto','Vencido','En Prórroga'],ph:'Seleccionar estado'})],
 cols:[c('folio_pase_salida','Folio'),c('numero_expediente','Expediente'),c('numero_empleado','Solicitante'),c('tipo_movimiento','Tipo'),c('fecha_salida','Fecha Salida'),c('fecha_regreso','Fecha de Regreso'),c('estado','Estado')],
 acts:['Registrar Devolución','Extender Plazo'],
 btns:[{l:'Registrar Nueva Salida',a:'save',p:1,i:'Plus'},{l:'Confirmar Devolución',c:1,i:'CheckCircle2'},{l:'Imprimir Vale de Préstamo',i:'Printer'}]};
