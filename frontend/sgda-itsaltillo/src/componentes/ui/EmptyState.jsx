import { Icon } from './Icon.jsx';

export function EmptyState({
  titulo,
  t,
  descripcion,
  d
}) {
  const textoTitulo = titulo || t || 'No hay registros disponibles';
  const textoDesc =
    descripcion || d || 'Los registros aparecerán cuando se capture información en el sistema.';

  return (
    <div className="empty">
      <Icon name="Inbox" size={32} />
      <strong>{textoTitulo}</strong>
      <span>{textoDesc}</span>
    </div>
  );
}
