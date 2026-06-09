import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import '../styles/home.css';

export default function Home() {
  const { open } = useAgenda();
  useReveals();

  return (
    <Layout navMode="dark">
      {/* HERO INMERSIVO */}
      <section className="hero" data-screen-label="Hero">
        <div className="hero__bg">
          <img src="/assets/img/living.jpg" alt="Interior de vivienda diseñada por Lorena Macías" />
        </div>
        <div className="hero__in">
          <p className="eyebrow hero__eyebrow">
            Estudio de arquitectura &amp; diseño de interiores · Luque, Paraguay
          </p>
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
                Diseñamos hogares donde la naturaleza, la materialidad y la función conviven en
                equilibrio. Cada proyecto, una historia construida con intención.
              </p>
              <div className="hero__cta">
                <Link className="btn btn--light" to="/proyectos">
                  Ver proyectos <span className="arr">→</span>
                </Link>
                <button className="btn btn--ghost-light" onClick={open}>
                  Agendar reunión
                </button>
              </div>
            </div>
            <div className="hero__meta">
              <span>Est. 2019</span>
              <span>+80 obras</span>
              <span>Arq. + Interiores</span>
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
              Creemos en una arquitectura <span className="hl">honesta</span>: la que escucha al
              terreno, abraza la luz natural y se construye para <span className="hl">vivirse</span>
              , no solo para mirarse.
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
                Tras <b style={{ fontWeight: 400 }}>18 años</b> en la gran escala constructiva,
                Lorena funda en 2019 su estudio de autor: un espacio para diseñar arquitectura e
                interiores con identidad, calidez y propósito.
              </p>
              <p style={{ color: 'var(--ink-soft)', maxWidth: 540 }}>
                De la obra de gran porte al detalle más íntimo de una vivienda, su mirada une rigor
                técnico y sensibilidad — escuchando siempre el terreno, la luz y la forma de vivir
                de cada cliente.
              </p>
              <div className="story__mini">
                <div>
                  <div className="yr">2001–2019</div>
                  <div className="lb">18 años en empresa constructora</div>
                </div>
                <div>
                  <div className="yr">2019 · hoy</div>
                  <div className="lb">Estudio independiente de autor</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
                <span className="sign">Lorena Macías</span>
                <Link className="link-arrow" to="/nosotros">
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
              <span className="num">01 — Portafolio</span>
              <h2 className="h-xl">Proyectos seleccionados</h2>
            </div>
            <Link className="link-arrow" to="/proyectos">
              Ver todo el portafolio <span className="arr">→</span>
            </Link>
          </div>

          <div className="feat">
            <article className="feat__item reveal">
              <div className="feat__img reveal-img">
                <span className="feat__idx">01</span>
                <img src="/assets/img/living.jpg" alt="Living integrado" />
              </div>
              <div>
                <div className="feat__cat">Vivienda · Diseño interior</div>
                <h3 className="feat__name">Casa del Bosque</h3>
                <p className="feat__desc">
                  Un living de doble altura que disuelve el límite entre interior y jardín. Maderas
                  cálidas, piedra natural y una paleta serena que invita a habitar con calma.
                </p>
                <div className="feat__spec">
                  <div>
                    <span className="micro">Año</span>
                    <b>2023</b>
                  </div>
                  <div>
                    <span className="micro">Superficie</span>
                    <b>320 m²</b>
                  </div>
                  <div>
                    <span className="micro">Ubicación</span>
                    <b>Luque</b>
                  </div>
                </div>
                <Link className="link-arrow" to="/proyecto/casa-del-bosque">
                  Ver proyecto <span className="arr">→</span>
                </Link>
              </div>
            </article>

            <article className="feat__item rev reveal">
              <div className="feat__img reveal-img">
                <span className="feat__idx">02</span>
                <img src="/assets/img/cocina.jpg" alt="Cocina y estar" />
              </div>
              <div>
                <div className="feat__cat">Reforma · Ampliación</div>
                <h3 className="feat__name">Residencia MK</h3>
                <p className="feat__desc">
                  Reforma integral que reorganiza la planta en torno a una gran isla social. La luz
                  del atardecer y los tonos tierra definen el carácter del espacio.
                </p>
                <div className="feat__spec">
                  <div>
                    <span className="micro">Año</span>
                    <b>2022</b>
                  </div>
                  <div>
                    <span className="micro">Superficie</span>
                    <b>240 m²</b>
                  </div>
                  <div>
                    <span className="micro">Ubicación</span>
                    <b>Asunción</b>
                  </div>
                </div>
                <Link className="link-arrow" to="/proyecto/residencia-mk">
                  Ver proyecto <span className="arr">→</span>
                </Link>
              </div>
            </article>

            <article className="feat__item reveal">
              <div className="feat__img reveal-img">
                <span className="feat__idx">03</span>
                <img src="/assets/img/dormitorio.jpg" alt="Suite principal" />
              </div>
              <div>
                <div className="feat__cat">Diseño de interiores</div>
                <h3 className="feat__name">Suite Natural</h3>
                <p className="feat__desc">
                  Una suite principal pensada como refugio. Carpintería iluminada, textiles nobles y
                  vegetación interior para un descanso envuelto en materialidad cálida.
                </p>
                <div className="feat__spec">
                  <div>
                    <span className="micro">Año</span>
                    <b>2023</b>
                  </div>
                  <div>
                    <span className="micro">Superficie</span>
                    <b>58 m²</b>
                  </div>
                  <div>
                    <span className="micro">Ubicación</span>
                    <b>Luque</b>
                  </div>
                </div>
                <Link className="link-arrow" to="/proyecto/suite-natural">
                  Ver proyecto <span className="arr">→</span>
                </Link>
              </div>
            </article>
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
              Trabajamos con materiales nobles y honestos — madera, piedra, cuero, hormigón y verde
              — para componer atmósferas que envejecen con belleza.
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
            <Link className="link-arrow" to="/servicios">
              Conocer servicios <span className="arr">→</span>
            </Link>
          </div>
          <div className="svc-list reveal">
            <Link className="svc-row" to="/servicios">
              <span className="num">01</span>
              <h4>Diseño de interiores</h4>
              <p>Ambientes a medida, materialidad y mobiliario.</p>
              <span className="go">→</span>
            </Link>
            <Link className="svc-row" to="/servicios">
              <span className="num">02</span>
              <h4>Proyecto arquitectónico</h4>
              <p>Del anteproyecto al proyecto ejecutivo, listo para construir.</p>
              <span className="go">→</span>
            </Link>
            <Link className="svc-row" to="/servicios">
              <span className="num">03</span>
              <h4>Reformas y obras</h4>
              <p>Dirección y ejecución con estándares de calidad.</p>
              <span className="go">→</span>
            </Link>
            <Link className="svc-row" to="/servicios">
              <span className="num">04</span>
              <h4>Paisajismo</h4>
              <p>El exterior como extensión natural del hogar.</p>
              <span className="go">→</span>
            </Link>
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
                “Más de dos décadas dando forma a espacios que las personas eligen llamar hogar.”
              </blockquote>
              <Link className="btn" to="/nosotros">
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
                <div className="n">+80</div>
                <div className="l">proyectos y obras realizados</div>
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
            Construyamos algo
            <br />
            <em>extraordinario</em>.
          </h2>
          <p
            className="lead reveal d2"
            style={{ color: 'rgba(246,242,233,.85)', maxWidth: 580, margin: '0 auto 42px' }}
          >
            Contanos tu idea, tu terreno o tu sueño. Empecemos con una conversación.
          </p>
          <div
            className="reveal d3"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              Agendar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" to="/contacto">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
