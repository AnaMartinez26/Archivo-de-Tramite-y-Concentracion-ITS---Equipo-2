import {f} from '../../core/helpers.js';

// Pantalla: Configuración
export default {path:'/configuracion',cu:'',title:'Configuración',sub:'Parámetros generales del sistema',icon:'Settings',
 fields:[f('dep','Nombre de la dependencia','text',{ph:'Ingresa el nombre'}),f('resp','Responsable del Archivo de Concentración','text',{ph:'Ingresa el nombre del responsable'})],
 btns:[{l:'Guardar Configuración',a:'cfg',p:1,i:'Save'}]};
