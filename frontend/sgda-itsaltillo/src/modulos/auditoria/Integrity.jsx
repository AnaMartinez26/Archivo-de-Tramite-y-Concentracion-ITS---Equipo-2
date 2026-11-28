import { Icon, Badge } from '../../componentes/ui/index.js';

export const Integrity = ({ reporte }) => {
  const indicadores = [
    {
      icono: 'ShieldCheck',
      titulo: 'Integridad de archivos',
      estado: reporte ? reporte.estadoIntegridadArchivos : 'Pendiente de verificar',
      detalle: reporte
        ? `${reporte.archivosEnDisco}/${reporte.documentosConArchivo} PDFs íntegros (${reporte.archivosFaltantes} faltantes, ${reporte.archivosCorruptos} dañados)`
        : 'Sin verificación reciente'
    },
    {
      icono: 'Lock',
      titulo: 'Control de acceso (JWT / Roles)',
      estado: reporte ? reporte.estadoControlAcceso : 'Pendiente de verificar',
      detalle: reporte ? 'Políticas de roles verificadas' : 'RBAC activo en API'
    },
    {
      icono: 'FileClock',
      titulo: 'Bitácora de auditoría',
      estado: reporte ? reporte.estadoBitacora : 'Pendiente de verificar',
      detalle: reporte
        ? `Última revisión: ${new Date(reporte.fechaVerificacion).toLocaleTimeString('es-MX')}`
        : 'Registro automático activo'
    }
  ];

  return (
    <>
      <div className="grid3">
        {indicadores.map(ind => (
          <div key={ind.titulo} className="card pad ind">
            <Icon name={ind.icono} size={26} />
            <b>{ind.titulo}</b>
            <Badge estado={ind.estado} />
            <small style={{ color: 'var(--mut)', textAlign: 'center' }}>{ind.detalle}</small>
          </div>
        ))}
      </div>

      {reporte?.detallesIncidencias?.length > 0 && (
        <div className="card pad" style={{ borderColor: '#c0392b', background: '#fff5f5' }}>
          <b style={{ color: '#9b1c1c' }}>Incidencias detectadas en el repositorio físico:</b>
          <ul style={{ margin: '.5rem 0 0', paddingLeft: '1.2rem', color: '#9b1c1c' }}>
            {reporte.detallesIncidencias.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
