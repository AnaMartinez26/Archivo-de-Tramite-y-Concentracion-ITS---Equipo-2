import {useState,useId} from 'react';
import {useNavigate} from '../../core/router.jsx';
import {Button,Icon,useToast} from '../../core/ui.jsx';
import {Logo} from '../../core/layout.jsx';
import {loginApi} from '../../core/auth.js';

export default function Login(){
  const [u,setU]=useState('');
  const [p,setP]=useState('');
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [e,setE]=useState({});
  const nav=useNavigate();
  const toast=useToast();
  const a=useId(),b=useId();

  const go=async ev=>{
    ev.preventDefault();
    const x={};
    if(!u.trim())x.u='Ingresa tu correo institucional o número de empleado.';
    if(!p)x.p='Ingresa tu contraseña.';
    setE(x);
    if(Object.keys(x).length)return toast('Revisa los campos marcados','err');

    setLoading(true);
    try{
      const res=await loginApi(u,p);
      const usr=res?.data?.usuario;
      toast(usr?`Bienvenido(a), ${usr.nombreCompleto||usr.nombre}`:(res?.message||'Inicio de sesión correcto.'));
      nav('/dashboard',{replace:true});
    }catch(err){
      const msg=err?.message||'No se pudo iniciar sesión.';
      setE({api:msg});
      toast(msg,'err');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="card pad lg" onSubmit={go} noValidate>
        <Logo/>
        <h1>Sistema de Gestión Digital de Archivos</h1>
        <p className="cu">Iniciar Sesión</p>
        <small>Instituto Tecnológico de Saltillo · Archivo de Concentración</small>
        {e.api&&<div className="badge bad" role="alert" style={{justifyContent:'center',padding:'.45rem .7rem'}}><Icon n="AlertCircle" size={15}/>{e.api}</div>}
        <div className={'fld'+(e.u?' err':'')}>
          <label htmlFor={a}>Correo Institucional / Núm. de Empleado</label>
          <input id={a} value={u} onChange={x=>{setU(x.target.value);if(e.u||e.api)setE({})}} placeholder="Ej. admin@saltillo.tecnm.mx o núm. de empleado" autoComplete="username" disabled={loading}/>
          {e.u&&<small role="alert">{e.u}</small>}
        </div>
        <div className={'fld'+(e.p?' err':'')}>
          <label htmlFor={b}>Contraseña</label>
          <div className="row">
            <input id={b} type={show?'text':'password'} value={p} onChange={x=>{setP(x.target.value);if(e.p||e.api)setE({})}} placeholder="Ingresa tu contraseña" autoComplete="current-password" disabled={loading}/>
            <Button i={show?'EyeOff':'Eye'} onClick={()=>setShow(!show)} aria-label={show?'Ocultar contraseña':'Mostrar contraseña'} disabled={loading}>{show?'Ocultar':'Mostrar'}</Button>
          </div>
          {e.p&&<small role="alert">{e.p}</small>}
        </div>
        <button className="btn p full" type="submit" disabled={loading}>
          <Icon n="LogIn"/>{loading?'Iniciando sesión...':'Iniciar Sesión'}
        </button>
        <a href="#" onClick={x=>{x.preventDefault();toast('Solicita el restablecimiento de contraseña al Administrador del sistema','info')}}>¿Olvidaste tu contraseña?</a>
      </form>
    </div>
  );
}
