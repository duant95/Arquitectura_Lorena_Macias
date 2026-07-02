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

      {/* INTRO + FIRMA */}
      <section className="section">
        <div className="wrap">
          <div className="split split--narrow">
            <div className="reveal">
              <h2
                className="h-lg"
                style={{ marginBottom: 28, maxWidth: '16ch' }}
                dangerouslySetInnerHTML={{ __html: content.nosotros_intro_titulo }}
              />
            </div>
            <div className="reveal d1">
              <p
                className="lead-serif"
                style={{ marginBottom: 26 }}
                dangerouslySetInnerHTML={{ __html: content.nosotros_intro_lead }}
              />
              <p
                style={{ color: 'var(--ink-soft)' }}
                dangerouslySetInnerHTML={{ __html: content.nosotros_intro_texto }}
              />
              <p className="sign" style={{ marginTop: 24 }}>
                Lorena Macías
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MI HISTORIA (editable) */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="split split--narrow">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                Mi historia
              </p>
              <h2 className="h-xl" style={{ maxWidth: '15ch' }}>
                De los edificios en altura a un estudio de autor.
              </h2>
            </div>
            <div className="reveal d1 historia-prose">
              {historia.map((p, i) => (
                <p key={i} className={i === 0 ? 'lead-serif' : ''} style={{ marginBottom: 20 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMAGEN ROMPE */}
      <section
        className="reveal-img"
        style={{ position: 'relative', height: 'clamp(340px,54vh,640px)', overflow: 'hidden' }}
      >
        <Img src={content.nosotros_proceso_imagen} alt="Proceso de diseño" sizes="100vw" />
      </section>

      {/* TRAYECTORIA */}
      <section className="section">
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
        </div>
      </section>

      {/* CITA */}
      <section className="section quote-band">
        <div className="wrap reveal">
          <p className="q">“{content.nosotros_cita}”</p>
          <p className="sign" style={{ marginTop: 36 }}>
            Lorena Macías
          </p>
        </div>
      </section>

      {/* VALORES */}
      <section className="section values-sec">
        <div className="wrap">
          <div className="sec-head reveal" style={{ marginBottom: 52 }}>
            <div className="sec-head__l">
              <span className="eyebrow">Por qué elegirme</span>
              <h2 className="h-xl">Lo que me distingue</h2>
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

      {/* FORMACIÓN Y CAPACIDADES */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="sec-head reveal" style={{ marginBottom: 'clamp(36px,4.5vw,58px)' }}>
            <div className="sec-head__l">
              <span className="eyebrow">Credenciales</span>
              <h2 className="h-xl">Formación &amp; capacidades</h2>
            </div>
          </div>
          <div className="creds reveal d1">
            {(content.formacion || []).map((col, i) => (
              <div className="cred" key={i}>
                <h4>{col.titulo}</h4>
                <ul>
                  {(col.items || []).map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
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
            style={{ color: 'var(--cream)', fontSize: 'clamp(34px,5vw,80px)', marginBottom: 32 }}
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
