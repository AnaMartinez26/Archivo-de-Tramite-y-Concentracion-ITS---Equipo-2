// Mini-router basado en hash (#/ruta): funciona abriendo el HTML directamente (file://)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  createElement,
  Children,
  isValidElement
} from 'react';

const getPath = () => (location.hash.replace(/^#/, '') || '/').split('?')[0];

const RouterContext = createContext({ path: '/', out: null });

export function HashRouter({ children }) {
  const [path, setPath] = useState(getPath());

  useEffect(() => {
    const alCambiarHash = () => setPath(getPath());
    addEventListener('hashchange', alCambiarHash);
    return () => removeEventListener('hashchange', alCambiarHash);
  }, []);

  return createElement(RouterContext.Provider, { value: { path, out: null } }, children);
}

export const useLocation = () => ({ pathname: useContext(RouterContext).path });

export const useNavigate = () => (to, opciones) => {
  if (opciones?.replace) location.replace('#' + to);
  else location.hash = to;
};

export function Navigate({ to }) {
  useEffect(() => {
    location.replace('#' + to);
  }, [to]);
  return null;
}

export const Link = ({ to, children, ...props }) =>
  createElement('a', { ...props, href: '#' + to }, children);

export function NavLink({ to, children, className, ...props }) {
  const { path } = useContext(RouterContext);
  const activo = path === to;
  const clases = [
    typeof className === 'function' ? className({ isActive: activo }) : className,
    activo ? 'active' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return createElement(
    'a',
    {
      ...props,
      href: '#' + to,
      className: clases || undefined,
      'aria-current': activo ? 'page' : undefined
    },
    children
  );
}

// Muestra la ruta hija dentro de un layout
export const Outlet = () => useContext(RouterContext).out;

// <Route> solo describe la ruta; <Routes> decide cuál mostrar
export const Route = () => null;

export function Routes({ children }) {
  const { path } = useContext(RouterContext);

  const buscar = rutas => {
    let comodin = null;
    for (const ruta of Children.toArray(rutas)) {
      if (!isValidElement(ruta)) continue;
      const { path: rutaPath, element, children: hijas } = ruta.props;

      if (!rutaPath && hijas) {
        // Ruta de layout: si alguna hija coincide, se muestra dentro del layout
        const interna = buscar(hijas);
        if (interna) {
          return createElement(RouterContext.Provider, { value: { path, out: interna } }, element);
        }
      } else if (rutaPath === '*') {
        comodin = element;
      } else if (rutaPath === path) {
        return element;
      }
    }
    return comodin;
  };

  return buscar(children);
}
