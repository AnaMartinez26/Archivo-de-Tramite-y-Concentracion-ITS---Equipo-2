import { apiFetch } from '../../api/cliente.js';

// Convierte lo que responde la API a las claves que usa la pantalla (clasificacion.config.js)
export const mapClasificacionDto = c => ({
  id: c.id,
  nombre: c.nombre,
  padre: c.padre || '',
  id_padre: c.idPadre ?? null,
  descripcion: c.descripcion || '',
  plazo: c.plazoConservacion ?? '',
  destino: c.destinoFinal || '',
  fundamento: c.fundamentoNormativo || ''
});

// El backend responde 403 (sin cuerpo) cuando el rol no tiene permiso
function tratarError(ex) {
  if (ex?.status === 403) {
    return new Error(
      'Tu rol no tiene permiso para modificar la estructura archivística (solo Administrador o Encargada de Archivo).'
    );
  }
  return ex;
}

// Arma el cuerpo de la petición y valida lo que se puede revisar antes de llamar al servidor
function armarCuerpo(v, rows) {
  const nombre = String(v.nombre || '').trim();
  if (!nombre) throw new Error('El nombre del valor archivístico es obligatorio.');

  let idPadre = null;
  if (v.padre) {
    const padre = rows.find(r => r.nombre === v.padre);
    if (!padre) throw new Error('La clasificación padre seleccionada no existe.');
    idPadre = padre.id;
  }

  let plazo = null;
  if (v.plazo !== undefined && v.plazo !== null && String(v.plazo).trim() !== '') {
    plazo = Number(v.plazo);
    if (!Number.isInteger(plazo) || plazo < 0) {
      throw new Error('El plazo de conservación debe ser un número entero mayor o igual a 0.');
    }
  }

  return {
    nombre,
    idPadre,
    descripcion: v.descripcion ? String(v.descripcion).trim() : null,
    plazoConservacion: plazo,
    destinoFinal: v.destino || null,
    fundamentoNormativo: v.fundamento ? String(v.fundamento).trim() : null
  };
}

export async function listarClasificaciones() {
  const res = await apiFetch('/clasificaciones');
  return Array.isArray(res?.data) ? res.data.map(mapClasificacionDto) : [];
}

export async function crearClasificacion(valores, rows) {
  try {
    return await apiFetch('/clasificaciones', {
      method: 'POST',
      body: JSON.stringify(armarCuerpo(valores, rows))
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}

export async function actualizarClasificacion(id, valores, rows) {
  try {
    return await apiFetch(`/clasificaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(armarCuerpo(valores, rows))
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}

// Profundidad de un nivel en el árbol (Fondo = 0)
const profundidad = (fila, rows) => {
  let n = 0;
  let actual = fila;
  while (actual?.id_padre != null && n < 50) {
    actual = rows.find(r => r.id === actual.id_padre);
    n++;
  }
  return n;
};

// Borra de uno en uno, primero los niveles más profundos, para que un padre
// seleccionado junto con sus hijos no falle por tener subniveles.
export async function eliminarClasificaciones(ids, rows) {
  const ordenados = ids
    .map(id => rows.find(r => r.id === id))
    .filter(Boolean)
    .sort((a, b) => profundidad(b, rows) - profundidad(a, rows));

  const eliminados = [];
  let errorMensaje = '';
  for (const fila of ordenados) {
    try {
      await apiFetch(`/clasificaciones/${fila.id}`, { method: 'DELETE' });
      eliminados.push(fila.id);
    } catch (ex) {
      errorMensaje = `"${fila.nombre}": ${tratarError(ex).message}`;
      break; // se detiene en el primer error para no dejar la estructura a medias
    }
  }
  return { eliminados, errorMensaje };
}
