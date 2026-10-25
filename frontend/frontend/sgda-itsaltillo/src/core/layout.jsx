import {useState} from 'react';
import {NavLink,Link,Outlet,useLocation} from './router.jsx';
import {Icon} from './ui.jsx';
import {MODS} from '../modulos/index.js';
import LogoImg from '../assets/its-logo.png';
export const Logo=()=>
  <div className="logo" title="Instituto Tecnológico de Saltillo">
    <img src={LogoImg} alt="Instituto Tecnológico de Saltillo" />
  </div>;
export default function Layout(){const [o,setO]=useState(false);
    const {pathname}=useLocation();
    const m=MODS.find(x=>x.path===pathname);
 return <div className="app">
    <aside className={'side'+(o?' open':'')} aria-label="Navegación principal">
        <div className="brand"><Logo/>
        <div><b>Instituto Tecnológico de Saltillo</b><small>Archivo de Concentración</small></div></div>
 <nav onClick={()=>setO(false)}><NavLink to="/dashboard"><Icon n="Home"/>Inicio</NavLink>{MODS.map(x=><NavLink key={x.path} to={x.path}><Icon n={x.icon}/>{x.cu?`${x.cu} ${x.title}`:x.title}</NavLink>)}</nav></aside>
 <div className="main"><header className="top"><button className="burger" aria-label="Abrir menú" aria-expanded={o} onClick={()=>setO(!o)}><Icon n="Menu" size={22}/></button><span className="sys">Sistema de Gestión Digital de Archivos</span><Link className="out" to="/login"><Icon n="LogOut"/>Cerrar sesión</Link></header>
 <main><nav className="crumb" aria-label="Ruta"><Link to="/dashboard">Inicio</Link>{m&&<><Icon n="ChevronRight" size={14}/><span>{m.cu||m.title}</span></>}</nav><Outlet/></main></div></div>}
export const PageTitle=({cu,title,sub})=><div className="pt"><h1>{cu?`${cu}: ${title}`:title}</h1>{sub&&<p>{sub}</p>}</div>;
