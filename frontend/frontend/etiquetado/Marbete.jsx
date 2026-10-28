import {Icon} from '../sgda-itsaltillo/src/core/ui.jsx';
export const QRPreview=({on})=><div className="qr" aria-label="Espacio QR"><Icon n="QrCode" size={40}/><small>{on?'QR listo para generarse':'Espacio reservado QR'}</small></div>;
export const BarcodePreview=({on})=><div className="bar" aria-label="Espacio código de barras"><div className="bars"/><small>{on?'Código de barras listo para generarse':'Espacio reservado código de barras'}</small></div>;
export function Marbete({v,fl}){const r=(l,x)=><div className="mr"><span>{l}</span><b>{x||'—'}</b></div>;
 return <div className="card pad marbete"><h3>Marbete / Etiqueta de Expediente</h3>{r('Código de etiqueta',v.codigo_etiqueta)}{r('Número de expediente',v.numero_expediente)}{r('Título',v.titulo)}{r('Clasificación',v.clasificacion)}{r('Caja',v.caja)}<div className="row"><QRPreview on={fl.QR}/><BarcodePreview on={fl.Bar}/></div></div>}
