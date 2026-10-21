import {f,c,ESTADO,ROLES,ID} from '../../core/helpers.js';

// Pantalla: Gestión de Usuarios
export default {path:'/usuarios',title:'Gestión de Usuarios',sub:'Usuarios, roles y trabajadores',icon:'Users',modal:'Registrar Nuevo Usuario',
 search:'Buscar por nombre, correo o número de empleado...',filters:[f('rol','Rol','select',{options:ROLES,ph:'Todos los roles'}),f('estado','Estado','select',{options:ESTADO,ph:'Todos los estados'})],
 fields:[f('nombre','Nombre Completo','text',{req:1,ph:'Ingresa el nombre completo'}),f('correo','Correo Institucional','email',{req:1,ph:'Ingresa el correo institucional'}),f('contrasena','Contraseña','password',{req:1,ph:'Ingresa la contraseña'}),f('rol','Rol Asignado','select',{req:1,options:ROLES,ph:'Seleccionar rol'}),f('estado','Estado','select',{options:ESTADO,ph:'Seleccionar estado'}),f('numero_empleado','Número de Empleado','text',{ph:'Ingresa el número de empleado'}),f('departamento','Área/Departamento','text',{ph:'Ingresa el área o departamento'}),f('puesto','Puesto','text',{ph:'Ingresa el puesto'})],
 cols:[ID,c('nombre','Nombre Completo'),c('correo','Correo Institucional'),c('numero_empleado','Núm. Empleado'),c('departamento','Área/Departamento'),c('rol','Rol Asignado'),c('estado','Estado')],
 acts:['Editar','Desactivar','Restablecer contraseña'],
 btns:[{l:'Registrar Nuevo Usuario',a:'open',p:1,i:'Plus'},{l:'Exportar Lista',i:'Download'},{l:'Guardar Cambios',i:'Save'},{l:'Cancelar',a:'cancel',i:'X'}]};
