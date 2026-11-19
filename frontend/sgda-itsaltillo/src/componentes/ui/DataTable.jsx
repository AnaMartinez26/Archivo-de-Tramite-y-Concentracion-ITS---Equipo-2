import { Badge } from './Badge.jsx';
import { Button } from './Button.jsx';
import { EmptyState } from './EmptyState.jsx';
import { Icon } from './Icon.jsx';

// Columnas que se muestran como etiqueta de color (Badge)
const COLUMNAS_BADGE = ['estado', 'estatus', 'alerta'];

export function Pagination({ total, n }) {
  const cantidad = total ?? n ?? 0;
  return (
    <div className="pag" aria-label="Paginación">
      <span>{cantidad ? `${cantidad} registro(s)` : 'Sin registros'}</span>
      <span>
        <Button disabled icon="ChevronLeft">
          Anterior
        </Button>{' '}
        Página 1 de 1{' '}
        <Button disabled>
          Siguiente
          <Icon name="ChevronRight" />
        </Button>
      </span>
    </div>
  );
}

function Celda({ columna, fila }) {
  const clave = columna.name || columna.k;
  const valor = fila[clave];
  if (COLUMNAS_BADGE.includes(clave) && valor) return <Badge estado={valor} />;
  if (clave === 'hash') return <code title={valor}>{String(valor).slice(0, 16)}…</code>;
  return valor || '—';
}

export function DataTable({ caption, cols, rows, acts, select, sel, setSel, onAct }) {
  const alternar = id => setSel(sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);

  return (
    <div className="card">
      <div className="tw">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {select && (
                <th>
                  <span className="sr">Seleccionar</span>
                </th>
              )}
              {cols.map(c => (
                <th key={c.name || c.k}>{c.label}</th>
              ))}
              {acts && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(fila => (
              <tr key={fila.id}>
                {select && (
                  <td>
                    <input
                      type="checkbox"
                      aria-label={'Seleccionar fila ' + fila.id}
                      checked={sel.includes(fila.id)}
                      onChange={() => alternar(fila.id)}
                    />
                  </td>
                )}
                {cols.map(c => (
                  <td key={c.name || c.k}>
                    <Celda columna={c} fila={fila} />
                  </td>
                ))}
                {acts && (
                  <td>
                    <div className="row">
                      {acts.map((a, idx) => {
                        const resuelta = typeof a === 'function' ? a(fila) : a;
                        if (!resuelta) return null;
                        const etiqueta = typeof resuelta === 'string' ? resuelta : resuelta.label;
                        return (
                          <Button
                            key={resuelta.key || etiqueta || idx}
                            onClick={() => onAct(resuelta, fila)}
                          >
                            {etiqueta}
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <EmptyState titulo="Sin registros disponibles" />}
      <Pagination total={rows.length} />
    </div>
  );
}
