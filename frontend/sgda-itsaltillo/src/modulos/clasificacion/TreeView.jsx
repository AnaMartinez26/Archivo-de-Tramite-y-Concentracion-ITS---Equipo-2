import { Icon } from '../../componentes/ui/index.js';

const NIVELES = ['Fondo', 'Sección', 'Serie', 'Subserie'];

export function TreeView({ rows }) {
  const hijos = padre => rows.filter(r => (r.padre || '') === padre);

  const recorrer = (padre, prof) =>
    hijos(padre).flatMap(r => [
      <li key={r.id} style={{ marginLeft: prof * 22 }}>
        <span className="lv">
          <Icon name={prof ? 'CornerDownRight' : 'Folder'} /> {NIVELES[Math.min(prof, 3)]}
        </span>
        <b className="node">{r.nombre}</b>
      </li>,
      ...recorrer(r.nombre, prof + 1)
    ]);

  const nodos = recorrer('', 0);

  return (
    <div className="card pad">
      <h3>Estructura archivística</h3>
      <ul className="tree">
        {nodos.length
          ? nodos
          : NIVELES.map((nivel, i) => (
              <li key={nivel} style={{ marginLeft: i * 22 }}>
                <span className="lv">
                  <Icon name={i ? 'CornerDownRight' : 'Folder'} /> {nivel}
                </span>
                <em className="ph">[ {nivel} sin definir ]</em>
              </li>
            ))}
      </ul>
    </div>
  );
}
