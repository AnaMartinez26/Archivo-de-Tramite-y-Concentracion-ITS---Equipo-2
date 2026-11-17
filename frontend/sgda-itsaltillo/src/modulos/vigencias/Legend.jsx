import { Badge } from '../../componentes/ui/index.js';

export const Legend = () => (
  <div className="card pad row wrap">
    <b>Semáforo de vigencia:</b>
    <Badge estado="Vigente" />
    <Badge estado="Próximo a vencer" />
    <Badge estado="Vencido" />
  </div>
);
