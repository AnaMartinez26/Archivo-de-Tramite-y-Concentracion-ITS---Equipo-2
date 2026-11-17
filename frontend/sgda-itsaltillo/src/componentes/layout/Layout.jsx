import { useState } from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from '../../router/router.jsx';
import { Icon, useToast } from '../ui/index.js';
import { MODS } from '../../modulos/index.js';
import { getUsuario, clearSesion } from '../../api/sesion.js';
import LogoImg from '../../assets/its-logo.png';

export const Logo = () => (
  <div className="logo" title="Instituto Tecnológico de Saltillo">
    <img src={LogoImg} alt="Instituto Tecnológico de Saltillo" />
  </div>
);

export const PageTitle = ({ cu, title, sub }) => (
  <div className="pt">
    <h1>{cu ? `${cu}: ${title}` : title}</h1>
    {sub && <p>{sub}</p>}
  </div>
);

export default function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();
  const toast = useToast();
  const usuario = getUsuario();
  const moduloActual = MODS.find(x => x.path === pathname);

  const salir = ev => {
    ev.preventDefault();
    clearSesion();
    toast('Sesión cerrada correctamente', 'info');
    nav('/login', { replace: true });
  };

  return (
    <div className="app">
      <aside className={'side' + (menuAbierto ? ' open' : '')} aria-label="Navegación principal">
        <div className="brand">
          <Logo />
          <div>
            <b>Instituto Tecnológico de Saltillo</b>
            <small>Archivo de Concentración</small>
          </div>
        </div>
        <nav onClick={() => setMenuAbierto(false)}>
          <NavLink to="/dashboard">
            <Icon name="Home" />
            Inicio
          </NavLink>
          {MODS.map(x => (
            <NavLink key={x.path} to={x.path}>
              <Icon name={x.icon} />
              {x.cu ? `${x.cu} ${x.title}` : x.title}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="top">
          <button
            className="burger"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <Icon name="Menu" size={22} />
          </button>
          <span className="sys">Sistema de Gestión Digital de Archivos</span>
          {usuario && (
            <span className="usr" title={usuario.correo}>
              <Icon name="Users" size={15} />
              <b>{usuario.nombreCompleto || usuario.nombre}</b>
              {usuario.rol && <small>({usuario.rol})</small>}
            </span>
          )}
          <a href="#/login" className="out" onClick={salir}>
            <Icon name="LogOut" />
            Cerrar sesión
          </a>
        </header>
        <main>
          <nav className="crumb" aria-label="Ruta">
            <Link to="/dashboard">Inicio</Link>
            {moduloActual && (
              <>
                <Icon name="ChevronRight" size={14} />
                <span>{moduloActual.cu || moduloActual.title}</span>
              </>
            )}
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
