import { useState, useEffect } from 'react';
import { Link } from '../../router/router.jsx';
import { Icon, Badge } from '../../componentes/ui/index.js';
import { PageTitle } from '../../componentes/layout/Layout.jsx';
import { MODS } from '../../modulos/index.js';
import { obtenerPerfilRol, filtrarModulosPorRol } from '../../modulos/roles.config.js';
import { getUsuario, getToken } from '../../api/sesion.js';
import { apiFetch } from '../../api/cliente.js';

export default function Dashboard() {
  const u = getUsuario();
  const rol = u?.rol || '';
  const perfil = obtenerPerfilRol(rol);
  const modulosPermitidos = filtrarModulosPorRol(MODS, rol);
  const [metricas, setMetricas] = useState({});

  useEffect(() => {
    if (!getToken() || !perfil?.kpis) return;
    let activo = true;

    const endpointsUnicos = [
      ...new Set(perfil.kpis.map(k => k.endpoint).filter(Boolean))
    ];

    (async () => {
      const respuestas = {};
      await Promise.all(
        endpointsUnicos.map(async ep => {
          try {
            const res = await apiFetch(ep);
            respuestas[ep] = Array.isArray(res?.data) ? res.data : [];
          } catch {
            respuestas[ep] = null;
          }
        })
      );

      if (!activo) return;
      const calculadas = {};
      perfil.kpis.forEach(k => {
        if (k.valorFijo !== undefined) {
          calculadas[k.label] = k.valorFijo;
        } else {
          const datos = respuestas[k.endpoint];
          calculadas[k.label] = Array.isArray(datos) ? k.calc(datos) : '—';
        }
      });
      setMetricas(calculadas);
    })();

    return () => {
      activo = false;
    };
  }, [rol]);

  const kpis = perfil?.kpis || [
    { label: 'Módulos disponibles', valorFijo: String(modulosPermitidos.length), sub: 'Acceso habilitado' }
  ];

  return (
    <>
      <PageTitle
        title={perfil ? perfil.tituloVista : 'Sistema de Gestión Digital de Archivos'}
        sub={
          perfil
            ? perfil.subtitulo
            : 'Pantalla de inicio · Archivo de Concentración del Instituto Tecnológico de Saltillo'
        }
      />

      {u && (
        <div className="card pad role-banner">
          <div className="role-head">
            <div>
              <div className="row wrap">
                <strong>{u.nombreCompleto || u.nombre}</strong>
                {u.rol && <Badge estado={u.rol} />}
              </div>
              <small>
                {u.correo}
                {u.numEmpleado ? ` · Núm. Empleado: ${u.numEmpleado}` : ''}
                {u.departamento ? ` · ${u.departamento}` : ''}
                {u.puesto ? ` (${u.puesto})` : ''}
              </small>
            </div>
            <span className="role-count">
              <Icon name="ShieldCheck" size={16} />
              {modulosPermitidos.length} caso(s) de uso habilitados
            </span>
          </div>
          {perfil?.resumen && <p className="role-desc">{perfil.resumen}</p>}
        </div>
      )}

      <div className="grid3">
        {kpis.map(k => {
          const valor = k.valorFijo !== undefined ? k.valorFijo : (metricas[k.label] ?? '...');
          return (
            <div key={k.label} className="card pad stat">
              <small>{k.label}</small>
              <b>{valor}</b>
              <span>{k.sub}</span>
            </div>
          );
        })}
      </div>

      <h2>Casos de uso asignados a tu rol</h2>
      <div className="grid3">
        {modulosPermitidos.map(m => (
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
