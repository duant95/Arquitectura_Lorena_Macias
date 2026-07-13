'use client';

import Link from 'next/link';
import Img from '../components/Img';
import Trayectoria from '../components/Trayectoria';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
  useReveals();

  const historia = splitParagraphs(content.nosotros_historia);
  const collage = content.historia_imagenes || [];
  const prensa = (content.prensa || []).filter((p) => p && (p.medio || p.titulo));

  return (
    <>
      {/* HERO */}
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> / Sobre mí
          </div>
          <div className="about-hero">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                Sobre mí
              </p>
              <h1 dangerouslySetInnerHTML={{ __html: content.nosotros_hero_titulo }} />
              <p className="phero__lead">{content.nosotros_hero_lead}</p>
            </div>
            <div className="imgblock about-portrait reveal-img reveal d1">
              {content.nosotros_retrato_imagen ? (
                <Img src={content.nosotros_retrato_imagen} alt="Lorena Macías" sizes="40vw" />
              ) : (
                <div
                  className="ph"
                  style={{ position: 'absolute', inset: 0 }}
                  data-ph="Retrato de Lorena"
                ></div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO — banda editorial con imagen de fondo */}
      <section className="about-band">
        {content.nosotros_intro_imagen ? (
          <Img src={content.nosotros_intro_imagen} alt="" sizes="100vw" priority />
        ) : (
          <div className="ph" style={{ position: 'absolute', inset: 0 }} data-ph="Imagen" />
        )}
        <div className="wrap about-band__in reveal">
          <h2
            className="about-band__title"
            dangerouslySetInnerHTML={{ __html: content.nosotros_intro_titulo }}
          />
          <p
            className="about-band__lead"
            dangerouslySetInnerHTML={{ __html: content.nosotros_intro_lead }}
          />
          <p
            className="about-band__text"
            dangerouslySetInnerHTML={{ __html: content.nosotros_intro_texto }}
          />
          <p className="sign sign--light">Lorena Macías</p>
        </div>
      </section>

      {/* MI HISTORIA — collage + relato (sin encabezado) */}
      <section className="section">
        <div className="wrap">
          <div className="historia">
            <div className="historia__collage reveal">
              {collage.slice(0, 4).map((im, i) => (
                <div className={`historia__cell hc-${i}`} key={i}>
                  {im.imagen ? (
                    <Img src={im.imagen} alt={im.alt || ''} sizes="(max-width:900px) 50vw, 30vw" />
                  ) : (
                    <div className="ph" style={{ position: 'absolute', inset: 0 }} data-ph="Foto" />
                  )}
                </div>
              ))}
            </div>
            <div className="historia__text reveal d1">
              {historia.map((p, i) => (
                <p key={i} className={i === 0 ? 'lead-serif' : ''} style={{ marginBottom: 20 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRAYECTORIA */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="eyebrow">Trayectoria</span>
              <h2 className="h-xl">De 2001 a hoy</h2>
            </div>
            <p style={{ maxWidth: 360, color: 'var(--ink-soft)', margin: 0 }}>
              Las etapas de mi camino, con sus proyectos. Tocá cada período para ver las obras.
            </p>
          </div>
          <Trayectoria items={content.trayectoria || []} />
          <div className="reveal" style={{ marginTop: 'clamp(30px,4vw,52px)' }}>
            <Link className="link-arrow" href="/proyectos">
              Ver proyectos más representativos <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* EL ESTUDIO — institucional */}
      <section className="section">
        <div className="wrap">
          <div className="split split--narrow">
            <div className="reveal">
              <span className="eyebrow" style={{ display: 'block', marginBottom: 20 }}>
                El estudio
              </span>
              <h2 className="h-lg" style={{ maxWidth: '14ch' }}>
                {content.nosotros_estudio_titulo}
              </h2>
            </div>
            <div className="reveal d1">
              <p style={{ color: 'var(--ink-soft)' }}>{content.nosotros_estudio_texto}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRENSA */}
      {prensa.length > 0 && (
        <section className="section prensa" style={{ background: 'var(--paper-2)' }}>
          <div className="wrap">
            <div className="sec-head reveal" style={{ marginBottom: 'clamp(36px,4.5vw,58px)' }}>
              <div className="sec-head__l">
                <span className="eyebrow">Prensa</span>
                <h2 className="h-xl">En los medios</h2>
              </div>
            </div>
            <div className="prensa__grid reveal d1">
              {prensa.map((p, i) => (
                <article className="prensa__card" key={i}>
                  <div className="prensa__media">
                    {p.imagen ? (
                      <Img src={p.imagen} alt={p.medio || ''} sizes="(max-width:900px) 100vw, 25vw" />
                    ) : (
                      <div className="ph" style={{ position: 'absolute', inset: 0 }} data-ph={p.medio || 'Medio'} />
                    )}
                  </div>
                  <div className="prensa__body">
                    {p.medio && <span className="prensa__medio">{p.medio}</span>}
                    {p.titulo && <h4 className="prensa__title">{p.titulo}</h4>}
                    {p.descripcion && <p className="prensa__desc">{p.descripcion}</p>}
                    <div className="prensa__foot">
                      {p.fecha && <span className="prensa__fecha">{p.fecha}</span>}
                      {p.url && (
                        <a
                          className="link-arrow"
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver publicación <span className="arr">→</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARQUITECTURA CON VISIÓN INTEGRAL (diferenciadores) */}
      <section className="section values-sec">
        <div className="wrap">
          <div className="sec-head reveal" style={{ marginBottom: 52 }}>
            <div className="sec-head__l">
              <span className="eyebrow">Mi enfoque</span>
              <h2 className="h-xl">Arquitectura con visión integral</h2>
            </div>
          </div>
          <div className="pillars reveal d1">
            {(content.pilares || []).map((p, i) => (
              <div className="pillar" key={i}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <h4>{p.titulo}</h4>
                <p>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-final" style={{ textAlign: 'center' }}>
        <Img src={content.nosotros_cta_imagen} alt="" sizes="100vw" />
        <div className="wrap">
          <h2
            className="display reveal"
            style={{ color: 'var(--cream)', fontSize: 'clamp(30px,4.4vw,70px)', marginBottom: 32 }}
          >
            ¿Empezamos tu <em>proyecto</em>?
          </h2>
          <div
            className="reveal d1"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              Solicitar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href="/proyectos">
              Ver proyectos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
