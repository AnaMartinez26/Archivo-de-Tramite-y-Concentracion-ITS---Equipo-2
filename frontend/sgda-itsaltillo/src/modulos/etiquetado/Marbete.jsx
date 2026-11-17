import { Icon } from '../../componentes/ui/index.js';

export const QRPreview = ({ on }) => (
  <div className="qr" aria-label="Espacio QR">
    <Icon name="QrCode" size={40} />
    <small>{on ? 'QR listo para generarse' : 'Espacio reservado QR'}</small>
  </div>
);

export const BarcodePreview = ({ on }) => (
  <div className="bar" aria-label="Espacio código de barras">
    <div className="bars" />
    <small>
      {on ? 'Código de barras listo para generarse' : 'Espacio reservado código de barras'}
    </small>
  </div>
);

export function Marbete({ v, fl }) {
  const fila = (etiqueta, valor) => (
    <div className="mr">
      <span>{etiqueta}</span>
      <b>{valor || '—'}</b>
    </div>
  );

  return (
    <div className="card pad marbete">
      <h3>Marbete / Etiqueta de Expediente</h3>
      {fila('Código de etiqueta', v.codigo_etiqueta)}
      {fila('Número de expediente', v.numero_expediente)}
      {fila('Título', v.titulo)}
      {fila('Clasificación', v.clasificacion)}
      {fila('Caja', v.caja)}
      <div className="row">
        <QRPreview on={fl.QR} />
        <BarcodePreview on={fl.Bar} />
      </div>
    </div>
  );
}
