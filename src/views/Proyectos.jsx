'use client';

import Link from 'next/link';
import Img from '../components/Img';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';

// Patrón de proporciones para el collage (desordenado pero armónico).
const RATIOS = ['r-45', 'r-34', 'r-11', 'r-43', 'r-34', 'r-45'];

export default function ProyectosView({ projects = [], content = {} }) {
  const { open } = useAgenda();
  useReveals();
  const etapas =
    Array.isArray(content.etapas) && content.etapas.length ? content.etapas : [];

  return (
    <>
      {/* HERO */}
      <section
        className={'phero' + (content.proyectos_hero_imagen ? ' phero--image' : ' phero--soft')}
      >
        {content.proyectos_hero_imagen && (
          <Parallax className="phero__bg" src={content.proyectos_hero_imagen} strength={8} priority />
        )}
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> / Proyectos
          </div>
          <h1
            dangerouslySetInnerHTML={{
              __html: (content.proyectos_hero_titulo || '').replace(/\n/g, '<br />'),
            }}
          />
          <p className="phero__lead">{content.proyectos_hero_lead}</p>
        </div>
      </section>

      {/* COLECCIONES — una sola página, separadas por título */}
      <section className="section pcolls" style={{ paddingTop: 'clamp(48px,6vw,84px)' }}>
        <div className="wrap">
          {etapas.map((et, ei) => {
            const items = projects.filter((p) => p.etapa === et.key);
            if (items.length === 0) return null;
            return (
              <div className="pcoll" key={et.key}>
                <div className="pcoll__head reveal">
                  <div>
                    {et.period && <span className="pcoll__period">{et.period}</span>}
                    <h2 className="pcoll__title">{et.label}</h2>
                  </div>
                  {et.blurb && <p className="pcoll__blurb">{et.blurb}</p>}
                </div>
                {et.note && (
                  <p className="pcoll__note reveal">
                    <span className="pcoll__badge">Colaboración</span>
                    {et.note}
                  </p>
                )}

                <div className="pmasonry reveal">
                  {items.map((p, i) => (
                    <Link
                      className={`pm-item ${RATIOS[i % RATIOS.length]}`}
                      href={`/proyecto/${p.slug}`}
                      key={p.slug}
                    >
                      {p.cover ? (
                        <Img
                          src={p.cover}
                          alt={p.name}
                          sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="ph" data-ph={p.ph} style={{ position: 'absolute', inset: 0 }} />
                      )}
                      <div className="pm-item__ov">
                        {p.catLabel && <span className="pm-item__cat">{p.catLabel}</span>}
                        <h3 className="pm-item__name">{p.name}</h3>
                        {p.leadParagraph && (
                          <p
                            className="pm-item__desc"
                            dangerouslySetInnerHTML={{ __html: p.leadParagraph }}
                          />
                        )}
                      </div>
                      <span className={`pm-item__estado is-${p.estado}`}>
                        {p.estado === 'proceso' ? 'En proceso' : 'Finalizado'}
                      </span>
                    </Link>
                  ))}
                </div>

                {ei < etapas.length - 1 && <div className="pcoll__spacer" aria-hidden="true" />}
              </div>
            );
          })}
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
