import { EmptyState } from '../../componentes/ui/index.js';

export function Timeline({ log }) {
  return (
    <div className="card pad">
      <h3>Histórico de Movimientos</h3>
      {log.length ? (
        <ol className="tl">
          {log.map((e, i) => (
            <li key={i}>
              <b>{e.t}</b>
              <small>{e.d}</small>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState
          titulo="Sin movimientos"
          descripcion="Los movimientos se registrarán al aprobar, rechazar o reenviar trámites."
        />
      )}
    </div>
  );
}
