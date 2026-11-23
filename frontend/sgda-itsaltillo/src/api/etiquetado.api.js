import { qrSvg, code39Svg } from '../codes.js';
import { printHtml, esc } from '../utils.js';

const txt=x=>String(x??'').trim();

// Conexión con GET/POST api/expedientes
export const api={
  list:'/expedientes',
  create:'/expedientes',
  toRow:d=>({
    id:d.id,
    numero_expediente:d.numeroExpediente,
    titulo:d.titulo,
    codigo_etiqueta:d.codigoEtiqueta,
    clasificacion:d.clasificacion,
    caja:d.cajaNumero??'',
    estado:d.estado
  }),
  toBody:v=>{
    let cajaNumero=null;
    if(txt(v.caja)!==''){
      cajaNumero=Number(txt(v.caja));
      if(!Number.isInteger(cajaNumero)||cajaNumero<1)throw new Error('El número de caja debe ser un entero mayor a 0.');
    }
    return {
      numeroExpediente:txt(v.numero_expediente),
      titulo:txt(v.titulo),
      codigoEtiqueta:txt(v.codigo_etiqueta),
      clasificacion:txt(v.clasificacion)||null,
      cajaNumero,
      fechaApertura:v.fecha_apertura||null,
      estado:v.estado||'Activo'
    };
  }
};

// Generar Etiqueta: propone el código a partir del número de expediente (si no hay uno capturado)
export function generarEtiqueta({v,setV,setFl,toast}){
  const n=txt(v.numero_expediente);
  if(!n)return toast('Captura primero el número de expediente','err');
  if(!txt(v.codigo_etiqueta))setV(s=>({...s,codigo_etiqueta:'ETQ-'+n.toUpperCase().replace(/\s+/g,'-')}));
  setFl(s=>({...s,Et:1}));
  toast('Etiqueta generada (vista previa)');
}

// Imprimir Marbete con QR y código de barras
export async function imprimirMarbete({v,toast}){
  const codigo=txt(v.codigo_etiqueta)||txt(v.numero_expediente);
  if(!codigo)return toast('Captura el código de etiqueta o el número de expediente','err');
  try{
    const qr=await qrSvg(codigo,140);
    const fila=(l,x)=>`<div class="r"><span>${esc(l)}</span><b>${esc(x||'—')}</b></div>`;
    printHtml('Marbete '+codigo,
      `<div class="marbete"><h1>Marbete de Expediente</h1><small>Instituto Tecnológico de Saltillo · Archivo de Concentración</small>`+
      fila('Código de etiqueta',v.codigo_etiqueta)+fila('Número de expediente',v.numero_expediente)+fila('Título',v.titulo)+
      fila('Clasificación',v.clasificacion)+fila('Caja',v.caja)+
      `<div class="codes">${qr}${code39Svg(codigo,{alto:50,angosto:1.5,ancho:4})}</div></div>`);
  }catch(ex){toast('No se pudo generar el marbete: '+(ex?.message||'error'),'err')}
}
