import {useState,useEffect,useMemo} from 'react';
import { Icon } from '../../componentes/ui/Icon.jsx';
import { qrSvg, code39Svg } from '../../codes.js';

const sinCodigo='Captura el código de etiqueta o el número de expediente';

export const QRPreview=({on,text})=>{
  const [svg,setSvg]=useState('');
  useEffect(()=>{
    let vivo=true;
    if(on&&text)qrSvg(text,130).then(s=>vivo&&setSvg(s)).catch(()=>vivo&&setSvg(''));
    else setSvg('');
    return()=>{vivo=false};
  },[on,text]);
  return <div className="qr" aria-label="Código QR">
    {svg?<div dangerouslySetInnerHTML={{__html:svg}}/>:<><Icon n="QrCode" size={40}/><small>{on?sinCodigo:'Espacio reservado QR'}</small></>}
  </div>;
};

export const BarcodePreview=({on,text})=>{
  const svg=useMemo(()=>on&&text?code39Svg(text,{alto:50,angosto:1.5,ancho:4}):'',[on,text]);
  return <div className="bar" aria-label="Código de barras">
    {svg?<div style={{maxWidth:'100%',overflow:'hidden'}} dangerouslySetInnerHTML={{__html:svg}}/>:<><div className="bars"/><small>{on?sinCodigo:'Espacio reservado código de barras'}</small></>}
  </div>;
};

export function Marbete({v,fl}){
  const r=(l,x)=><div className="mr"><span>{l}</span><b>{x||'—'}</b></div>;
  const texto=String(v.codigo_etiqueta||v.numero_expediente||'').trim();
  return <div className="card pad marbete"><h3>Marbete / Etiqueta de Expediente</h3>
    {r('Código de etiqueta',v.codigo_etiqueta)}{r('Número de expediente',v.numero_expediente)}{r('Título',v.titulo)}{r('Clasificación',v.clasificacion)}{r('Caja',v.caja)}
    <div className="row"><QRPreview on={fl.QR} text={texto}/><BarcodePreview on={fl.Bar} text={texto}/></div></div>;
}
