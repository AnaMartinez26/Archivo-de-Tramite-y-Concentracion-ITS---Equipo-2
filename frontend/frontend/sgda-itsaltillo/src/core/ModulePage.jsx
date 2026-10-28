import {useState,useEffect} from 'react';
import {Button,Field,Modal,ConfirmDialog,SearchBar,DataTable,useToast} from './ui.jsx';
import {PageTitle} from './layout.jsx';
import {ROLES} from './helpers.js';
import {apiFetch,getToken} from './auth.js';
import {TreeView} from '../../../clasificacion/TreeView.jsx';
import {Marbete} from '../../../etiquetado/Marbete.jsx';
import {FileUpload} from '../../../digitalizacion/FileUpload.jsx';
import {PDFPreview} from '../../../digitalizacion/PDFPreview.jsx';
import {StorageMap} from '../../../almacenamiento/StorageMap.jsx';
import {Timeline} from '../../../workflow/Timeline.jsx';
import {Legend} from '../../../vigencias/Legend.jsx';
import {Integrity} from '../../../auditoria/Integrity.jsx';

const mapUsuarioDto=u=>({
  id:u.id,
  nombre:u.nombreCompleto||`${u.nombre||''} ${u.apellidoP||''} ${u.apellidoM||''}`.trim(),
  correo:u.correo,
  numero_empleado:u.numEmpleado,
  departamento:u.departamento||'Archivo de Concentración',
  rol:u.rol,
  estado:u.estado
});

export default function ModulePage({m}){
  const toast=useToast();
  const [rows,setRows]=useState([]);
  const [rolesMap,setRolesMap]=useState({});
  const [v,setV]=useState({});
  const [err,setErr]=useState({});
  const [q,setQ]=useState('');
  const [fl,setFl]=useState({});
  const [sel,setSel]=useState([]);
  const [open,setOpen]=useState(false);
  const [cf,setCf]=useState(null);
  const [log,setLog]=useState([]);
  const [url,setUrl]=useState('');
  const [n,setN]=useState(1);

  useEffect(()=>{
    if(m.path!=='/usuarios'||!getToken())return;
    let active=true;
    (async()=>{
      try{
        const [uRes,rRes]=await Promise.all([
          apiFetch('/usuarios'),
          apiFetch('/usuarios/roles').catch(()=>null)
        ]);
        if(!active)return;
        if(Array.isArray(uRes?.data)){
          setRows(uRes.data.map(mapUsuarioDto));
        }
        if(Array.isArray(rRes?.data)){
          const mp={};
          rRes.data.forEach(r=>{mp[r.nombre]=r.id});
          setRolesMap(mp);
        }
      }catch(ex){
        if(active&&ex?.status===403){
          toast('Solo el rol Administrador puede consultar o gestionar usuarios','err');
        }
      }
    })();
    return()=>{active=false};
  },[m.path]);

  const now=()=>new Date().toLocaleString('es-MX');
  const reset=()=>{setV({});setErr({});setOpen(false)};

  const save=async()=>{
    const e={};
    m.fields.forEach(f=>{if(f.req&&!(Array.isArray(v[f.k])?v[f.k].length:String(v[f.k]||'').trim()))e[f.k]='Este campo es obligatorio.'});
    setErr(e);
    if(Object.keys(e).length)return toast('Completa los campos obligatorios','err');
    if(!m.cols)return toast('Configuración guardada (solo en esta sesión)');

    if(m.path==='/usuarios'&&getToken()){
      const partes=String(v.nombre||'').trim().split(/\s+/);
      const nombre=partes[0]||'';
      const apellidoP=partes[1]||partes[0]||'—';
      const apellidoM=partes.slice(2).join(' ')||'—';
      const numEmpleado=parseInt(v.numero_empleado,10)||(rows.length+1000);
      const idRol=rolesMap[v.rol]||(ROLES.indexOf(v.rol)+1)||1;
      try{
        const res=await apiFetch('/usuarios',{
          method:'POST',
          body:JSON.stringify({
            numEmpleado,
            nombre,
            apellidoP,
            apellidoM,
            correo:String(v.correo||'').trim(),
            password:String(v.contrasena||''),
            idRol,
            estado:v.estado||'Activo'
          })
        });
        if(res?.data){
          setRows(r=>[...r,{...mapUsuarioDto(res.data),departamento:v.departamento||'Archivo de Concentración'}]);
        }
        reset();
        return toast(res?.message||'Usuario registrado correctamente');
      }catch(ex){
        return toast(ex?.message||'Error al registrar usuario','err');
      }
    }

    setRows(r=>[...r,{id:n,ingreso:new Date().toLocaleDateString('es-MX'),...v,...(m.derive?m.derive(v):{})}]);
    setN(n+1);
    reset();
    toast('Registro agregado');
  };

  const needSel=()=>{if(!sel.length){toast('Selecciona al menos un registro de la tabla','err');return false}return true};
  const run=b=>{const go=()=>{
   if(b.a==='save'||b.a==='cfg')return save();if(b.a==='open')return setOpen(true);if(b.a==='cancel'){reset();return toast('Cambios cancelados','info')}
   if(b.a==='flag'){setFl(f=>({...f,[b.l.includes('QR')?'QR':b.l.includes('Barras')?'Bar':'Et']:1}));return toast(b.l+': listo (vista previa)')}
   if(b.a==='pick')return document.getElementById('fu')?.click();
   if(b.a==='del'||b.a==='clear'){const ids=b.a==='clear'?rows.map(r=>r.id):sel;if(!ids.length)return toast('No hay registros para quitar','err');
    return setCf({msg:'¿Quitar el/los registro(s) seleccionado(s)?',ok:()=>{setRows(r=>r.filter(x=>!ids.includes(x.id)));setSel([]);if(b.a==='clear')setUrl('')}})}
   if(b.a==='status'){if(!needSel())return;if(b.s==='Aprobado'&&!String(v.firma||'').trim())return toast('Ingresa la firma electrónica / token para aprobar','err');
    setRows(r=>r.map(x=>sel.includes(x.id)?{...x,estado:b.s}:x));setLog(l=>[{t:b.l,d:now()},...l]);return toast(b.l+': registrado')}
   if(b.a==='need'&&!needSel())return;toast(b.l+': se ejecutará al conectar el backend','info')};
   b.c?setCf({msg:`¿Confirmas la acción "${b.l}"?`,ok:go}):go()};
  const act=(a,r)=>setCf({msg:`¿Confirmas "${a}"?`,ok:()=>{const st=a.startsWith('Desactivar')?'Inactivo':a.includes('Devolución')?'Devuelto':a.includes('Plazo')?'En Prórroga':null;if(st)setRows(x=>x.map(y=>y.id===r.id?{...y,estado:st}:y));toast(a+': hecho','info')}});
  const fil=rows.filter(r=>(!q||Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase()))&&(m.filters||[]).every(f=>!fl[f.k]||(f.type==='select'?r[f.k]===fl[f.k]:f.on?String(r[f.on]||'').startsWith(fl[f.k]):true)));
  const take=async f=>{if(!f)return;if(f.type!=='application/pdf')return toast('Solo se admiten archivos PDF o PDF/A','err');if(!sel.length)return toast('Selecciona primero un documento de la tabla','err');setRows(x=>x.map(r=>r.id===sel[0]?{...r,ruta_archivo:f.name,formato:'PDF',fecha_digitalizacion:now()}:r));setUrl(URL.createObjectURL(f));toast('Réplica digital asociada')};
  const form=<div className="grid2">{m.fields.map(f=><Field key={f.k} f={f.dyn?{...f,options:rows.map(r=>r.nombre)}:f} value={v[f.k]} error={err[f.k]} onChange={x=>setV(s=>({...s,[f.k]:x}))}/>)}</div>;
  const inline=m.modal?null:<div className="card pad"><h3>Formulario</h3>{form}</div>;
  return <><PageTitle cu={m.cu} title={m.title} sub={m.sub}/>
  {m.extra==='badges'&&<Legend/>}
  {m.extra==='label'?<div className="grid2 top">{inline}<Marbete v={v} fl={fl}/></div>:m.extra==='upload'?<div className="grid2 top">{inline}<FileUpload onFile={take}/></div>:inline}
  {m.extra==='upload'&&<PDFPreview url={url}/>}{m.extra==='tree'&&<TreeView rows={rows}/>}{m.extra==='map'&&<StorageMap/>}{m.extra==='integrity'&&<Integrity/>}
  <div className="card pad"><div className="row wrap">{m.btns.map(b=><Button key={b.l} p={b.p} d={b.d} i={b.i} onClick={()=>run(b)}>{b.l}</Button>)}</div></div>
  {(m.search||m.filters)&&m.cols&&<div className="card pad filt"><SearchBar value={q} onChange={setQ} ph={m.search}/>{(m.filters||[]).map(f=><Field key={f.k} f={f} value={fl[f.k]} onChange={x=>setFl(s=>({...s,[f.k]:x}))}/>)}</div>}
  {m.cols&&<DataTable caption={m.sub||m.title} cols={m.cols} rows={fil} acts={m.acts} select={m.select} sel={sel} setSel={setSel} onAct={act}/>}
  {m.extra==='timeline'&&<Timeline log={log}/>}
  {open&&<Modal title={m.modal} onClose={reset}>{form}<div className="row end"><Button onClick={reset}>Cancelar</Button><Button p i="Save" onClick={save}>Guardar</Button></div></Modal>}
  {cf&&<ConfirmDialog msg={cf.msg} onOk={cf.ok} onClose={()=>setCf(null)}/>}</>}
