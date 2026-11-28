import { apiFetch } from '../../api/cliente.js';

const formatearFechaHora = f => (f ? new Date(f).toLocaleString('es-MX') : '—');

export const mapAuditoriaDto = a => ({
  id: a.id,
  fecha_hora: formatearFechaHora(a.fechaHora),
  usuario: a.usuario || 'Sistema',
  accion: a.accion || '',
  tabla_afectada: a.tablaAfectada || '—',
  descripcion: a.descripcion || '',
  ip: a.ip || '—'
});

export async function listarAuditoria(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.accion) params.set('accion', filtros.accion);
  if (filtros.desde) params.set('desde', filtros.desde);
  if (filtros.hasta) params.set('hasta', filtros.hasta);

  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiFetch(`/auditoria${qs}`);
  return Array.isArray(res?.data) ? res.data.map(mapAuditoriaDto) : [];
}

export async function registrarComentarioAuditoria(valores) {
  const descripcion = String(valores.descripcion || '').trim();
  if (!descripcion) throw new Error('Los comentarios de auditoría son obligatorios.');

  return apiFetch('/auditoria', {
    method: 'POST',
    body: JSON.stringify({
      accion: 'Auditoría Manual',
      periodo: String(valores.periodo || '').trim() || null,
      descripcion
    })
  });
}

export async function ejecutarVerificacionIntegridad() {
  const res = await apiFetch('/auditoria/verificar-integridad', {
    method: 'POST'
  });
  return res?.data;
}

export function exportarReporteAuditoriaCsv(filas) {
  if (!filas || !filas.length) {
    throw new Error('No hay registros en la bitácora para exportar.');
  }
  const encabezados = ['ID', 'Fecha/Hora', 'Usuario', 'Acción Realizada', 'Módulo', 'Descripción', 'IP'];
  const escapar = val => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const lineas = [
    encabezados.join(','),
    ...filas.map(r =>
      [r.id, r.fecha_hora, r.usuario, r.accion, r.tabla_afectada, r.descripcion, r.ip]
        .map(escapar)
        .join(',')
    )
  ];

  const blob = new Blob(['\uFEFF' + lineas.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Reporte_Auditoria_ITS_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
