import { Icon, Badge } from '../../componentes/ui/index.js';

const INDICADORES = [
  ['ShieldCheck', 'Integridad de archivos'],
  ['Lock', 'Control de acceso'],
  ['FileClock', 'Bitácora de auditoría']
];

export const Integrity = () => (
  <div className="grid3">
    {INDICADORES.map(([icono, titulo]) => (
      <div key={titulo} className="card pad ind">
        <Icon name={icono} size={26} />
        <b>{titulo}</b>
        <Badge estado="Pendiente de verificar" />
      </div>
    ))}
  </div>
);
