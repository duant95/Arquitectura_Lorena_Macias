'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function Nosotros() {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      {/* HERO */}
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> — Nosotros
          </div>
          <div className="about-hero">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                El estudio
              </p>
              <h1>
                Diseñar es
                <br />
                <em>escuchar</em>.
              </h1>
              <p className="phero__lead">
                Soy Lorena Macías, arquitecta. Hace más de dos décadas que acompaño a las personas a
                transformar terrenos e ideas en hogares con identidad, calidez y propósito.
              </p>
            </div>
            <div className="imgblock about-portrait reveal-img reveal d1">
              <div
                className="ph"
                style={{ position: 'absolute', inset: 0 }}
                data-ph="Retrato de Lorena"
              ></div>
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
                Una mirada que combina técnica, sensibilidad y oficio.
              </h2>
            </div>
            <div className="reveal d1">
              <p className="lead-serif" style={{ marginBottom: 26 }}>
                Mi trabajo nace del equilibrio entre lo <em>funcional</em> y lo <em>emocional</em>.
                Cada proyecto es una conversación con el lugar, la luz y las personas que lo van a
                habitar.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                Creo en una arquitectura honesta, en los materiales nobles y en los espacios
                pensados para vivirse plenamente. Mi compromiso es acompañar cada etapa, desde la
                primera idea hasta el último detalle de obra.
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
        style={{ height: 'clamp(340px,54vh,640px)', overflow: 'hidden' }}
      >
        <img
          src="/assets/img/proceso.jpg"
          alt="Proceso de diseño"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </section>

      {/* TRAYECTORIA */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="eyebrow">Trayectoria</span>
              <h2 className="h-xl">25 años de oficio</h2>
            </div>
            <p style={{ maxWidth: 380, color: 'var(--ink-soft)', margin: 0 }}>
              De la gran escala constructiva al estudio de autor: un camino que une experiencia
              técnica y diseño personalizado.
            </p>
          </div>
          <div className="tl reveal">
            <div className="tl__row">
              <div className="tl__yr">2001 — 2019</div>
              <div>
                <h4>18 años en empresa constructora</h4>
                <p>
                  Casi dos décadas participando en proyectos y obras de gran escala. Una etapa que
                  forjó el rigor técnico, la dirección de obra y el conocimiento profundo del
                  proceso constructivo.
                </p>
              </div>
            </div>
            <div className="tl__row">
              <div className="tl__yr">2019 — hoy</div>
              <div>
                <h4>Estudio independiente · CEO &amp; fundadora</h4>
                <p>
                  Nace Lorena Macías Arquitecta, un estudio de arquitectura y diseño de interiores
                  de autor. Siete años desarrollando viviendas, reformas, interiorismo y paisajismo
                  con una identidad propia y cercana.
                </p>
              </div>
            </div>
            <div className="tl__row" style={{ borderBottom: '1px solid var(--taupe)' }}>
              <div className="tl__yr">Hoy</div>
              <div>
                <h4>Diseño integral y personalizado</h4>
                <p>
                  Cada cliente recibe un acompañamiento completo y a medida, con foco en la
                  materialidad, la conexión con la naturaleza y la funcionalidad de cada espacio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITA */}
      <section className="section quote-band">
        <div className="wrap reveal">
          <p className="q">
            “Diseño espacios para ser vividos: honestos en su materialidad, conectados con la
            naturaleza y fieles a quienes los habitan.”
          </p>
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
              <span className="eyebrow">Lo que nos guía</span>
              <h2 className="h-xl">Cuatro principios</h2>
            </div>
          </div>
          <div className="pillars reveal d1">
            <div className="pillar">
              <span className="n">01</span>
              <h4>Funcionalidad</h4>
              <p>Espacios cómodos y lógicos, pensados para la vida real de quienes los habitan.</p>
            </div>
            <div className="pillar">
              <span className="n">02</span>
              <h4>Materialidad</h4>
              <p>Materiales nobles y honestos que aportan textura, calidez y carácter.</p>
            </div>
            <div className="pillar">
              <span className="n">03</span>
              <h4>Conexión natural</h4>
              <p>La naturaleza como protagonista: luz, verde y paisaje integrados al hogar.</p>
            </div>
            <div className="pillar">
              <span className="n">04</span>
              <h4>Diseño a medida</h4>
              <p>Ningún proyecto se repite. Cada propuesta refleja a su dueño y su lugar.</p>
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
              <p>Entendemos tu idea, tu terreno, tu forma de vivir y tu presupuesto.</p>
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
        <img src="/assets/img/living.jpg" alt="" />
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
              Agendar reunión <span className="arr">→</span>
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
