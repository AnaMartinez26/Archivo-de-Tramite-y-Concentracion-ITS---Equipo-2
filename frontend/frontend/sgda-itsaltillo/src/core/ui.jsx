import {createContext,useContext,useId,useState,useCallback,useEffect} from 'react';
import * as I from './icons.js';
export const Icon=({n,...p})=>{const C=I[n]||I.Circle;return <C size={16} aria-hidden="true" {...p}/>};
export const Button=({i,p,d,children,...r})=><button type="button" className={'btn'+(p?' p':'')+(d?' d':'')} {...r}>{i&&<Icon n={i}/>}{children}</button>;
const T=createContext(()=>{});export const useToast=()=>useContext(T);
export function ToastProvider({children}){const [t,setT]=useState([]);
 const push=useCallback((msg,kind='ok')=>{const id=Math.random();setT(x=>[...x,{id,msg,kind}]);setTimeout(()=>setT(x=>x.filter(y=>y.id!==id)),3500)},[]);
 return <T.Provider value={push}>{children}<div className="toasts" role="status" aria-live="polite">{t.map(x=><div key={x.id} className={'toast '+x.kind}><Icon n={x.kind==='err'?'AlertCircle':x.kind==='info'?'Info':'CheckCircle2'}/>{x.msg}</div>)}</div></T.Provider>}
export function TagInput({id,value,onChange,ph}){const [s,setS]=useState('');
 const add=()=>{const x=s.trim();if(x&&!value.includes(x))onChange([...value,x]);setS('')};
 return <div><div className="row"><input id={id} value={s} placeholder={ph} onChange={e=>setS(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}/><Button i="Plus" onClick={add}>Agregar</Button></div>
 <div className="chips">{value.map(x=><span key={x} className="chip">{x}<button type="button" aria-label={'Quitar '+x} onClick={()=>onChange(value.filter(y=>y!==x))}>×</button></span>)}</div></div>}
export function Field({f,value,onChange,error}){const id=useId();const v=value??(f.type==='tags'?[]:'');const ch=e=>onChange(e.target.value);let el;
 if(f.type==='select')el=<select id={id} value={v} onChange={ch}><option value="">{f.options?.length===0?'Sin opciones disponibles':f.ph||'Seleccionar'}</option>{(f.options||[]).map(o=><option key={o}>{o}</option>)}</select>;
 else if(f.type==='textarea')el=<textarea id={id} rows={3} value={v} placeholder={f.ph} onChange={ch}/>;
 else if(f.type==='tags')el=<TagInput id={id} value={v} onChange={onChange} ph={f.ph}/>;
 else el=<input id={id} type={f.type||'text'} value={v} placeholder={f.ph} onChange={ch} autoComplete="off"/>;
 return <div className={'fld'+(error?' err':'')}><label htmlFor={id}>{f.label}{f.req&&<span aria-hidden="true"> *</span>}</label>{el}{error&&<small role="alert">{error}</small>}</div>}
export function Modal({title,onClose,children}){useEffect(()=>{const h=e=>e.key==='Escape'&&onClose();addEventListener('keydown',h);return()=>removeEventListener('keydown',h)},[onClose]);
 return <div className="ov" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={e=>e.stopPropagation()}><div className="mh"><h2>{title}</h2><button className="x" aria-label="Cerrar" onClick={onClose}><Icon n="X"/></button></div>{children}</div></div>}
export const ConfirmDialog=({msg,onOk,onClose})=><Modal title="Confirmar acción" onClose={onClose}><p>{msg}</p><div className="row end"><Button onClick={onClose}>Cancelar</Button><Button p onClick={()=>{onOk();onClose()}}>Confirmar</Button></div></Modal>;
const tone=s=>/^(Activo|Vigente|Aprobado|Devuelto)/.test(s)?'ok':/^(Inactivo|Rechazado|Vencido)/.test(s)?'bad':/^(Próximo|Pendiente|En )/.test(s)?'warn':'info';
export const Badge=({s})=><span className={'badge '+tone(s)}><Icon n={tone(s)==='ok'?'CheckCircle2':tone(s)==='bad'?'XCircle':tone(s)==='warn'?'Clock':'Info'} size={12}/>{s}</span>;
export const EmptyState=({t='No hay registros disponibles',d='Los registros aparecerán cuando se capture información en el sistema.'})=><div className="empty"><Icon n="Inbox" size={32}/><strong>{t}</strong><span>{d}</span></div>;
export const SearchBar=({value,onChange,ph})=><div className="search"><Icon n="Search"/><input aria-label="Buscar" value={value} placeholder={ph||'Buscar...'} onChange={e=>onChange(e.target.value)}/></div>;
export const Pagination=({n})=><div className="pag" aria-label="Paginación"><span>{n?`${n} registro(s)`:'Sin registros'}</span><span><Button disabled i="ChevronLeft">Anterior</Button> Página 1 de 1 <Button disabled>Siguiente<Icon n="ChevronRight"/></Button></span></div>;
export function DataTable({cols,rows,acts,select,sel,setSel,onAct,caption}){const BD=['estado','estatus','alerta'];
 const tog=id=>setSel(sel.includes(id)?sel.filter(x=>x!==id):[...sel,id]);
 return <div className="card"><div className="tw"><table><caption>{caption}</caption><thead><tr>{select&&<th><span className="sr">Seleccionar</span></th>}{cols.map(c=><th key={c.k}>{c.label}</th>)}{acts&&<th>Acciones</th>}</tr></thead>
 <tbody>{rows.map(r=><tr key={r.id}>{select&&<td><input type="checkbox" aria-label={'Seleccionar fila '+r.id} checked={sel.includes(r.id)} onChange={()=>tog(r.id)}/></td>}{cols.map(c=><td key={c.k}>{BD.includes(c.k)&&r[c.k]?<Badge s={r[c.k]}/>:(c.k==='hash'?<code title={r[c.k]}>{String(r[c.k]).slice(0,16)}…</code>:r[c.k]||'—')}</td>)}
 {acts&&<td><div className="row">{acts.map(a=><Button key={a} onClick={()=>onAct(a,r)}>{a}</Button>)}</div></td>}</tr>)}</tbody></table></div>
 {!rows.length&&<EmptyState t="Sin registros disponibles"/>}<Pagination n={rows.length}/></div>}
