import { useEffect } from 'react';
import { Icon } from './Icon.jsx';
import { Button } from './Button.jsx';

// Ventana modal. Se cierra con Escape, con la X o haciendo clic fuera.
export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const alPresionarTecla = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', alPresionarTecla);
    return () => removeEventListener('keydown', alPresionarTecla);
  }, [onClose]);

  return (
    <div className="ov" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
      >
        <div className="mh">
          <h2>{title}</h2>
          <button className="x" aria-label="Cerrar" onClick={onClose}>
            <Icon name="X" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Diálogo de confirmación (Cancelar / Confirmar)
export function ConfirmDialog({ msg, onOk, onClose }) {
  return (
    <Modal title="Confirmar acción" onClose={onClose}>
      <p>{msg}</p>
      <div className="row end">
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          primary
          onClick={() => {
            onOk();
            onClose();
          }}
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
