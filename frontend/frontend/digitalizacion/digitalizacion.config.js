import {f,c} from '../sgda-itsaltillo/src/core/helpers.js';

// Pantalla: Digitalización y Resguardo
export default {path:'/digitalizacion',title:'Digitalización y Resguardo',sub:'Documentos y réplicas digitales',icon:'ScanLine',extra:'upload',select:1,
 fields:[f('folio','Folio','text',{req:1,ph:'Ingresa el folio'}),f('titulo','Título del Documento','text',{req:1,ph:'Ingresa el título'}),f('tipo_documento','Tipo de Documento','text',{ph:'Ingresa el tipo de documento'}),f('numero_expediente','Número de Expediente','text',{ph:'Ingresa el número de expediente'}),f('fecha_creacion','Fecha de Creación','date')],
 cols:[c('folio','Folio'),c('titulo','Título'),c('tipo_documento','Tipo'),c('ruta_archivo','Ruta del Archivo'),c('formato','Formato'),c('fecha_digitalizacion','Fecha de Digitalización')],
 btns:[{l:'Registrar Documento',a:'save',i:'Plus'},{l:'Escanear Documento',i:'ScanLine'},{l:'Subir Archivo Adjunto',a:'pick',p:1,i:'Upload'},{l:'Sincronizar Resguardo Digital',c:1,i:'RefreshCw'},{l:'Limpiar Lote',a:'clear',d:1,i:'Eraser'}]};
