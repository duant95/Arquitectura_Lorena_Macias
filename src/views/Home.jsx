'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAgenda } from '../context/AgendaContext';
import { Parallax, Reveal, LineReveal, Magnetic, EASE } from '../components/fx/Motion';

export default function HomeView({ featured = [], servicios = [], content = {} }) {
  const { open } = useAgenda();

  return (
    <div className="hm">
      {/* ===================== HERO ===================== */}
      <section className="hm-hero" data-screen-label="Hero">
        <Parallax className="hm-hero__media" src={content.inicio_hero_imagen} strength={10} priority />
        <div className="hm-hero__in">
          <motion.p
            className="hm-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          >
            {content.inicio_hero_eyebrow}
          </motion.p>

          <h1 className="hm-hero__title">
            <LineReveal
              lines={['Arquitectura', <>que <em>respira</em>.</>]}
              delay={0.25}
            />
          </h1>

          <motion.div
            className="hm-hero__foot"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          >
            <p className="hm-hero__lead">{content.inicio_hero_descripcion}</p>
            <div className="hm-hero__cta">
              <Link className="btn btn--light" href="/proyectos">
                Ver proyectos <span className="arr">→</span>
              </Link>
              <button className="btn btn--ghost-light" onClick={open}>
                Solicitar reunión
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="hm-scrollcue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          Scroll
        </motion.div>
      </section>

      {/* ===================== MANIFIESTO ===================== */}
      <section className="hm-statement">
        <div className="wrap">
          <Reveal>
            <p className="hm-statement__eyebrow">Filosofía</p>
          </Reveal>
          <h2 className="hm-statement__text">
            <LineReveal
              lines={[
                'Una arquitectura que escucha',
                <>el lugar, abraza la <em>luz</em></>,
                'y se construye para vivirse.',
              ]}
              stagger={0.1}
            />
          </h2>
        </div>
      </section>

      {/* ===================== PROYECTOS (full-bleed) ===================== */}
      <div className="hm-projects" data-screen-label="Proyectos">
        {featured.map((p, i) => (
          <section className="hm-proj" key={p.slug}>
            <Parallax
              className="hm-proj__media"
              src={p.cover || content.inicio_hero_imagen}
              alt={p.name}
              strength={16}
            />
            <div className="hm-proj__in wrap">
              <Reveal y={56}>
                <span className="hm-proj__idx">{String(i + 1).padStart(2, '0')}</span>
                {p.catLabel && <p className="hm-proj__cat">{p.catLabel}</p>}
                <h3 className="hm-proj__name">{p.name}</h3>
                <Link className="hm-proj__link" href={`/proyecto/${p.slug}`}>
                  Ver proyecto <span className="arr">→</span>
                </Link>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="hm-allprojects">
        <div className="wrap">
          <Reveal>
            <Link className="link-arrow" href="/proyectos">
              Ver todos los proyectos <span className="arr">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== CIFRAS ===================== */}
      <section className="hm-stats">
        <div className="wrap">
          <div className="hm-stats__grid">
            {[
              ['+200', 'proyectos realizados'],
              ['25', 'años de trayectoria'],
              ['30', 'niveles · obra premium'],
              ['1ª', 'en diseño náutico en PY'],
            ].map(([n, l], i) => (
              <Reveal className="hm-stat" key={l} delay={i * 0.09}>
                <div className="hm-stat__n">{n}</div>
                <div className="hm-stat__l">{l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SERVICIOS ===================== */}
      <section className="hm-services" data-screen-label="Servicios">
        <div className="wrap">
          <div className="hm-services__head">
            <Reveal>
              <p className="hm-eyebrow hm-eyebrow--dark">Servicios</p>
              <h2 className="hm-services__title">
                Cómo acompañamos
                <br />
                tu <em>proyecto</em>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link className="link-arrow" href="/servicios">
                Conocer servicios <span className="arr">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="hm-services__list">
            {servicios.map((s, i) => (
              <Reveal key={i} delay={Math.min(i, 3) * 0.06}>
                <Link className="hm-srv" href="/servicios">
                  <span className="hm-srv__n">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="hm-srv__name">{s.titulo}</h4>
                  <p className="hm-srv__desc">{s.descripcion}</p>
                  <span className="hm-srv__go">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="hm-cta" data-screen-label="CTA">
        <Parallax className="hm-cta__media" src={content.inicio_cta_imagen} strength={12} />
        <div className="hm-cta__in">
          <Reveal>
            <p className="hm-eyebrow">Tu próximo proyecto</p>
            <h2
              className="hm-cta__title"
              dangerouslySetInnerHTML={{ __html: content.inicio_cta_titulo }}
            />
            <p className="hm-cta__lead">{content.inicio_cta_descripcion}</p>
            <Magnetic>
              <button className="btn btn--light hm-cta__btn" onClick={open}>
                Solicitar reunión <span className="arr">→</span>
              </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
