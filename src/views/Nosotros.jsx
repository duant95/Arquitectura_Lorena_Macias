'use client';

import Link from 'next/link';
import Img from '../components/Img';
import PrensaList from '../components/PrensaList';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

// Íconos de línea para la fila de servicios (heredan el color). Se buscan por nombre.
const SVC_ICONS = {
  Arquitectura: <path d="M4 20V9l8-5 8 5v11 M9 20v-6h6v6" />,
  Interiorismo: (
    <path d="M5 12V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4 M4 12h16a1 1 0 0 1 1 1v4h-2v-2H5v2H3v-4a1 1 0 0 1 1-1z" />
  ),
  'Dirección de Obras': <path d="M3 11a9 9 0 0 1 18 0 M3 11h18v2H3z M12 2v3 M8.5 5.5l1.5 2 M15.5 5.5l-1.5 2" />,
  'Obras y Reformas': <path d="M4 9h16v11H4z M4 9l3-4h10l3 4 M9 9v11 M15 9v11 M4 14h16" />,
  Paisajismo: <path d="M12 21v-6 M12 15c-4 0-6-3-6-7 4 0 6 2 6 4 0-3 2-5 6-5 0 5-2 8-6 8z" />,
  'Diseño Náutico': <path d="M4 14h16l-2 5H6z M12 3v11 M12 6l6 3-6 2 M6 21c1.5-1.5 2.5-1.5 4 0 1.5-1.5 2.5-1.5 4 0" />,
  'Project Management': <path d="M6 3h9l4 4v14H6z M9 3v4h6 M9 12h6 M9 16h6" />,
};
const FALLBACK_ICON = <path d="M4 20V9l8-5 8 5v11 M9 20v-6h6v6" />;

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  useReveals();

  const retrato =
    content.nosotros_retrato_imagen ||
    'https://ydmbkaeovbogevzgdlui.supabase.co/storage/v1/object/public/proyectos/contenido/retrato-lorena.jpg';
  const prensa = (content.prensa || []).filter((p) => p && (p.medio || p.titulo));
  const timeline = content.timeline || [];
  const expImgs = (content.exp_imagenes || []).filter((x) => x && x.imagen);
  const relatos = content.relatos || [];
  const servicios = content.sm_servicios || [];
  const expParrafos = splitParagraphs(content.nosotros_exp_texto);

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="phero sm-hero">
        <div className="phero__in">
          <div className="sm-hero__grid">
            <div className="reveal sm-hero__text">
              <div className="sm-hero__top">
                <p className="kicker">{t('nav.sobre')}</p>
                <h1 className="sm-hero__name">{content.nosotros_hero_nombre}</h1>
                <p className="sm-hero__sub">{content.nosotros_hero_subtitulo}</p>
                <p className="sm-hero__lead">{content.nosotros_hero_bajada}</p>
              </div>
              <div className="sm-hero__stat">
                <span className="sm-hero__statN">{content.nosotros_hero_stat_n}</span>
                <span className="sm-hero__statL">{content.nosotros_hero_stat_l}</span>
              </div>
            </div>
            <div className="sm-hero__media reveal d1">
              <div className="sm-hero__frame">
                <Img src={retrato} alt={content.nosotros_hero_nombre || 'Lorena Macías'} sizes="42vw" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CITA + LÍNEA DE TIEMPO ===================== */}
      <section className="section band band--paper sm-apertura">
        <div className="wrap">
          {content.nosotros_cita_apertura && (
            <p className="sm-cita reveal">{content.nosotros_cita_apertura}</p>
          )}
          {timeline.length > 0 && (
            <div className="sm-timeline reveal d1">
              {timeline.map((h, i) => (
                <div className="sm-tl" key={i}>
                  <span className="sm-tl__yr">{h.yr}</span>
                  <span className="sm-tl__label">{h.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== 2001–2019 · EXPERIENCIA ===================== */}
      <section className="section band band--paper2 sm-exp">
        <div className="wrap sm-exp__grid">
          <div className="sm-exp__text reveal">
            {content.nosotros_exp_periodo && (
              <span className="sm-eyebrow">{content.nosotros_exp_periodo}</span>
            )}
            {content.nosotros_exp_titulo && <h2 className="sm-h2">{content.nosotros_exp_titulo}</h2>}
            {expParrafos.map((p, i) => (
              <p key={i} className="sm-p">
                {p}
              </p>
            ))}
            {content.nosotros_exp_nota && <p className="sm-exp__nota">{content.nosotros_exp_nota}</p>}
          </div>
          {expImgs.length > 0 && (
            <div className="sm-exp__imgs reveal d1">
              {expImgs.map((im, i) => (
                <figure className="sm-shot" key={i}>
                  <div className="sm-shot__frame">
                    <Img src={im.imagen} alt={im.alt || ''} sizes="(max-width:900px) 45vw, 22vw" />
                  </div>
                  {(im.alt || im.sub) && (
                    <figcaption>
                      {im.alt && <span className="sm-shot__t">{im.alt}</span>}
                      {im.sub && <span className="sm-shot__s">{im.sub}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== 2019–HOY · ESTUDIO (relatos) ===================== */}
      <section className="section band band--paper sm-estudio">
        <div className="wrap">
          <div className="sm-estudio__head reveal">
            <div>
              <span className="sm-eyebrow">2019 — Hoy</span>
              <h2 className="sm-h2">Estudio Lorena Macías</h2>
            </div>
            <p className="sm-estudio__kicker">Proyectos que se viven.</p>
          </div>
          <div className="sm-relatos">
            {relatos.map((r, i) => (
              <article className="sm-relato reveal" key={i}>
                <div className="sm-relato__meta">
                  <span className="sm-relato__n">{r.n}</span>
                  <h3 className="sm-relato__t">{r.titulo}</h3>
                </div>
                {r.imagen && (
                  <div className="sm-relato__frame">
                    <Img src={r.imagen} alt={r.titulo || ''} sizes="(max-width:900px) 90vw, 30vw" />
                  </div>
                )}
                {splitParagraphs(r.texto).map((p, j) => (
                  <p key={j} className="sm-relato__p">
                    {p}
                  </p>
                ))}
                {r.slug && (
                  <Link className="sm-relato__link" href={href(`/proyecto/${r.slug}`)}>
                    {t('cta.verProyecto')} <span className="arr">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ÍCONOS DE SERVICIOS ===================== */}
      {servicios.length > 0 && (
        <section className="section band band--paper2 sm-svc">
          <div className="wrap">
            <ul className="sm-svc__list reveal">
              {servicios.map((s, i) => (
                <li className="sm-svc__item" key={i}>
                  <svg className="sm-svc__ic" viewBox="0 0 24 24" aria-hidden="true">
                    {SVC_ICONS[s] || FALLBACK_ICON}
                  </svg>
                  <span className="sm-svc__t">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===================== CIERRE (frase + conocer proyectos) ===================== */}
      {content.nosotros_cierre_frase && (
        <section className="section band band--paper sm-cierre">
          <div className="wrap">
            <p className="sm-cierre__frase reveal">{content.nosotros_cierre_frase}</p>
            <p className="sm-cierre__firma reveal">{content.nosotros_hero_nombre || 'Lorena Macías'}</p>
            {content.nosotros_cierre_invit && (
              <p className="sm-cierre__invit reveal">{content.nosotros_cierre_invit}</p>
            )}
            <Link className="btn sm-cierre__btn reveal" href={href('/proyectos')}>
              {t('cta.conocerProyectos')} <span className="arr">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ===================== PRENSA / NOTAS ===================== */}
      {prensa.length > 0 && (
        <section className="section band band--paper2 sm-prensa">
          <div className="wrap">
            <div className="reveal" style={{ marginBottom: 'clamp(24px,3.5vw,44px)' }}>
              <p className="sm-eyebrow">{t('sobre.reconocimientos')}</p>
              <h2 className="sm-h2">{t('sobre.prensaTitulo')}</h2>
            </div>
            <div className="reveal d1">
              <PrensaList items={prensa} />
            </div>
          </div>
        </section>
      )}

      {/* ===================== CTA FINAL (empezar tu proyecto) ===================== */}
      <section className="section cta-final sm-cta" style={{ textAlign: 'center' }}>
        {content.nosotros_cta_imagen && <Img src={content.nosotros_cta_imagen} alt="" sizes="100vw" />}
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
