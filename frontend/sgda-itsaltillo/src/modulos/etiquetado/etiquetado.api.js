
import { qrSvg, code39Svg } from '../../codes.js';
import { printHtml, esc } from '../../utils.js';

const txt = x => String(x ?? '').trim();

export const api = {
  list: '/expedientes',
  create: '/expedientes',

  toRow: d => ({
    id: d.id,
    numero_expediente: d.numeroExpediente,
    titulo: d.titulo,
    codigo_etiqueta: d.codigoEtiqueta || '',
    clasificacion: d.clasificacion || '',
    caja: d.cajaNumero ?? '',
    estado: d.estado
  }),

  toBody: v => {
    const cajaNumero = txt(v.caja) === ''
      ? null
      : Number(txt(v.caja));

    if (cajaNumero !== null &&
        (!Number.isInteger(cajaNumero) || cajaNumero < 1)) {
      throw new Error('El número de caja debe ser un entero mayor a 0.');
    }

    const idClasificacion = txt(v.clasificacion) === ''
      ? null
      : Number(v.clasificacion);

    if (idClasificacion !== null &&
        (!Number.isInteger(idClasificacion) || idClasificacion < 1)) {
      throw new Error('Selecciona una clasificación válida.');
    }

    return {
      numeroExpediente: txt(v.numero_expediente),
      titulo: txt(v.titulo),
      idClasificacion,
      cajaNumero,
      fechaApertura: v.fecha_apertura || null,
      estado: v.estado || 'Activo'
    };
  }
};

export async function generarEtiqueta({
  sel, rows, setV, setFl, toast, apiFetch, reload
}) {
  if (sel.length !== 1) {
    return toast('Selecciona un expediente para generar su etiqueta', 'err');
  }

  try {
    const r = await apiFetch('/etiquetado/generar', {
      method: 'POST',
      body: JSON.stringify({ idExpediente: sel[0] })
    });

    await reload();

    const fila = rows.find(x => x.id === sel[0]);
    if (fila) {
      setV(s => ({
        ...s,
        numero_expediente: fila.numero_expediente,
        titulo: fila.titulo,
        codigo_etiqueta: r?.data?.codigoEtiqueta || fila.codigo_etiqueta
      }));
    }

    setFl(s => ({ ...s, Et: 1 }));
    toast(r?.message || 'Etiqueta registrada correctamente');
  } catch (ex) {
    toast(ex?.message || 'No se pudo generar la etiqueta', 'err');
  }
}

export async function imprimirMarbete({ v, toast }) {
  const codigo = txt(v.codigo_etiqueta) || txt(v.numero_expediente);
  if (!codigo) return toast('Selecciona un expediente con etiqueta', 'err');

  try {
    const qr = await qrSvg(codigo, 140);
    const fila = (l, x) =>
      `<div class="r"><span>${esc(l)}</span><b>${esc(x || '—')}</b></div>`;

    printHtml(
      'Marbete ' + codigo,
      `<div class="marbete">
        <h1>Marbete de Expediente</h1>
        <small>Instituto Tecnológico de Saltillo · Archivo de Concentración</small>
        ${fila('Código de etiqueta', codigo)}
        ${fila('Número de expediente', v.numero_expediente)}
        ${fila('Título', v.titulo)}
        ${fila('Clasificación', v.clasificacion)}
        ${fila('Caja', v.caja)}
        <div class="codes">${qr}${code39Svg(codigo, {
          alto: 50, angosto: 1.5, ancho: 4
        })}</div>
      </div>`
    );
  } catch (ex) {
    toast('No se pudo generar el marbete: ' + (ex?.message || 'error'), 'err');
  }
}
