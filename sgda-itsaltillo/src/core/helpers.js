// Ayudantes para definir pantallas: f = campo de formulario, c = columna de tabla
export const f=(k,label,type='text',o={})=>({k,label,type,...o});
export const c=(k,label)=>({k,label});
export const ESTADO=['Activo','Inactivo'];
export const ROLES=['Administrador','Trabajador RRHH','Encargada de Archivo','Servicio Social','Directivo'];
export const ID=c('id','ID');
