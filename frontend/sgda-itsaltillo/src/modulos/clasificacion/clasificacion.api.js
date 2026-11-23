export const api = {
  list: '/clasificaciones',
  create: '/clasificaciones',
  remove: id => `/clasificaciones/${id}`,

  toRow: d => ({
    id: d.id,
    nombre: d.nombre,
    padre: d.padre || '',
    descripcion: d.descripcion || '',
    plazo: d.plazoConservacion ?? '',
    destino: d.destinoFinal || '',
    fundamento: d.fundamentoNormativo || '',
    id_padre: d.idPadre ?? null
  }),

  toBody: v => ({
    nombre: String(v.nombre || '').trim(),
    idPadre: v.padre ? Number(v.padre) : null,
    descripcion: v.descripcion || null,
    plazoConservacion:
      v.plazo === '' || v.plazo == null ? null : Number(v.plazo),
    destinoFinal: v.destino || null,
    fundamentoNormativo: v.fundamento || null
  })
};