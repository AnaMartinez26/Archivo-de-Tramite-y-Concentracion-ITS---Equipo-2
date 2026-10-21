import {f,c} from '../../core/helpers.js';

// Pantalla: Aseguramiento y Cumplimiento Normativo
export default {path:'/auditoria',title:'Aseguramiento y Cumplimiento Normativo',sub:'Bitácora de auditoría e integridad',icon:'ShieldCheck',extra:'integrity',
 filters:[f('accion','Acción Realizada','select',{options:['Modificación','Eliminación','Descarga'],ph:'Todas las acciones'})],
 fields:[f('periodo','Período de Auditoría','text',{ph:'Ej. rango de fechas a auditar'}),f('descripcion','Comentarios de Auditoría','textarea',{ph:'Escribe comentarios'})],
 cols:[c('fecha_hora','Fecha/Hora'),c('usuario','Usuario'),c('accion','Acción Realizada'),c('descripcion','Descripción')],
 btns:[{l:'Exportar Reporte de Auditoría',p:1,i:'FileDown'},{l:'Ejecutar Verificación de Integridad',c:1,i:'ShieldCheck'}]};
