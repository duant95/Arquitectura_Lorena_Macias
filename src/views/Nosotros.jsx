'use client';

import Link from 'next/link';
import Img from '../components/Img';
import CarruselLinea from '../components/CarruselLinea';
import PrensaList from '../components/PrensaList';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

// Íconos de línea para la fila de "valores" (minimalistas, heredan el color).
const VAL_ICONS = [
  // Diseño integral (cubo)
  <path key="a" d="M12 3l7 4v10l-7 4-7-4V7z M12 3v18 M5 7l7 4 7-4" />,
  // Soluciones técnicas (capas)
  <path key="b" d="M12 4l8 4-8 4-8-4z M4 12l8 4 8-4 M4 16l8 4 8-4" />,
  // Acompañamiento en obra (compás)
  <path key="c" d="M12 4v5 M10.5 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0 M11 8L6 20 M13 8l5 12" />,
  // Entorno y paisajismo (hoja)
  <path key="d" d="M6 19c0-7 5-12 12-12 0 7-5 12-12 12z M6 19c3-4 6-6 9-7" />,
  // Experiencia del usuario (persona)
  <path key="e" d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M5 20c0-4 3.5-6 7-6s7 2 7 6" />,
  // Valor a largo plazo (crecimiento)
  <path key="f" d="M4 20h16 M7 20v-6 M12 20V8 M17 20v-9 M5 9l4-4 3 3 5-6" />,
];

export default function Nosotros({ content = {}, obras = [] }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  useReveals();

  const etapas = content.trayectoria || [];
  const prensa = (content.prensa || []).filter((p) => p && (p.medio || p.titulo));
  const estudioImgs = content.estudio_imagenes || [];

  const imgsDe = (et) =>
    Array.isArray(et?.imagenes) ? et.imagenes.filter((x) => x && (x.imagen || x.url)) : [];

  // Bloque de una etapa: texto (izq) + imágenes (der). `gridImgs` limita cuántas van en la grilla.
  const Etapa = (et, num, variant, gridImgs) => {
    if (!et) return null;
    const parrafos = splitParagraphs(et.descripcion);
    const pilares = Array.isArray(et.pilares) ? et.pilares.filter(Boolean) : [];
    return (
      <article className={'etapa reveal etapa--' + variant}>
        <div className="etapa__text">
          <div className="etapa__meta">
            <span className="etapa__n">{num}</span>
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
        {gridImgs.length > 0 && (
          <div className="etapa__imgs">
            {gridImgs.map((im, k) => (
              <figure className="etapa__img" key={k}>
                <div className="etapa__img__frame">
                  <Img
                    src={im.imagen || im.url}
                    alt={im.alt || ''}
                    sizes="(max-width:900px) 50vw, 30vw"
                  />
                </div>
                {(im.alt || im.sub) && (
                  <figcaption>
                    {im.alt && <span className="cap-name">{im.alt}</span>}
                    {im.sub && <span className="cap-sub">{im.sub}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </article>
    );
  };

  const estudioImgsRecorrido = imgsDe(etapas[1]);
  const grid03 = estudioImgsRecorrido.slice(0, 3);
  // Carrusel: portadas reales de las obras (fallback a las imágenes sobrantes de la etapa).
  const carruselObras = obras.length ? obras : estudioImgsRecorrido.slice(3);

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

      {/* RECORRIDO · 01 Gustafson (collage) */}
      <section className="section band band--paper2 rec-01">
        <div className="wrap">
          <div className="reveal recorrido__head">
            <div>
              <p className="kicker">{t('sobre.miRecorrido')}</p>
              <h2 className="h-xl recorrido__title">{t('sobre.recorridoTitulo')}</h2>
              <p className="recorrido__lead">{t('sobre.recorridoLead')}</p>
            </div>
            <ul className="recorrido__rail" aria-hidden="true">
              {t('sobre.rail')
                .split('·')
                .map((w, i) => (
                  <li key={i}>{w.trim()}</li>
                ))}
            </ul>
          </div>
          {Etapa(etapas[0], '01', 'collage', imgsDe(etapas[0]).slice(0, 3))}
        </div>
      </section>

      {/* TRANSICIÓN · 02 — banda arena */}
      {content.nosotros_transicion && (
        <section className="section band band--sand rec-transicion">
          <div className="wrap">
            <div className="transicion reveal">
              {content.nosotros_retrato_imagen && (
                <div className="transicion__img">
                  <div className="etapa__img__frame">
                    <Img src={content.nosotros_retrato_imagen} alt="Lorena Macías" sizes="30vw" />
                  </div>
                </div>
              )}
              <div className="transicion__body">
                <div className="etapa__meta">
                  <span className="etapa__n">02</span>
                  <span className="etapa__yr">2019</span>
                </div>
                <h3 className="transicion__title">{t('sobre.nuevoCapitulo')}</h3>
                <p
                  className="etapa__p"
                  dangerouslySetInnerHTML={{ __html: content.nosotros_transicion }}
                />
              </div>
              <p className="transicion__hand">{t('sobre.transicionCita')}</p>
            </div>
          </div>
        </section>
      )}

      {/* RECORRIDO · 03 Estudio (grilla 3 + carrusel de portadas) */}
      <section className="section band band--paper rec-03">
        <div className="wrap">{Etapa(etapas[1], '03', 'grid', grid03)}</div>
        {carruselObras.length > 0 && (
          <div className="rec-carrusel reveal">
            <CarruselLinea imagenes={carruselObras} />
          </div>
        )}
      </section>

      {/* VALORES */}
      {(content.pilares || []).length > 0 && (
        <section className="section band band--paper2 rec-valores">
          <div className="wrap">
            <ul className="valores reveal">
              {content.pilares.map((p, i) => (
                <li className="valor" key={i}>
                  <svg className="valor__ic" viewBox="0 0 24 24" aria-hidden="true">
                    {VAL_ICONS[i % VAL_ICONS.length]}
                  </svg>
                  <span className="valor__t">{p.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CIERRE — banda arena */}
      {content.nosotros_cita && (
        <section className="section band band--sand rec-cierre">
          <div className="wrap">
            <div className="recorrido__cierre reveal">
              <p
                className="quiensoy__cita"
                dangerouslySetInnerHTML={{ __html: content.nosotros_cita }}
              />
              <p className="recorrido__firma">Lorena Macías</p>
              <p className="recorrido__invit">{t('sobre.recorridoInvitacion')}</p>
              <Link className="btn" href={href('/proyectos')}>
                {t('cta.conocerProyectos')} <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

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
