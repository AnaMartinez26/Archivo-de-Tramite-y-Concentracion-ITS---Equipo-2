import { apiFetch } from '../../api/cliente.js';

// Convierte lo que responde la API a las claves que usa la pantalla (vigencias.config.js)
const soloFecha = f => (f ? String(f).slice(0, 10) : ''); // "2026-11-18T00:00:00" -> "2026-11-18"

export const mapVigenciaDto = x => ({
  id: x.id,
  numero_expediente: x.numeroExpediente,
  titulo: x.titulo || '',
  fecha_inicio: soloFecha(x.fechaInicio),
  fecha_vencimiento: soloFecha(x.fechaVencimiento),
  estado: x.estado,
  dias: x.diasParaVencer ?? null
});

function tratarError(ex) {
  if (ex?.status === 403) {
    return new Error(
      'Tu rol no tiene permiso para registrar o modificar vigencias (solo Administrador o Encargada de Archivo).'
    );
  }
  return ex;
}

const FECHA_VALIDA = /^\d{4}-\d{2}-\d{2}$/;

// Valida lo que se puede revisar antes de llamar al servidor y arma el cuerpo de la petición
function armarCuerpo(v) {
  const numero = String(v.numero_expediente || '').trim();
  if (!numero) throw new Error('El número de expediente es obligatorio.');
  if (numero.length > 30) throw new Error('El número de expediente no puede pasar de 30 caracteres.');

  const inicio = String(v.fecha_inicio || '').trim();
  const vencimiento = String(v.fecha_vencimiento || '').trim();
  if (!inicio) throw new Error('La fecha de inicio es obligatoria.');
  if (!vencimiento) throw new Error('La fecha de vencimiento es obligatoria.');
  if (!FECHA_VALIDA.test(inicio) || !FECHA_VALIDA.test(vencimiento)) {
    throw new Error('Las fechas no tienen un formato válido.');
  }

  const anio = f => Number(f.slice(0, 4));
  if ([inicio, vencimiento].some(f => anio(f) < 1900 || anio(f) > 2100)) {
    throw new Error('Las fechas deben estar entre los años 1900 y 2100.');
  }
  // El formato AAAA-MM-DD se puede comparar como texto
  if (vencimiento < inicio) {
    throw new Error('La fecha de vencimiento no puede ser anterior a la fecha de inicio.');
  }

  return {
    numeroExpediente: numero,
    fechaInicio: `${inicio}T00:00:00`,
    fechaVencimiento: `${vencimiento}T00:00:00`
  };
}

export async function listarVigencias() {
  const res = await apiFetch('/vigencias');
  return Array.isArray(res?.data) ? res.data.map(mapVigenciaDto) : [];
}

export async function obtenerResumenVigencias() {
  const res = await apiFetch('/vigencias/resumen');
  const d = res?.data || {};
  return {
    vigentes: d.vigentes ?? 0,
    proximos: d.proximosAVencer ?? 0,
    vencidos: d.vencidos ?? 0,
    numerosVencidos: Array.isArray(d.numerosVencidos) ? d.numerosVencidos : []
  };
}

export async function registrarVigencia(valores) {
  try {
    return await apiFetch('/vigencias', {
      method: 'POST',
      body: JSON.stringify(armarCuerpo(valores))
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}

export async function actualizarVigencia(id, valores) {
  try {
    return await apiFetch(`/vigencias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(armarCuerpo(valores))
    });
  } catch (ex) {
    throw tratarError(ex);
  }
}