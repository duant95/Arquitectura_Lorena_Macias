'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function Etapa({ item }) {
  const [open, setOpen] = useState(false);
  const proyectos = item.proyectos || [];
  const tiene = proyectos.length > 0;

  return (
    <div className="tl__row">
      <div className="tl__yr">{item.yr}</div>
      <div>
        <h4>{item.titulo}</h4>
        {item.descripcion && <p>{item.descripcion}</p>}
        {tiene && (
          <>
            <button
              type="button"
              className="tl__toggle"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {open ? 'Ocultar proyectos' : `Ver proyectos (${proyectos.length})`}
              <ChevronDown size={15} className={open ? 'is-open' : ''} />
            </button>
            <div className={'tl__projects' + (open ? ' open' : '')}>
              <div className="tl__projects__in">
                {proyectos.map((p, i) => (
                  <div className="tl__project" key={i}>
                    <h5>{p.titulo}</h5>
                    {p.descripcion && <p>{p.descripcion}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Trayectoria({ items = [] }) {
  return (
    <div className="tl reveal">
      {items.map((it, i) => (
        <Etapa key={i} item={it} />
      ))}
    </div>
  );
}
