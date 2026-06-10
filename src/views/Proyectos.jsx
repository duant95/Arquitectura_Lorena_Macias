'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { PROJECTS } from '../data/projects';

const FILTERS = [
  { f: 'all', label: 'Todos' },
  { f: 'vivienda', label: 'Viviendas' },
  { f: 'reforma', label: 'Reformas & ampliaciones' },
  { f: 'interior', label: 'Diseño de interiores' },
  { f: 'paisaje', label: 'Paisajismo' },
  { f: 'obra', label: 'Obras' },
];

export default function Proyectos() {
  const { open } = useAgenda();
  const [active, setActive] = useState('all');
  useReveals([active]);

  const isVisible = (card) => active === 'all' || card.cat.includes(active);
  const shown = PROJECTS.filter(isVisible).length;

  return (
    <>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> — Proyectos
          </div>
          <h1>Portafolio</h1>
          <p className="phero__lead">
            Una selección de viviendas, reformas, interiores y paisajismo. Cada obra, una historia
            construida con intención.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(44px,5vw,68px)' }}>
        <div className="wrap">
          <div className="filters reveal">
            {FILTERS.map((flt) => (
              <button
                key={flt.f}
                className={`filter${active === flt.f ? ' on' : ''}`}
                data-f={flt.f}
                onClick={() => setActive(flt.f)}
              >
                {flt.label}
              </button>
            ))}
          </div>

          <div className="pgrid" id="pgrid" key={active}>
            {PROJECTS.map((card) => (
              <Link
                key={card.slug}
                className={`pcard ${card.span}${isVisible(card) ? '' : ' is-hidden'}`}
                data-cat={card.cat}
                href={`/proyecto/${card.slug}`}
              >
                <div className="pcard__media">
                  <span className="pcard__idx">{card.idx}</span>
                  <div className="pcard__go">↗</div>
                  {card.cover ? (
                    <img src={card.cover} alt={card.name} />
                  ) : (
                    <div className="ph" data-ph={card.ph}></div>
                  )}
                </div>
                <div className="pcard__cap">
                  <div>
                    <div className="pcard__cat">{card.catLabel}</div>
                    <div className="pcard__name">{card.name}</div>
                  </div>
                  <div className="pcard__meta">
                    {card.meta.map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div
            id="empty"
            style={{
              display: shown ? 'none' : 'block',
              textAlign: 'center',
              padding: '60px 0',
              color: 'var(--ink-soft)',
            }}
          >
            No hay proyectos en esta categoría todavía.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--green-wash)', textAlign: 'center' }}>
        <div className="wrap">
          <p className="eyebrow reveal" style={{ marginBottom: 22 }}>
            ¿Tu proyecto es el próximo?
          </p>
          <h2 className="h-xl reveal d1" style={{ marginBottom: 32 }}>
            Diseñemos algo <em>único</em>, juntos.
          </h2>
          <button className="btn reveal d2" onClick={open}>
            Agendar reunión <span className="arr">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
