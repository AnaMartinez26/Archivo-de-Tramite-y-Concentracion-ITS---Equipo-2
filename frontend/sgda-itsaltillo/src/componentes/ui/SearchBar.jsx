import { Icon } from './Icon.jsx';

export function SearchBar({ value, onChange, placeholder, ph }) {
  return (
    <div className="search">
      <Icon name="Search" />
      <input
        aria-label="Buscar"
        value={value}
        placeholder={placeholder || ph || 'Buscar...'}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
