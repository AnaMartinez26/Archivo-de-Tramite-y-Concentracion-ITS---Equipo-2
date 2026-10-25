import {f,c,ID} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Jerarquización de Información
export default {path:'/clasificacion',title:'Jerarquización de Información',sub:'Cuadro General de Clasificación Archivística',icon:'Network',extra:'tree',select:1,
 fields:[f('nombre','Nombre del Valor Archivístico','text',{req:1,ph:'Ingresa el nombre'}),f('padre','Clasificación Padre','select',{dyn:1,ph:'Ninguna (nivel Fondo)'}),f('descripcion','Descripción de la Serie','textarea',{ph:'Describe la serie'}),f('plazo','Plazo de Conservación (años)','number',{ph:'Años'}),f('destino','Destino Final','select',{options:['Destrucción','Conservación Permanente'],ph:'Seleccionar destino'}),f('fundamento','Fundamento Normativo','text',{ph:'Ingresa el fundamento normativo'})],
 cols:[ID,c('nombre','Nombre'),c('padre','Clasificación Padre'),c('plazo','Plazo (años)'),c('destino','Destino Final')],
 btns:[{l:'Agregar Nivel/Serie',a:'save',p:1,i:'Plus'},{l:'Modificar Estructura',i:'Pencil'},{l:'Eliminar Nivel',a:'del',d:1,i:'Trash2'},{l:'Guardar Árbol Archivístico',i:'Save'}]};
