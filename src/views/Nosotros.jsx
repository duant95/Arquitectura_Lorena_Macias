'use client';

import Link from 'next/link';
import Img from '../components/Img';
import Trayectoria from '../components/Trayectoria';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      {/* HERO */}
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> / Nosotros
          </div>
          <div className="about-hero">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                El estudio
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
              <h2 className="h-lg" style={{ marginBottom: 28, maxWidth: '16ch' }}>
                Una mirada que combina técnica, sensibilidad y trayectoria.
              </h2>
            </div>
            <div className="reveal d1">
              <p className="lead-serif" style={{ marginBottom: 26 }}>
                Mi trabajo es <em>funcional</em>, <em>sofisticado</em> y <em>práctico</em>. Cada
                proyecto es una conversación con el lugar, la luz y las personas que lo van a
                habitar.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                Diseño, documento, dirijo y vendo: una visión integral del proyecto que me permite
                cuidar tu inversión en cada etapa, desde la primera idea hasta la entrega de obra.
              </p>
              <p className="sign" style={{ marginTop: 24 }}>
                Lorena Macías
              </p>
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
              <h2 className="h-xl">25 años de trayectoria</h2>
            </div>
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
            <div className="pillar">
              <span className="n">01</span>
              <h4>Project Management</h4>
              <p>
                Coordino proyectos de alta complejidad con múltiples equipos, controlando plazos,
                costos y calidad.
              </p>
            </div>
            <div className="pillar">
              <span className="n">02</span>
              <h4>Visión integral</h4>
              <p>
                Diseño, documento, dirijo y vendo: cuido tu inversión en cada etapa del proyecto.
              </p>
            </div>
            <div className="pillar">
              <span className="n">03</span>
              <h4>Diseño náutico</h4>
              <p>Primera arquitecta en Paraguay en diseñar interiores de yates.</p>
            </div>
            <div className="pillar">
              <span className="n">04</span>
              <h4>Equipo &amp; tecnología</h4>
              <p>Equipo BIM propio (Revit · Navisworks) para proyectos de gran escala.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="eyebrow">Cómo trabajamos</span>
              <h2 className="h-xl">El proceso</h2>
            </div>
          </div>
          <div className="steps reveal d1">
            <div className="step">
              <div className="n">01</div>
              <h4>Escuchar</h4>
              <p>Entendemos tu idea, tu forma de habitar y tu presupuesto.</p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>Diseñar</h4>
              <p>Anteproyecto, materialidad y renders para visualizar tu futuro espacio.</p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>Construir</h4>
              <p>Documentación ejecutiva y dirección de obra con estándares de calidad.</p>
            </div>
            <div className="step">
              <div className="n">04</div>
              <h4>Habitar</h4>
              <p>Entregamos un espacio listo para vivirse, hasta el último detalle.</p>
            </div>
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
