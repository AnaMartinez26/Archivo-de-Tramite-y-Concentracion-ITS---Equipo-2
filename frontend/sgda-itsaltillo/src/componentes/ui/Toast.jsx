import { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from './Icon.jsx';

// Notificaciones flotantes. Uso: const toast = useToast(); toast('Mensaje', 'ok' | 'err' | 'info');
const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

const ICONO = { ok: 'CheckCircle2', err: 'AlertCircle', info: 'Info' };
const DURACION_MS = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrar = useCallback((msg, kind = 'ok') => {
    const id = Math.random();
    setToasts(lista => [...lista, { id, msg, kind }]);
    setTimeout(() => setToasts(lista => lista.filter(t => t.id !== id)), DURACION_MS);
  }, []);

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={'toast ' + t.kind}>
            <Icon name={ICONO[t.kind] || ICONO.ok} />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
