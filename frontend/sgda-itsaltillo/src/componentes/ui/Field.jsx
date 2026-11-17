import { useId, useState } from 'react';
import { Button } from './Button.jsx';

// Lista de etiquetas (type: 'tags')
export function TagInput({ id, value, onChange, placeholder, ph }) {
  const [texto, setTexto] = useState('');

  const agregar = () => {
    const nuevo = texto.trim();
    if (nuevo && !value.includes(nuevo)) onChange([...value, nuevo]);
    setTexto('');
  };

  return (
    <div>
      <div className="row">
        <input
          id={id}
          value={texto}
          placeholder={placeholder || ph}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              agregar();
            }
          }}
        />
        <Button icon="Plus" onClick={agregar}>
          Agregar
        </Button>
      </div>
      <div className="chips">
        {value.map(x => (
          <span key={x} className="chip">
            {x}
            <button
              type="button"
              aria-label={'Quitar ' + x}
              onClick={() => onChange(value.filter(y => y !== x))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// Campo de formulario a partir de la definición creada con campo() / f() en modulos/helpers.js
export function Field({ field, f, value, onChange, error }) {
  const def = field || f;
  const id = useId();
  const valor = value ?? (def.type === 'tags' ? [] : '');
  const placeholder = def.placeholder || def.ph;
  const esRequerido = def.required || def.req;
  const alCambiar = e => onChange(e.target.value);

  let control;
  if (def.type === 'select') {
    const textoVacio =
      def.options?.length === 0 ? 'Sin opciones disponibles' : placeholder || 'Seleccionar';
    control = (
      <select id={id} value={valor} onChange={alCambiar}>
        <option value="">{textoVacio}</option>
        {(def.options || []).map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  } else if (def.type === 'textarea') {
    control = (
      <textarea id={id} rows={3} value={valor} placeholder={placeholder} onChange={alCambiar} />
    );
  } else if (def.type === 'tags') {
    control = (
      <TagInput id={id} value={valor} onChange={onChange} placeholder={placeholder} />
    );
  } else {
    control = (
      <input
        id={id}
        type={def.type || 'text'}
        value={valor}
        placeholder={placeholder}
        onChange={alCambiar}
        autoComplete="off"
      />
    );
  }

  return (
    <div className={'fld' + (error ? ' err' : '')}>
      <label htmlFor={id}>
        {def.label}
        {esRequerido && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
