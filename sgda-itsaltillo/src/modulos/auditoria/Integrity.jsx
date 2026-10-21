import {Icon,Badge} from '../../core/ui.jsx';
export const Integrity=()=><div className="grid3">{[['ShieldCheck','Integridad de archivos'],['Lock','Control de acceso'],['FileClock','Bitácora de auditoría']].map(([i,t])=><div key={t} className="card pad ind"><Icon n={i} size={26}/><b>{t}</b><Badge s="Pendiente de verificar"/></div>)}</div>;
