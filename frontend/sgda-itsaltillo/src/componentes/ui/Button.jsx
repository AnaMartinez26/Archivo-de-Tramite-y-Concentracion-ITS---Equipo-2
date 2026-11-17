import { Icon } from './Icon.jsx';

// Botón estándar. Acepta `icon`/`i`, `primary`/`p`, `danger`/`d`.
export function Button({ icon, i, primary, p, danger, d, children, ...props }) {
  const nombreIcono = icon || i;
  const esPrimario = primary || p;
  const esPeligro = danger || d;
  const clases = ['btn', esPrimario && 'p', esPeligro && 'd'].filter(Boolean).join(' ');

  return (
    <button type="button" className={clases} {...props}>
      {nombreIcono && <Icon name={nombreIcono} />}
      {children}
    </button>
  );
}
