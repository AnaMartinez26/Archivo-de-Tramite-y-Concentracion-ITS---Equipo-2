import {EmptyState} from '../sgda-itsaltillo/src/core/ui.jsx';
export function Timeline({log}){return <div className="card pad"><h3>Histórico de Movimientos</h3>{log.length?<ol className="tl">{log.map((e,i)=><li key={i}><b>{e.t}</b><small>{e.d}</small></li>)}</ol>:<EmptyState t="Sin movimientos" d="Los movimientos se registrarán al aprobar, rechazar o reenviar trámites."/>}</div>}
