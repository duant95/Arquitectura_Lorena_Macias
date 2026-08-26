'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';
import PMasonry from '../components/PMasonry';

export default function ProyectosView({ projects = [], content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
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
            <Link href={href('/')}>{t('nav.inicio')}</Link> / {t('nav.proyectos')}
          </div>
          <h1
            dangerouslySetInnerHTML={{
              __html: (content.proyectos_hero_titulo || '').replace(/\n/g, '<br />'),
            }}
          />
          <p className="phero__lead" dangerouslySetInnerHTML={{ __html: content.proyectos_hero_lead }} />
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
                  {et.period && <span className="pcoll__period">{et.period}</span>}
                  <h2 className="pcoll__title">{et.label}</h2>
                  {et.blurb && <p className="pcoll__blurb">{et.blurb}</p>}
                </div>
                {et.note && (
                  <p className="pcoll__note reveal">
                    <span className="pcoll__badge">{t('proy.colaboracion')}</span>
                    {et.note}
                  </p>
                )}

                <PMasonry
                  className="reveal"
                  items={items}
                  keyOf={(p) => p.slug}
                  renderItem={(p) => (
                    <Link className="pm-item" href={href(`/proyecto/${p.slug}`)}>
                      {p.cover ? (
                        <img src={p.cover} alt={p.name} />
                      ) : (
                        <div className="ph pm-item__ph" data-ph={p.ph} />
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
                        {p.estado === 'proceso' ? t('proy.estadoProceso') : t('proy.estadoFinalizado')}
                      </span>
                    </Link>
                  )}
                />

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
            {t('proy.ctaEyebrow')}
          </p>
          <h2
            className="h-xl reveal d1"
            style={{ marginBottom: 32 }}
            dangerouslySetInnerHTML={{ __html: t('proy.ctaTitulo') }}
          />
          <button className="btn reveal d2" onClick={open}>
            {t('cta.solicitar')} <span className="arr">→</span>
          </button>
        </div>
      </section>
    </>
  );
}
