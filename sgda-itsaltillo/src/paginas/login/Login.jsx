import {useState,useId} from 'react';import {useNavigate} from '../../core/router.jsx';import {Button,Icon,useToast} from '../../core/ui.jsx';import {Logo} from '../../core/layout.jsx';
export default function Login(){const [u,setU]=useState('');const [p,setP]=useState('');const [show,setShow]=useState(false);const [e,setE]=useState({});const nav=useNavigate();const toast=useToast();const a=useId(),b=useId();
 const go=ev=>{ev.preventDefault();const x={};if(!u.trim())x.u='Ingresa tu correo institucional o usuario.';if(!p)x.p='Ingresa tu contraseña.';setE(x);if(Object.keys(x).length)return toast('Revisa los campos marcados','err');nav('/dashboard')};
 return <div className="login"><form className="card pad lg" onSubmit={go} noValidate><Logo/><h1>Sistema de Gestión Digital de Archivos</h1><p className="cu">Iniciar Sesión</p><small>Instituto Tecnológico de Saltillo · Archivo de Concentración</small>
 <div className={'fld'+(e.u?' err':'')}><label htmlFor={a}>Correo Institucional / Usuario</label><input id={a} value={u} onChange={x=>setU(x.target.value)} placeholder="Ingresa tu correo institucional o usuario" autoComplete="username"/>{e.u&&<small role="alert">{e.u}</small>}</div>
 <div className={'fld'+(e.p?' err':'')}><label htmlFor={b}>Contraseña</label><div className="row"><input id={b} type={show?'text':'password'} value={p} onChange={x=>setP(x.target.value)} placeholder="Ingresa tu contraseña" autoComplete="current-password"/><Button i={show?'EyeOff':'Eye'} onClick={()=>setShow(!show)} aria-label={show?'Ocultar contraseña':'Mostrar contraseña'}>{show?'Ocultar':'Mostrar'}</Button></div>{e.p&&<small role="alert">{e.p}</small>}</div>
 <button className="btn p full" type="submit"><Icon n="LogIn"/>Iniciar Sesión</button>
 <a href="#" onClick={x=>{x.preventDefault();toast('La recuperación de contraseña se habilitará con el backend','info')}}>¿Olvidaste tu contraseña?</a>
 </form>
    </div>}
