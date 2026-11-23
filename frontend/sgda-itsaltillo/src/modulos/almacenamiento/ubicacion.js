// "Pasillo 1, Estante 2, Batería 3"  ->  { pasillo, estante, bateria }
export function parseUbicacion(u) {
  const p = String(u || '').split(/[,;]/).map(s => s.trim()).filter(Boolean);
  return { pasillo: p[0] || 'Sin pasillo', estante: p[1] || '—', bateria: p[2] || '—' };
}
