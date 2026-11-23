import { printHtml, downloadCsv, esc, fmtFecha } from '../utils.js';

const txt=x=>String(x??'').trim();

// Conexión con GET/POST api/disposicion
export const api={
  list:'/disposicion',
  create:'/disposicion',
  toRow:d=>({
    id:d.id,
    numero_expediente:d.numeroExpediente,
    titulo:d.titulo,
    fecha_disposicion:d.fechaDisposicion?String(d.fechaDisposicion).slice(0,10):'',
    tipo_disposicion:d.tipoDisposicion,
    destino:d.destino,
    observaciones:d.observaciones,
    estado:d.estado,
    numero_acta:d.numeroActa
  }),
  toBody:v=>({
    tipoDisposicion:txt(v.tipo_disposicion),
    numeroExpediente:txt(v.numero_expediente),
    titulo:txt(v.titulo)||null,
    fechaDisposicion:v.fecha_disposicion||null,
    destino:txt(v.destino)||null,
    observaciones:txt(v.observaciones)||null
  })
};

function imprimirActa(acta){
  const filas=acta.registros.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.numeroExpediente)}</td><td>${esc(r.titulo)}</td><td>${esc(fmtFecha(r.fechaDisposicion))}</td><td>${esc(r.destino)}</td><td>${esc(r.observaciones)}</td></tr>`).join('');
  printHtml('Acta '+acta.numeroActa,
    `<div class="head"><h1>Acta de Baja Documental</h1><p>Instituto Tecnológico de Saltillo · Archivo de Concentración</p>`+
    `<p><b>Acta:</b> ${esc(acta.numeroActa)} &nbsp; <b>Fecha:</b> ${esc(fmtFecha(acta.fecha))}</p></div>`+
    `<p>Se da de baja la documentación de los siguientes expedientes (${acta.registros.length}):</p>`+
    `<table><thead><tr><th>#</th><th>Núm. Expediente</th><th>Asunto</th><th>Fecha de disposición</th><th>Destino final</th><th>Observaciones</th></tr></thead><tbody>${filas}</tbody></table>`+
    `<div class="firmas"><div>Responsable del Archivo de Concentración</div><div>Autoriza</div></div>`);
}

// Generar Acta de Baja Documental (para los registros seleccionados)
export async function generarActaBaja({sel,toast,reload,apiFetch}){
  try{
    const r=await apiFetch('/disposicion/acta-baja',{method:'POST',body:JSON.stringify({ids:sel})});
    await reload();
    toast(r?.message||'Acta generada');
    if(r?.data)imprimirActa(r.data);
  }catch(ex){toast(ex?.message||'No se pudo generar el acta','err')}
}

// Autorizar Transferencia a Histórico
export async function autorizarTransferencia({sel,setSel,toast,reload,apiFetch}){
  try{
    const r=await apiFetch('/disposicion/autorizar-transferencia',{method:'POST',body:JSON.stringify({ids:sel})});
    await reload();
    setSel([]);
    toast(r?.message||'Transferencia autorizada');
  }catch(ex){toast(ex?.message||'No se pudo autorizar la transferencia','err')}
}

// Descargar Inventario de Disposición (CSV): los seleccionados o, si no hay selección, todos
export function descargarInventario({rows,sel,toast}){
  const base=sel.length?rows.filter(r=>sel.includes(r.id)):rows;
  if(!base.length)return toast('No hay registros para exportar','err');
  downloadCsv(`inventario-disposicion-${new Date().toISOString().slice(0,10)}.csv`,
    ['Núm. Expediente','Asunto','Fecha de Disposición','Tipo','Destino Final','Estado','Núm. Acta','Observaciones'],
    base.map(r=>[r.numero_expediente,r.titulo,r.fecha_disposicion,r.tipo_disposicion,r.destino,r.estado,r.numero_acta,r.observaciones]));
  toast(`Inventario descargado (${base.length} registro${base.length===1?'':'s'})`,'info');
}
