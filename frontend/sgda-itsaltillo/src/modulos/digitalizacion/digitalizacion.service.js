import { apiFetch, apiBlob } from '../../api/cliente.js';

export const mapDocumentoDto = d => ({
  id: d.id,
  folio: d.folio,
  titulo: d.titulo,
  tipo_documento: d.tipoDocumento || '',
  numero_expediente: d.numeroExpediente || '',
  ruta_archivo: d.rutaArchivo || '—',
  formato: d.formato || '—',
  fecha_creacion: d.fechaCreacion ? d.fechaCreacion.split('T')[0] : '',
  fecha_digitalizacion: d.fechaDigitalizacion
    ? new Date(d.fechaDigitalizacion).toLocaleString('es-MX')
    : '—'
});

export async function listarDocumentos() {
  const res = await apiFetch('/digitalizacion');
  return Array.isArray(res?.data) ? res.data.map(mapDocumentoDto) : [];
}

export async function crearDocumento(valores) {
  return apiFetch('/digitalizacion', {
    method: 'POST',
    body: JSON.stringify({
      folio: String(valores.folio || '').trim(),
      titulo: String(valores.titulo || '').trim(),
      tipoDocumento: valores.tipo_documento ? String(valores.tipo_documento).trim() : null,
      numeroExpediente: String(valores.numero_expediente || '').trim() || null,
      fechaCreacion: valores.fecha_creacion || null
    })
  });
}

export async function actualizarDocumento(idDoc, valores) {
  return apiFetch(`/digitalizacion/${idDoc}`, {
    method: 'PUT',
    body: JSON.stringify({
      titulo: String(valores.titulo || '').trim(),
      tipoDocumento: valores.tipo_documento ? String(valores.tipo_documento).trim() : null,
      numeroExpediente: String(valores.numero_expediente || '').trim() || null,
      fechaCreacion: valores.fecha_creacion || null
    })
  });
}

export async function subirArchivoPdf(idDoc, archivo) {
  const fd = new FormData();
  fd.append('archivo', archivo);
  return apiFetch(`/digitalizacion/${idDoc}/archivo`, { method: 'POST', body: fd });
}

export async function descargarArchivoPdfBlob(idDoc) {
  return apiBlob(`/digitalizacion/${idDoc}/archivo`);
}

export async function descargarPdfEnNavegador(idDoc, folio) {
  const blob = await descargarArchivoPdfBlob(idDoc);
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${String(folio || `documento-${idDoc}`).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

export async function eliminarDocumentos(ids) {
  const resultados = await Promise.allSettled(
    ids.map(id => apiFetch(`/digitalizacion/${id}`, { method: 'DELETE' }))
  );
  const eliminados = ids.filter((_, idx) => resultados[idx].status === 'fulfilled');
  const fallo = resultados.find(r => r.status === 'rejected');
  return {
    eliminados,
    errorMensaje: fallo?.reason?.message || ''
  };
}
