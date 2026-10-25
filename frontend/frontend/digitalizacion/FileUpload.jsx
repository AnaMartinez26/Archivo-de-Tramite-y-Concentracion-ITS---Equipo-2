import {useState,useRef} from 'react';
import {Icon,Button} from '../../core/ui.jsx';
export function FileUpload({onFile}){const [dr,setDr]=useState(false);const ref=useRef();
 return <div className={'drop'+(dr?' on':'')} onDragOver={e=>{e.preventDefault();setDr(true)}} onDragLeave={()=>setDr(false)} onDrop={e=>{e.preventDefault();setDr(false);onFile(e.dataTransfer.files[0])}}>
 <Icon n="UploadCloud" size={36}/><p>Arrastra un archivo PDF<br/>o</p><input id="fu" ref={ref} type="file" accept="application/pdf" hidden onChange={e=>onFile(e.target.files[0])}/><Button i="FolderOpen" onClick={()=>ref.current.click()}>Seleccionar archivo</Button></div>}
