import * as Iconos from './iconos.js';

// Ícono por nombre (ver iconos.js). Acepta `name` o `n`.
export function Icon({ name, n, ...props }) {
  const clave = name || n;
  const Componente = Iconos[clave] || Iconos.Circle;
  return <Componente size={16} aria-hidden="true" {...props} />;
}
