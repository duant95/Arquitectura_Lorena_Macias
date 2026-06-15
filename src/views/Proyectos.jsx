'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function ProyectosView({ projects = [] }) {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> — Proyectos
          </div>
          <h1>Proyectos</h1>
          <p className="phero__lead">
            Una selección de proyectos: arquitectura, interiores, reformas y paisajismo. Cada uno,
            una historia construida con intención.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(40px,5vw,72px)' }}>
        <div className="wrap">
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
              Todavía no hay proyectos publicados.
            </div>
          ) : (
            <div className="plist">
              {projects.map((p, i) => (
                <Link
                  key={p.slug}
                  className={`prow reveal${i % 2 === 1 ? ' rev' : ''}`}
                  href={`/proyecto/${p.slug}`}
                >
                  <div className="prow__img reveal-img">
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
