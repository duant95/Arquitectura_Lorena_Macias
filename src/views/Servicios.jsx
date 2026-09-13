'use client';

import Link from 'next/link';
import Img from '../components/Img';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';

export default function ServiciosView({ servicios = [], content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  useReveals();

  return (
    <>
      <section className={'phero' + (content.servicios_hero_imagen ? ' phero--image' : '')}>
        {content.servicios_hero_imagen && (
          <Parallax className="phero__bg" src={content.servicios_hero_imagen} strength={8} priority />
        )}
        <div className="phero__in">
          <div className="crumb">
            <Link href={href('/')}>{t('nav.inicio')}</Link> / {t('nav.servicios')}
          </div>
          <h1
            dangerouslySetInnerHTML={{
              __html: (content.servicios_hero_titulo || 'Servicios').replace(/\n/g, '<br />'),
            }}
          />
          <p className="phero__lead" dangerouslySetInnerHTML={{ __html: content.servicios_hero_lead }} />
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          {servicios.map((s, i) => (
            <article key={i} className={`svc-item reveal${i % 2 === 1 ? ' rev' : ''}`}>
              <div className="svc-item__img">
                {s.imagen ? (
                  <Parallax className="svc-item__media" src={s.imagen} alt={s.titulo} strength={8} />
                ) : (
                  <div className="ph" data-ph={s.titulo}></div>
                )}
              </div>
              <div>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.titulo}</h3>
                <p>{s.descripcion}</p>
                {s.incluye?.length > 0 && (
                  <ul>
                    {s.incluye.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                )}
                {s.detalle?.length > 0 && (
                  <details className="svc-more">
                    <summary className="svc-more__toggle">
                      <span>{t('serv.conocerMas')}</span>
                      <span className="svc-more__ic" aria-hidden="true">+</span>
                    </summary>
                    <div className="svc-more__body">
                      <ul className="svc-more__list">
                        {s.detalle.map((d, j) => (
                          <li key={j} className="svc-more__step">
                            {d.titulo && <b className="svc-more__t">{d.titulo}</b>}
                            {d.texto && <span className="svc-more__d">{d.texto}</span>}
                          </li>
                        ))}
                      </ul>
                      {s.nota && <p className="svc-more__nota">{s.nota}</p>}
                    </div>
                  </details>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="section proc">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="eyebrow">{t('serv.metodologia')}</span>
              <h2 className="h-xl">{t('serv.procesoClaro')}</h2>
            </div>
          </div>
          <div className="steps">
            {(content.servicios_pasos || []).map((p, i) => (
              <div className={'step reveal ' + ['', 'd1', 'd2', 'd3'][i % 4]} key={i}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <h4>{p.titulo}</h4>
                <p>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-final" style={{ textAlign: 'center' }}>
        {content.servicios_cta_imagen && (
          <Img src={content.servicios_cta_imagen} alt="" sizes="100vw" />
        )}
        <div className="wrap">
          <p className="kicker reveal" style={{ marginBottom: 20, color: 'var(--sage)' }}>
            {t('serv.ctaEyebrow')}
          </p>
          <h2
            className="h-xl reveal d1"
            style={{ marginBottom: 18, maxWidth: '18ch', marginInline: 'auto', color: 'var(--cream)' }}
            dangerouslySetInnerHTML={{ __html: t('serv.ctaTitulo') }}
          />
          <div
            className="reveal d2"
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 32,
            }}
          >
            <button className="btn btn--light" onClick={open}>
              {t('cta.solicitar')} <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href={href('/contacto')}>
              {t('cta.contacto')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
