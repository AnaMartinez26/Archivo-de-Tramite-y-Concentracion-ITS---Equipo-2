import { apiFetch } from '../../api/cliente.js';

// Convierte lo que responde la API a las claves que usa la pantalla (prestamos.config.js)
const soloFecha = f => (f ? String(f).slice(0, 10) : '');

export const mapPrestamoDto = x => ({
  id: x.id,
  folio_pase_salida: x.folioPaseSalida,
  numero_expediente: x.numeroExpediente,
  numero_empleado: String(x.numeroEmpleado ?? ''),
  solicitante: x.nombreSolicitante || '',
  tipo_movimiento: x.tipoMovimiento,
  fecha_salida: soloFecha(x.fechaSalida),
  fecha_regreso: soloFecha(x.fechaRegreso),
  fecha_devolucion: soloFecha(x.fechaDevolucion),
  motivo: x.motivo || '',
  estado: x.estado
});

function tratarError(ex) {
  if (ex?.status === 403) {
    return new Error(
      'Tu rol no tiene permiso para registrar movimientos de préstamo (solo Administrador o Encargada de Archivo).'
    );
  }
  return ex;
}

const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;
const anio = f => Number(f.slice(0, 4));

// Valida lo que se puede revisar antes de llamar al servidor y arma el cuerpo de la petición
function armarCuerpo(v) {
  const folio = String(v.folio_pase_salida || '').trim();
  if (!folio) throw new Error('El folio del pase de salida es obligatorio.');
  if (folio.length > 30) throw new Error('El folio no puede pasar de 30 caracteres.');

  const expediente = String(v.numero_expediente || '').trim();
  if (!expediente) throw new Error('El número de expediente es obligatorio.');
  if (expediente.length > 30) throw new Error('El número de expediente no puede pasar de 30 caracteres.');

  const empleado = String(v.numero_empleado || '').trim();
  if (!/^\d{1,9}$/.test(empleado) || Number(empleado) <= 0) {
    throw new Error('El número de empleado debe ser un número válido.');
  }

  const salida = String(v.fecha_salida || '').trim();
  const regreso = String(v.fecha_regreso || '').trim();
  for (const fecha of [salida, regreso].filter(Boolean)) {
    if (!FECHA_VALIDA.test(fecha)) throw new Error('Las fechas no tienen un formato válido.');
    if (anio(fecha) < 1900 || anio(fecha) > 2100) {
      throw new Error('Las fechas deben estar entre los años 1900 y 2100.');
    }
  }
  if (salida && regreso && regreso < salida) {
    throw new Error('La fecha de regreso no puede ser anterior a la fecha de salida.');
  }

  const motivo = String(v.motivo || '').trim();
  if (motivo.length > 500) throw new Error('El motivo no puede pasar de 500 caracteres.');

  return {
    folioPaseSalida: folio,
    numeroExpediente: expediente,
    numeroEmpleado: empleado,
    fechaSalida: salida ? `${salida}T00:00:00` : null,
    fechaRegreso: regreso ? `${regreso}T00:00:00` : null,
    motivo: motivo || null
  };
}

export async function listarPrestamos() {
  const res = await apiFetch('/prestamos');
  return Array.isArray(res?.data) ? res.data.map(mapPrestamoDto) : [];
}

export async function registrarPrestamo(valores) {
  try {
    return await apiFetch('/prestamos', {
      method: 'POST',
      body: JSON.stringify(armarCuerpo(valores))
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}

export async function extenderPlazoPrestamo(id, nuevaFecha) {
  const fecha = String(nuevaFecha || '').trim();
  if (!fecha) throw new Error('La nueva fecha de regreso es obligatoria.');
  if (!FECHA_VALIDA.test(fecha)) throw new Error('Las fechas no tienen un formato válido.');
  if (anio(fecha) < 1900 || anio(fecha) > 2100) {
    throw new Error('Las fechas deben estar entre los años 1900 y 2100.');
  }
  try {
    return await apiFetch(`/prestamos/${id}/prorroga`, {
      method: 'PUT',
      body: JSON.stringify({ nuevaFechaRegreso: `${fecha}T00:00:00` })
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}

// Registra la devolución de uno o varios préstamos, de uno en uno.
// Se detiene en el primer error para no dejar el resultado a medias sin avisar.
export async function devolverPrestamos(ids, rows) {
  const hechos = [];
  let errorMensaje = '';
  for (const id of ids) {
    try {
      await apiFetch(`/prestamos/${id}/devolucion`, { method: 'PUT' });
      hechos.push(id);
    } catch (ex) {
      const folio = rows.find(r => r.id === id)?.folio_pase_salida || id;
      errorMensaje = `Folio ${folio}: ${tratarError(ex).message}`;
      break;
    }
  }
  return { hechos, errorMensaje };
}

const esc = t =>
  String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Abre una ventana con el vale de préstamo listo para imprimir. Devuelve false si el navegador la bloqueó.
export function imprimirVale(fila) {
  const w = window.open('', '_blank', 'width=720,height=800');
  if (!w) return false;
  w.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Vale de préstamo ${esc(fila.folio_pase_salida)}</title>
<style>body{font-family:Arial,sans-serif;margin:40px;color:#111}h1{font-size:20px;margin-bottom:4px}
table{border-collapse:collapse;width:100%;margin-top:20px}td{border:1px solid #888;padding:8px}td:first-child{width:35%;font-weight:bold;background:#f3f3f3}
.firmas{display:flex;justify-content:space-between;margin-top:80px}.firmas div{width:40%;border-top:1px solid #111;text-align:center;padding-top:6px}</style></head><body>
<h1>Vale de préstamo de expediente</h1><div>Archivo de Trámite y Concentración - ITS</div>
<table>
<tr><td>Folio de pase de salida</td><td>${esc(fila.folio_pase_salida)}</td></tr>
<tr><td>Expediente</td><td>${esc(fila.numero_expediente)}</td></tr>
<tr><td>Solicitante</td><td>${esc(fila.numero_empleado)} ${esc(fila.solicitante)}</td></tr>
<tr><td>Fecha de salida</td><td>${esc(fila.fecha_salida)}</td></tr>
<tr><td>Fecha de regreso</td><td>${esc(fila.fecha_regreso) || 'Sin fecha límite'}</td></tr>
<tr><td>Estado</td><td>${esc(fila.estado)}</td></tr>
<tr><td>Motivo</td><td>${esc(fila.motivo)}</td></tr>
</table>
<div class="firmas"><div>Entrega (Archivo)</div><div>Recibe (Solicitante)</div></div>
<script>window.onload=function(){window.print()}</script></body></html>`);
  w.document.close();
  return true;
}
