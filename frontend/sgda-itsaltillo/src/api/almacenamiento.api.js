import { printHtml, esc } from '../utils.js';
import { parseUbicacion } from '../modulos/almacenamiento/ubicacion.js';

const entero=(x,min,msg)=>{const s=String(x??'').trim();const n=Number(s);if(s===''||!Number.isInteger(n)||n<min)throw new Error(msg);return n};

// Conexión con GET/POST api/almacenamiento/cajas
export const api={
  list:'/almacenamiento/cajas',
  create:'/almacenamiento/cajas',
  toRow:d=>({
    id:d.id,
    numero_caja:d.cajaNumero,
    codigo_etiqueta:d.codigoEtiqueta,
    ubicacion:d.ubicacionPasilloEstanteBateria,
    capacidad:d.capacidad,
    ocupacion:d.ocupacion,
    estado:d.estado
  }),
  toBody:v=>({
    cajaNumero:entero(v.numero_caja,1,'El número de caja debe ser un entero mayor a 0.'),
    codigoEtiqueta:String(v.codigo_etiqueta||'').trim(),
    ubicacionPasilloEstanteBateria:String(v.ubicacion||'').trim(),
    capacidad:String(v.capacidad??'').trim()===''?0:entero(v.capacidad,0,'La capacidad debe ser un entero (0 o más).'),
    estado:v.estado||'Disponible'
  })
};

// Mover de Ubicación: usa la fila seleccionada + el campo "Ubicación" del formulario
export async function moverUbicacion({v,sel,toast,reload,apiFetch,setV}){
  if(sel.length!==1)return toast('Selecciona una sola caja de la tabla','err');
  const ubicacion=String(v.ubicacion||'').trim();
  if(!ubicacion)return toast('Escribe la nueva ubicación en el formulario','err');
  try{
    const r=await apiFetch(`/almacenamiento/cajas/${sel[0]}/ubicacion`,{method:'PUT',body:JSON.stringify({ubicacion})});
    await reload();
    setV(s=>({...s,ubicacion:''}));
    toast(r?.message||'Ubicación actualizada');
  }catch(ex){toast(ex?.message||'No se pudo mover la caja','err')}
}

// Imprimir Guía de Pasillo: de los pasillos de las cajas seleccionadas (o de todos si no hay selección)
export function imprimirGuia({rows,sel,toast}){
  const base=sel.length?rows.filter(r=>sel.includes(r.id)):rows;
  if(!base.length)return toast('No hay cajas registradas para imprimir','err');
  const pasillos=[...new Set(base.map(r=>parseUbicacion(r.ubicacion).pasillo))];
  const pas=new Set(pasillos);
  const lista=rows.filter(r=>pas.has(parseUbicacion(r.ubicacion).pasillo))
    .sort((a,b)=>a.numero_caja-b.numero_caja);
  const bloques=pasillos.sort().map(p=>{
    const filas=lista.filter(r=>parseUbicacion(r.ubicacion).pasillo===p).map(r=>{
      const u=parseUbicacion(r.ubicacion);
      return `<tr><td>${esc(u.estante)}</td><td>${esc(u.bateria)}</td><td>${esc(r.numero_caja)}</td><td>${esc(r.codigo_etiqueta)}</td><td>${esc(r.ocupacion??0)} / ${r.capacidad?esc(r.capacidad):'—'}</td><td>${esc(r.estado)}</td></tr>`;
    }).join('');
    return `<h2>${esc(p)}</h2><table><thead><tr><th>Estante</th><th>Batería</th><th>Caja</th><th>Código de etiqueta</th><th>Expedientes / Capacidad</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table>`;
  }).join('');
  printHtml('Guía de pasillo',`<div class="head"><h1>Guía de Pasillo</h1><p>Instituto Tecnológico de Saltillo · Archivo de Concentración</p><small>Impreso el ${esc(new Date().toLocaleString('es-MX'))}</small></div>${bloques}`);
}
