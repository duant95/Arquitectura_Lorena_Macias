'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

const FILTERS = [
  { f: 'all', label: 'Todos' },
  { f: 'edificio', label: 'Edificios' },
  { f: 'residencial', label: 'Residencias' },
  { f: 'interior', label: 'Interiorismo' },
  { f: 'nautico', label: 'Náutico' },
  { f: 'paisaje', label: 'Paisajismo' },
];

export default function ProyectosView({ projects = [] }) {
  const { open } = useAgenda();
  const [active, setActive] = useState('all');
  useReveals();

  const visibles = projects.filter((p) => active === 'all' || (p.cat || '').includes(active));

  return (
    <>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> — Proyectos
          </div>
          <h1>Proyectos</h1>
          <p className="phero__lead">
            Una selección de proyectos: edificios, barrios cerrados, residencias, interiorismo y
            diseño náutico. Cada uno, una historia construida con intención.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,72px)' }}>
        <div className="wrap">
          <div className="filters">
            {FILTERS.map((flt) => (
              <button
                key={flt.f}
                className={`filter${active === flt.f ? ' on' : ''}`}
                onClick={() => setActive(flt.f)}
              >
                {flt.label}
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
              No hay proyectos en esta categoría todavía.
            </div>
          ) : (
            <div className="plist" key={active}>
              {visibles.map((p, i) => (
                <Link
                  key={p.slug}
                  className={`prow${i % 2 === 1 ? ' rev' : ''}`}
                  href={`/proyecto/${p.slug}`}
                >
                  <div className="prow__img">
                    {p.cover ? (
                      <img src={p.cover} alt={p.name} />
                    ) : (
                      <div
                        className="ph"
                        data-ph={p.ph}
                        style={{ position: 'absolute', inset: 0 }}
                      />
                    )}
                  </div>
                  <div className="prow__info">
                    <div className="prow__cat">{p.catLabel}</div>
                    <h3 className="prow__name">{p.name}</h3>
                    {p.leadParagraph && (
                      <p
                        className="prow__desc"
                        dangerouslySetInnerHTML={{ __html: p.leadParagraph }}
                      />
                    )}
                    {p.meta?.length > 0 && <div className="prow__meta">{p.meta.join(' · ')}</div>}
                    <span className="link-arrow">
                      Ver proyecto <span className="arr">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
            Solicitar reunión <span className="arr">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
