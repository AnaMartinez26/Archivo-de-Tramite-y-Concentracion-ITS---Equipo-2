import { Icon } from './Icon.jsx';

// Etiqueta de color según el texto del estado. Acepta `estado` o `s`.
const calcularTono = texto => {
  if (/^(Activo|Vigente|Aprobado|Devuelto)/.test(texto)) return 'ok';
  if (/^(Inactivo|Rechazado|Vencido)/.test(texto)) return 'bad';
  if (/^(Próximo|Pendiente|En )/.test(texto)) return 'warn';
  return 'info';
};

const ICONO = { ok: 'CheckCircle2', bad: 'XCircle', warn: 'Clock', info: 'Info' };

export function Badge({ estado, s }) {
  const valor = estado ?? s;
  const tono = calcularTono(valor);
  return (
    <span className={'badge ' + tono}>
      <Icon name={ICONO[tono]} size={12} />
      {valor}
    </span>
  );
}
