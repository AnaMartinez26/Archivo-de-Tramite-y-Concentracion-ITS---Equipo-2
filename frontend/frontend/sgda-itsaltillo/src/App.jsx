import {Routes,Route,Navigate} from './core/router.jsx';
import Layout from './core/layout.jsx';
import Login from './paginas/login/Login.jsx';
import Dashboard from './paginas/inicio/Dashboard.jsx';
import ModulePage from './core/ModulePage.jsx';
import {MODS} from '../../index.js';
import {isAuthenticated} from './core/auth.js';

function ProtectedLayout(){
  if(!isAuthenticated()) return <Navigate to="/login" replace/>;
  return <Layout/>;
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<ProtectedLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        {MODS.map(m=><Route key={m.path} path={m.path} element={<ModulePage key={m.path} m={m}/>}/>)}
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated()?'/dashboard':'/login'} replace/>}/>
    </Routes>
  );
}
