import {Icon} from '../../core/ui.jsx';
const LV=['Fondo','Sección','Serie','Subserie'];
export function TreeView({rows}){const kids=p=>rows.filter(r=>(r.padre||'')===p);
 const walk=(p,d)=>kids(p).flatMap(r=>[<li key={r.id} style={{marginLeft:d*22}}><span className="lv"><Icon n={d?'CornerDownRight':'Folder'}/> {LV[Math.min(d,3)]}</span><b className="node">{r.nombre}</b></li>,...walk(r.nombre,d+1)]);
 const out=walk('',0);
 return <div className="card pad"><h3>Estructura archivística</h3><ul className="tree">{out.length?out:LV.map((l,i)=><li key={l} style={{marginLeft:i*22}}><span className="lv"><Icon n={i?'CornerDownRight':'Folder'}/> {l}</span><em className="ph">[ {l} sin definir ]</em></li>)}</ul></div>}
