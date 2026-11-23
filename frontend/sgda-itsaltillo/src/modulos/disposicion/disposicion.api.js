
import { printHtml, downloadCsv, esc, fmtFecha } from '../../utils.js';

const txt = x => String(x ?? '').trim();

export const api = {
  list: '/disposicion',
  create: '/disposicion',

  toRow: d => ({
    id: d.id,
    numero_expediente: d.numeroExpediente,
    titulo: d.titulo,
    fecha_disposicion: d.fechaDisposicion
      ? String(d.fechaDisposicion).slice(0, 10)
      : '',
    tipo_disposicion: d.tipoDisposicion,
    destino: d.destinoFinal || '',
    observaciones: d.observaciones || '',
    estado: d.estado,
    numero_acta: d.numeroActa || ''
  }),

  toBody: v => {
    const idExpediente = Number(v.id_expediente);

    if (!Number.isInteger(idExpediente) || idExpediente < 1) {
      throw new Error('Selecciona un expediente válido.');
    }

    return {
      idExpediente,
      tipoDisposicion: txt(v.tipo_disposicion),
      fechaDisposicion: v.fecha_disposicion || null,
      destinoFinal: txt(v.destino) || null,
      observaciones: txt(v.observaciones) || null
    };
  }
};

function imprimirActa(acta) {
  const registros = acta.disposiciones || [];

  const filas = registros.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(r.numeroExpediente)}</td>
      <td>${esc(r.titulo)}</td>
      <td>${esc(fmtFecha(r.fechaDisposicion))}</td>
      <td>${esc(r.destinoFinal || '')}</td>
      <td>${esc(r.observaciones || '')}</td>
    </tr>
  `).join('');

  printHtml(
    'Acta ' + acta.numeroActa,
    `<div class="head">
      <h1>Acta de Baja Documental</h1>
      <p>Instituto Tecnológico de Saltillo · Archivo de Concentración</p>
      <p><b>Acta:</b> ${esc(acta.numeroActa)}
      <b>Fecha:</b> ${esc(fmtFecha(acta.fechaGeneracion))}</p>
    </div>
    <p>Expedientes incluidos: ${registros.length}</p>
    <table>
      <thead><tr>
        <th>#</th><th>Expediente</th><th>Asunto</th>
        <th>Fecha</th><th>Destino</th><th>Observaciones</th>
      </tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <div class="firmas">
      <div>Responsable del Archivo de Concentración</div>
      <div>Autoriza</div>
    </div>`
  );
}

export async function generarActaBaja({
  sel, toast, reload, apiFetch
}) {
  try {
    const r = await apiFetch('/disposicion/acta-baja', {
      method: 'POST',
      body: JSON.stringify({ ids: sel })
    });

    await reload();
    if (r?.data) imprimirActa(r.data);
    toast(r?.message || 'Acta generada correctamente');
  } catch (ex) {
    toast(ex?.message || 'No se pudo generar el acta', 'err');
  }
}

export async function autorizarTransferencia({
  sel, setSel, toast, reload, apiFetch
}) {
  try {
    const r = await apiFetch('/disposicion/autorizar-transferencia', {
      method: 'POST',
      body: JSON.stringify({ ids: sel })
    });

    await reload();
    setSel([]);
    toast(r?.message || 'Transferencia autorizada');
  } catch (ex) {
    toast(ex?.message || 'No se pudo autorizar la transferencia', 'err');
  }
}

export function descargarInventario({ rows, sel, toast }) {
  const base = sel.length
    ? rows.filter(r => sel.includes(r.id))
    : rows;

  if (!base.length) return toast('No hay registros para exportar', 'err');

  downloadCsv(
    `inventario-disposicion-${new Date().toISOString().slice(0, 10)}.csv`,
    [
      'Núm. Expediente', 'Asunto', 'Fecha de Disposición',
      'Tipo', 'Destino Final', 'Estado', 'Núm. Acta', 'Observaciones'
    ],
    base.map(r => [
      r.numero_expediente, r.titulo, r.fecha_disposicion,
      r.tipo_disposicion, r.destino, r.estado,
      r.numero_acta, r.observaciones
    ])
  );

  toast(`Inventario descargado (${base.length} registros)`, 'info');
}
