import { apiFetch } from '../../api/cliente.js';

const fecha = v => (v ? new Date(v).toLocaleString('es-MX') : '');

// TramiteDto (backend) -> fila de la tabla
export const mapTramiteDto = t => ({
  id: t.id,
  folio_pase_salida: t.folio,
  numero_expediente: t.numeroExpediente || '',
  numero_empleado: t.nombreSolicitante
    ? `${t.numEmpleadoSolicitante} · ${t.nombreSolicitante}`
    : String(t.numEmpleadoSolicitante || ''),
  tipo_movimiento: t.solicitud || '',
  motivo: t.observaciones || '',
  revisor: t.usuarioRevisa || '',
  ingreso: fecha(t.fechaIngreso),
  resolucion: fecha(t.fechaResolucion),
  estado: t.estado
});

// Entrada del histórico a partir de una fila
export const entradaLog = (fila, titulo) => ({
  t: titulo || `${fila.folio_pase_salida} · ${fila.estado}`,
  d: fila.resolucion || fila.ingreso,
  detalle: fila.motivo || fila.tipo_movimiento || ''
});

export const construirLogInicial = filas => filas.slice(0, 15).map(f => entradaLog(f));

export async function listarTramites() {
  const res = await apiFetch('/workflow');
  return Array.isArray(res?.data) ? res.data.map(mapTramiteDto) : [];
}

export async function crearTramite(valores) {
  const numEmpleado = Number(String(valores.numero_empleado || '').trim());
  if (!Number.isInteger(numEmpleado) || numEmpleado <= 0) {
    throw new Error('El número de empleado debe ser un número entero válido.');
  }
  const texto = x => (String(x || '').trim() ? String(x).trim() : null);

  return apiFetch('/workflow', {
    method: 'POST',
    body: JSON.stringify({
      folio: String(valores.folio_pase_salida || '').trim(),
      numeroExpediente: String(valores.numero_expediente || '').trim(),
      numEmpleadoSolicitante: numEmpleado,
      solicitud: texto(valores.tipo_movimiento),
      estado: valores.estado || 'Pendiente',
      observaciones: texto(valores.motivo)
    })
  });
}

export async function cambiarEstadoTramite(id, { estado, observaciones, firma }) {
  return apiFetch(`/workflow/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({
      estado,
      observaciones: String(observaciones || '').trim() || null,
      firmaToken: String(firma || '').trim() || null
    })
  });
}

// Aplica el mismo cambio de estado a varios trámites y reporta cuáles fallaron
export async function cambiarEstadoVarios(ids, datos) {
  const resultados = await Promise.allSettled(ids.map(id => cambiarEstadoTramite(id, datos)));
  const actualizados = [];
  const errores = [];
  resultados.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value?.data) actualizados.push(mapTramiteDto(r.value.data));
    else errores.push(r.reason?.message || `Error en el trámite #${ids[i]}`);
  });
  return { actualizados, errores };
}
