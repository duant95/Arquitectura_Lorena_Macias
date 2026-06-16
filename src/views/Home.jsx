'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function HomeView({ featured = [], servicios = [] }) {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      {/* HERO INMERSIVO */}
      <section className="hero" data-screen-label="Hero">
        <div className="hero__bg">
          <img src="/assets/img/living.jpg" alt="Interior de vivienda diseñada por Lorena Macías" />
        </div>
        <div className="hero__in">
          <p className="eyebrow hero__eyebrow">Arquitectura · Interiorismo</p>
          <h1 className="hero__title">
            <span className="ln">
              <span>Arquitectura</span>
            </span>
            <span className="ln">
              <span>
                que <em>respira</em>.
              </span>
            </span>
          </h1>
          <div className="hero__sub">
            <div>
              <p style={{ marginBottom: 26 }}>
                Proyectos de arquitectura e interiorismo con identidad y propósito. Del edificio al
                detalle.
              </p>
              <div className="hero__cta">
                <Link className="btn btn--light" href="/proyectos">
                  Ver proyectos <span className="arr">→</span>
                </Link>
                <button className="btn btn--ghost-light" onClick={open}>
                  Solicitar reunión
                </button>
              </div>
            </div>
            <div className="hero__meta">
              <span>+200 proyectos</span>
              <span>2001 — presente</span>
              <span>Arq. + Interiorismo</span>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <div className="manifesto reveal">
            <p className="eyebrow" style={{ marginBottom: 30 }}>
              Nuestra filosofía
            </p>
            <p className="q">
              Creemos en una arquitectura que escucha el <span className="hl">lugar</span>, abraza
              la luz natural y se construye para <span className="hl">vivirse</span>, no solo para
              mirarse.
            </p>
          </div>
        </div>
      </section>

      {/* HISTORIA / SOBRE LORENA */}
      <section className="section story" data-screen-label="Historia">
        <div className="wrap">
          <div className="story__grid">
            <div className="story__portrait reveal-img reveal">
              <div className="ph" data-ph="Retrato de Lorena"></div>
              <div className="story__tag">
                <b>Lorena Macías</b>
                <span>Arquitecta · Fundadora</span>
              </div>
            </div>
            <div className="reveal d1">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                La arquitecta
              </p>
              <h2 className="h-xl" style={{ marginBottom: 30, maxWidth: '15ch' }}>
                Más de dos décadas dando forma al espacio.
              </h2>
              <p className="lead" style={{ color: 'var(--ink)', maxWidth: 560 }}>
                Con más de <b style={{ fontWeight: 400 }}>dos décadas</b> de trayectoria —de
                edificios y barrios cerrados al interiorismo— Lorena funda en 2019 su estudio de
                autor: arquitectura e interiores con identidad, calidez y propósito.
              </p>
              <p style={{ color: 'var(--ink-soft)', maxWidth: 540 }}>
                Del proyecto de gran envergadura al detalle más íntimo de un interior, su mirada une
                rigor técnico y sensibilidad — atenta siempre a la luz, los materiales y la forma de
                habitar de cada cliente.
              </p>
              <div className="story__mini">
                <div>
                  <div className="yr">2001 — 2019</div>
                  <div className="lb">Trayectoria en arquitectura y obra</div>
                </div>
                <div>
                  <div className="yr">2019 — presente</div>
                  <div className="lb">Estudio independiente de autor</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                <span className="sign">Lorena Macías</span>
                <Link className="link-arrow" href="/nosotros">
                  Conocé su trayectoria <span className="arr">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROYECTOS DESTACADOS */}
      <section className="section" data-screen-label="Proyectos destacados">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="num">01 — Proyectos</span>
              <h2 className="h-xl">Proyectos seleccionados</h2>
            </div>
            <Link className="link-arrow" href="/proyectos">
              Ver todos los proyectos <span className="arr">→</span>
            </Link>
          </div>

          <div className="feat">
            {featured.map((p, i) => (
              <article key={p.slug} className={`feat__item reveal${i === 1 ? ' rev' : ''}`}>
                <div className="feat__img reveal-img">
                  <span className="feat__idx">{String(i + 1).padStart(2, '0')}</span>
                  {p.cover ? (
                    <img src={p.cover} alt={p.name} />
                  ) : (
                    <div
                      className="ph"
                      data-ph={p.ph}
                      style={{ position: 'absolute', inset: 0 }}
                    ></div>
                  )}
                </div>
                <div>
                  <div className="feat__cat">{p.catLabel}</div>
                  <h3 className="feat__name">{p.name}</h3>
                  <p className="feat__desc" dangerouslySetInnerHTML={{ __html: p.leadParagraph }} />
                  <div className="feat__spec">
                    <div>
                      <span className="micro">Año</span>
                      <b>{p.year}</b>
                    </div>
                    <div>
                      <span className="micro">Superficie</span>
                      <b>{p.area}</b>
                    </div>
                    <div>
                      <span className="micro">Ubicación</span>
                      <b>{p.location}</b>
                    </div>
                  </div>
                  <Link className="link-arrow" href={`/proyecto/${p.slug}`}>
                    Ver proyecto <span className="arr">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALIDAD */}
      <section className="section matr" data-screen-label="Materialidad">
        <div className="wrap">
          <div className="matr__head reveal">
            <div>
              <p className="eyebrow" style={{ marginBottom: 18 }}>
                02 — Materialidad
              </p>
              <h2 className="h-lg" style={{ maxWidth: '14ch' }}>
                Texturas y ambientes que se sienten
              </h2>
            </div>
            <p style={{ maxWidth: 400, color: 'var(--ink-soft)', margin: 0 }}>
              Trabajamos con materiales nobles — madera, piedra, cuero, hormigón y verde — para
              componer atmósferas que envejecen con belleza.
            </p>
          </div>
          <div className="matr__grid reveal d1">
            <div className="matr__cell">
              <img src="/assets/tex/maderatex.jpg" alt="Madera" />
              <span>Madera</span>
            </div>
            <div className="matr__cell">
              <img src="/assets/tex/cuero.jpg" alt="Cuero" />
              <span>Cuero</span>
            </div>
            <div className="matr__cell">
              <img src="/assets/tex/hormigon.jpg" alt="Hormigón" />
              <span>Hormigón</span>
            </div>
            <div className="matr__cell">
              <img src="/assets/tex/piedra.jpg" alt="Piedra" />
              <span>Piedra</span>
            </div>
            <div className="matr__cell">
              <img src="/assets/tex/pasto.jpg" alt="Verde" />
              <span>Paisaje</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section" data-screen-label="Servicios">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="num">03 — Servicios</span>
              <h2 className="h-xl">
                Cómo acompañamos
                <br />
                tu proyecto
              </h2>
            </div>
            <Link className="link-arrow" href="/servicios">
              Conocer servicios <span className="arr">→</span>
            </Link>
          </div>
          <div className="svc-list reveal">
            {servicios.map((s, i) => (
              <Link className="svc-row" href="/servicios" key={i}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h4>{s.titulo}</h4>
                <p>{s.descripcion}</p>
                <span className="go">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRAYECTORIA */}
      <section className="section tray" data-screen-label="Trayectoria">
        <div className="wrap">
          <div className="tray__grid">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: 24 }}>
                04 — Trayectoria
              </p>
              <blockquote className="tray__quote" style={{ margin: '0 0 38px' }}>
                “Más de dos décadas dando forma a espacios con identidad y propósito.”
              </blockquote>
              <Link className="btn" href="/nosotros">
                Conocé a Lorena <span className="arr">→</span>
              </Link>
            </div>
            <div className="stats reveal d1">
              <div className="stat">
                <div className="n">25</div>
                <div className="l">años de trayectoria profesional</div>
              </div>
              <div className="stat">
                <div className="n">7</div>
                <div className="l">años de estudio independiente</div>
              </div>
              <div className="stat">
                <div className="n">+200</div>
                <div className="l">proyectos realizados</div>
              </div>
              <div className="stat">
                <div className="n">100%</div>
                <div className="l">diseño personalizado y a medida</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section cta-final" data-screen-label="CTA">
        <img src="/assets/img/terraza.jpg" alt="" />
        <div className="wrap">
          <p className="eyebrow light reveal" style={{ marginBottom: 24 }}>
            Tu próximo proyecto
          </p>
          <h2
            className="display reveal d1"
            style={{ fontSize: 'clamp(38px,5.7vw,92px)', marginBottom: 32 }}
          >
            Demos vida a tu
            <br />
            <em>proyecto</em>.
          </h2>
          <p
            className="lead reveal d2"
            style={{ color: 'rgba(246,242,233,.85)', maxWidth: 580, margin: '0 auto 42px' }}
          >
            Contanos tu idea o el proyecto que imaginás. Nosotros te ayudamos a hacerlo realidad.
          </p>
          <div
            className="reveal d3"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              Solicitar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href="/contacto">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
