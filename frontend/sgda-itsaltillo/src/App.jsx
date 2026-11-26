import { Routes, Route, Navigate, Link } from './router/router.jsx';
import Layout from './componentes/layout/Layout.jsx';
import Login from './paginas/login/Login.jsx';
import Dashboard from './paginas/inicio/Dashboard.jsx';
import ModulePage from './paginas/ModulePage.jsx';
import { Icon } from './componentes/ui/index.js';
import { MODS } from './modulos/index.js';
import { puedeAccederRuta } from './modulos/roles.config.js';
import { isAuthenticated, getUsuario } from './api/sesion.js';

function ProtectedLayout() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <Layout />;
}

function RoleProtectedModule({ m }) {
  const usuario = getUsuario();
  if (!puedeAccederRuta(usuario?.rol, m.path)) {
    return (
      <div className="card pad empty">
        <Icon name="Lock" size={38} />
        <h2>Acceso restringido para tu rol</h2>
        <p>
          Tu perfil actual (<strong>{usuario?.rol || 'Sin rol'}</strong>) no tiene asignado el
          módulo <strong>{m.title}</strong> conforme al control de permisos del sistema.
        </p>
        <Link to="/dashboard" className="btn p">
          <Icon name="Home" size={16} />
          Volver a mi panel de inicio
        </Link>
      </div>
    );
  }
  return <ModulePage key={m.path} m={m} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {MODS.map(m => (
          <Route key={m.path} path={m.path} element={<RoleProtectedModule m={m} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
