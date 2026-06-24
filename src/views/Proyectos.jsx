'use client';

import { useState } from 'react';
import Link from 'next/link';
import Img from '../components/Img';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';

const FILTERS = [
  { f: 'all', label: 'Todos' },
  { f: 'edificio', label: 'Edificios' },
  { f: 'residencial', label: 'Residencias' },
  { f: 'interior', label: 'Interiorismo' },
  { f: 'nautico', label: 'Náutico' },
  { f: 'paisaje', label: 'Paisajismo' },
];

const STAGES = {
  propio: {
    key: 'propio',
    label: 'Estudio propio',
    period: '2019 — presente',
    blurb:
      'Mi estudio de autor. Diseño, documento, dirijo y vendo cada proyecto de principio a fin: barrios cerrados, residencias premium, interiorismo y diseño náutico.',
  },
  gustafson: {
    key: 'gustafson',
    label: 'Gustafson y Asociados',
    period: '2001 — 2019',
    blurb:
      'Mi etapa como Gerente de Proyectos en Gustafson y Asociados, donde ayudé a definir el estándar residencial premium de altura de Asunción.',
    note: 'Obras realizadas en colaboración. La propiedad intelectual corresponde al estudio.',
  },
};

export default function ProyectosView({ projects = [], content = {} }) {
  const { open } = useAgenda();
  const [stage, setStage] = useState('propio');
  const [active, setActive] = useState('all');
  useReveals();

  const countByStage = {
    propio: projects.filter((p) => p.etapa === 'propio').length,
    gustafson: projects.filter((p) => p.etapa === 'gustafson').length,
  };
  const st = STAGES[stage];
  const visibles = projects.filter(
    (p) => p.etapa === stage && (active === 'all' || (p.cat || '').includes(active))
  );

  function pickStage(k) {
    setStage(k);
    setActive('all');
  }

  return (
    <>
      {/* HERO */}
      <section className={'phero' + (content.proyectos_hero_imagen ? ' phero--image' : ' phero--soft')}>
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

      {/* SELECTOR DE ETAPA */}
      <div className="pstage-bar">
        <div className="wrap">
          <div className="pstage-tabs" role="tablist">
            {Object.values(STAGES).map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={stage === s.key}
                className={`pstage-tab${stage === s.key ? ' on' : ''}`}
                onClick={() => pickStage(s.key)}
              >
                <span className="pstage-tab__label">{s.label}</span>
                <span className="pstage-tab__meta">
                  {s.period} · {countByStage[s.key]} proyectos
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ENCABEZADO DE LA ETAPA */}
      <section className="section pstage" style={{ paddingTop: 'clamp(48px,6vw,88px)' }}>
        <div className="wrap">
          <div className="pstage__head" key={stage}>
            <div className="pstage__period">{st.period}</div>
            <div className="pstage__intro">
              <h2 className="pstage__title">{st.label}</h2>
              <p className="pstage__blurb">{st.blurb}</p>
              {st.note && (
                <p className="pstage__note">
                  <span className="pstage__badge">Colaboración</span>
                  {st.note}
                </p>
              )}
            </div>
          </div>

          <div className="filters pstage__filters">
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
            <div className="plist" key={stage + active}>
              {visibles.map((p, i) => (
                <Link
                  key={p.slug}
                  className={`prow${i % 2 === 1 ? ' rev' : ''}`}
                  href={`/proyecto/${p.slug}`}
                >
                  <div className="prow__img">
                    <span className="prow__idx">{String(i + 1).padStart(2, '0')}</span>
                    {p.cover ? (
                      <Img src={p.cover} alt={p.name} sizes="(max-width: 880px) 100vw, 50vw" />
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
