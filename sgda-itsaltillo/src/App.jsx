import {Routes,Route,Navigate} from './core/router.jsx';
import Layout from './core/layout.jsx';import Login from './paginas/login/Login.jsx';import Dashboard from './paginas/inicio/Dashboard.jsx';import ModulePage from './core/ModulePage.jsx';import {MODS} from './modulos/index.js';
export default function App(){return(<Routes>
<Route path="/login" element={<Login/>}/>
<Route element={<Layout/>}>
<Route path="/dashboard" element={<Dashboard/>}/>
{MODS.map(m=><Route key={m.path} path={m.path} element={<ModulePage key={m.path} m={m}/>}/>)}
</Route>
<Route path="*" element={<Navigate to="/login" replace/>}/></Routes>);}
