import { Link } from '../../router/router.jsx';
import { Icon } from '../../componentes/ui/index.js';
import { PageTitle } from '../../componentes/layout/Layout.jsx';
import { MODS } from '../../modulos/index.js';
import { getUsuario } from '../../api/sesion.js';

export default function Dashboard() {
  const u = getUsuario();
  return (
    <>
      <PageTitle
        title="Sistema de Gestión Digital de Archivos"
        sub={
          u
            ? `Bienvenido(a), ${u.nombreCompleto || u.nombre} (${u.rol}) · Archivo de Concentración del Instituto Tecnológico de Saltillo`
            : 'Pantalla de inicio · Archivo de Concentración del Instituto Tecnológico de Saltillo'
        }
      />
      <div className="grid3">
        {['Expedientes', 'Préstamos activos', 'Alertas de vencimiento'].map(t => (
          <div key={t} className="card pad stat">
            <small>{t}</small>
            <b>—</b>
            <span>Sin datos</span>
          </div>
        ))}
      </div>
      <h2>Acceso a módulos</h2>
      <div className="grid3">
        {MODS.map(m => (
          <Link key={m.path} to={m.path} className="card pad mod">
            <Icon name={m.icon} size={26} />
            {m.cu && <small>{m.cu}</small>}
            <b>{m.title}</b>
            <span>{m.sub}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
