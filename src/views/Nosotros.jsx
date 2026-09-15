'use client';

import Link from 'next/link';
import Img from '../components/Img';
import PrensaList from '../components/PrensaList';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  useReveals();

  const etapas = content.trayectoria || [];
  const prensa = (content.prensa || []).filter((p) => p && (p.medio || p.titulo));
  const estudioImgs = content.estudio_imagenes || [];

  return (
    <>
      {/* HERO */}
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href={href('/')}>{t('nav.inicio')}</Link> / {t('nav.sobre')}
          </div>
          <div className={'about-hero' + (content.nosotros_retrato_imagen ? '' : ' about-hero--solo')}>
            <div className="reveal">
              <h1 dangerouslySetInnerHTML={{ __html: content.nosotros_hero_titulo }} />
              <p
                className="phero__lead"
                dangerouslySetInnerHTML={{ __html: content.nosotros_hero_lead }}
              />
              <div className="about-stats">
                {(content.stats || []).map((s, i) => (
                  <div className="about-stat" key={i}>
                    <span className="about-stat__n">{s.n}</span>
                    <span className="about-stat__l">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            {content.nosotros_retrato_imagen && (
              <div className="imgblock about-portrait reveal-img reveal d1">
                <Img src={content.nosotros_retrato_imagen} alt="Lorena Macías" sizes="40vw" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EL ESTUDIO — texto a la izquierda + 2 imágenes */}
      <section className="section estudio-band">
        <div className="wrap estudio-grid">
          <div className="estudio reveal">
            <p className="kicker">{t('sobre.elEstudio')}</p>
            <h2
              className="estudio__title"
              dangerouslySetInnerHTML={{ __html: content.nosotros_estudio_titulo }}
            />
            <p
              className="estudio__text"
              dangerouslySetInnerHTML={{ __html: content.nosotros_estudio_texto }}
            />
            <div className="estudio__focos">
              <span>{t('sobre.focosResidencial')}</span>
              <span>{t('sobre.focosComercial')}</span>
              <span>{t('sobre.focosCorporativo')}</span>
            </div>
          </div>
          {estudioImgs.length > 0 && (
            <div className="estudio-imgs reveal d1">
              {estudioImgs.slice(0, 2).map((src, i) => (
                <div className="estudio-img" key={i}>
                  <Img src={src} alt="" sizes="(max-width:900px) 50vw, 30vw" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MI RECORRIDO — etapas cronológicas: texto (izq) + imágenes (der) */}
      <section className="section recorrido">
        <div className="wrap">
          <div className="reveal recorrido__head">
            <p className="kicker">{t('sobre.miRecorrido')}</p>
            <h2 className="h-xl recorrido__title">{t('sobre.recorridoTitulo')}</h2>
            <p className="recorrido__lead">{t('sobre.recorridoLead')}</p>
          </div>

          <div className="etapas">
            {etapas.map((et, i) => {
              const imgs = Array.isArray(et.imagenes) ? et.imagenes.filter((x) => x && (x.imagen || x.url)) : [];
              const parrafos = splitParagraphs(et.descripcion);
              const pilares = Array.isArray(et.pilares) ? et.pilares.filter(Boolean) : [];
              return (
                <article className={'etapa reveal' + (imgs.length > 4 ? ' etapa--amplia' : '')} key={i}>
                  <div className="etapa__text">
                    <div className="etapa__meta">
                      <span className="etapa__n">{String(i + 1).padStart(2, '0')}</span>
                      {et.yr && <span className="etapa__yr">{et.yr}</span>}
                    </div>
                    {et.titulo && <h3 className="etapa__title">{et.titulo}</h3>}
                    {parrafos.map((p, j) => (
                      <p key={j} className="etapa__p" dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                    {pilares.length > 0 && (
                      <ul className="etapa__pilares">
                        {pilares.map((p, k) => (
                          <li key={k}>{p}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {imgs.length > 0 && (
                    <div className="etapa__imgs" data-count={Math.min(imgs.length, 6)}>
                      {imgs.map((im, k) => (
                        <figure className="etapa__img" key={k}>
                          <div className="etapa__img__frame">
                            <Img
                              src={im.imagen || im.url}
                              alt={im.alt || ''}
                              sizes="(max-width:900px) 50vw, 30vw"
                            />
                          </div>
                          {im.alt && <figcaption>{im.alt}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {content.nosotros_cita && (
            <div className="recorrido__cierre reveal">
              <p
                className="quiensoy__cita"
                dangerouslySetInnerHTML={{ __html: content.nosotros_cita }}
              />
              <p className="recorrido__invit">{t('sobre.recorridoInvitacion')}</p>
              <Link className="btn" href={href('/proyectos')}>
                {t('cta.conocerProyectos')} <span className="arr">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* PRENSA / RECONOCIMIENTOS */}
      {prensa.length > 0 && (
        <section className="section prensa">
          <div className="wrap">
            <div className="reveal" style={{ marginBottom: 'clamp(28px,4vw,52px)' }}>
              <p className="kicker">{t('sobre.reconocimientos')}</p>
              <h2 className="h-xl" style={{ marginTop: 12 }}>
                {t('sobre.prensaTitulo')}
              </h2>
            </div>
            <div className="reveal d1">
              <PrensaList items={prensa} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section cta-final" style={{ textAlign: 'center' }}>
        <Img src={content.nosotros_cta_imagen} alt="" sizes="100vw" />
        <div className="wrap">
          <h2
            className="display reveal"
            style={{ color: 'var(--cream)', fontSize: 'clamp(28px,4vw,58px)', marginBottom: 30 }}
            dangerouslySetInnerHTML={{ __html: t('sobre.ctaTitulo') }}
          />
          <div
            className="reveal d1"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              {t('cta.solicitar')} <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href={href('/proyectos')}>
              {t('cta.verProyectos')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
