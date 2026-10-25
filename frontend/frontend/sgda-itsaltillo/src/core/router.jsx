// Mini-router basado en hash (#/ruta): funciona abriendo el HTML directamente (file://)
import {createContext,useContext,useState,useEffect,createElement,Children,isValidElement,cloneElement} from 'react';
const getPath=()=>(location.hash.replace(/^#/,'')||'/').split('?')[0];
const Ctx=createContext({path:'/',out:null});
export function HashRouter({children}){const [path,setPath]=useState(getPath());
 useEffect(()=>{const h=()=>setPath(getPath());addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[]);
 return createElement(Ctx.Provider,{value:{path,out:null}},children)}
export const useLocation=()=>({pathname:useContext(Ctx).path});
export const useNavigate=()=>(to,o)=>{if(o&&o.replace)location.replace('#'+to);else location.hash=to};
export const Navigate=({to})=>{useEffect(()=>{location.replace('#'+to)},[to]);return null};
export const Link=({to,children,...p})=>createElement('a',{...p,href:'#'+to},children);
export const NavLink=({to,children,className,...p})=>{const {path}=useContext(Ctx);const act=path===to;
 return createElement('a',{...p,href:'#'+to,className:[typeof className==='function'?className({isActive:act}):className,act?'active':''].filter(Boolean).join(' ')||undefined,'aria-current':act?'page':undefined},children)};
export const Outlet=()=>useContext(Ctx).out;
export const Route=()=>null;
export function Routes({children}){const {path}=useContext(Ctx);
 const match=(list)=>{let star=null;for(const r of Children.toArray(list)){if(!isValidElement(r))continue;const {path:p,element,children:ch}=r.props;
   if(!p&&ch){const inner=match(ch);if(inner)return createElement(Ctx.Provider,{value:{path,out:inner}},element)}
   else if(p==='*')star=element;else if(p===path)return element}
  return star};
 return match(children)}
