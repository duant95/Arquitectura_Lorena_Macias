'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import { Parallax, Reveal, LineReveal, Magnetic, EASE } from '../components/fx/Motion';

// Texto editable con saltos de línea (\n) y <em> → líneas para el reveal.
function toLines(text) {
  return String(text || '')
    .split('\n')
    .filter((l) => l.trim() !== '')
    .map((l, i) => <span key={i} dangerouslySetInnerHTML={{ __html: l }} />);
}

export default function HomeView({ servicios = [], content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  const showcase = content.showcase || [];

  return (
    <div className="hm">
      {/* ===================== HERO ===================== */}
      <section className="hm-hero" data-screen-label="Hero">
        {content.inicio_hero_video ? (
          <div className="hm-hero__media hm-hero__media--video">
            <video
              src={content.inicio_hero_video}
              poster={content.inicio_hero_imagen || undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        ) : (
          <Parallax className="hm-hero__media" src={content.inicio_hero_imagen} strength={10} priority />
        )}
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
            <LineReveal lines={toLines(content.inicio_hero_titulo)} delay={0.25} />
          </h1>

          <motion.div
            className="hm-hero__foot"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.85 }}
          >
            <p
              className="hm-hero__lead"
              dangerouslySetInnerHTML={{ __html: content.inicio_hero_descripcion }}
            />
            <div className="hm-hero__cta">
              <Link className="btn btn--light" href={href('/proyectos')}>
                {t('cta.verProyectos')} <span className="arr">→</span>
              </Link>
              <button className="btn btn--ghost-light" onClick={open}>
                {t('cta.solicitar')}
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
          {t('cta.scroll')}
        </motion.div>
      </section>

      {/* ===================== DIVISOR (imagen + título "Obras destacadas") ===================== */}
      {content.inicio_divisor_imagen && (
        <section className="hm-divisor">
          <Parallax className="hm-divisor__media" src={content.inicio_divisor_imagen} strength={16} />
          <div className="hm-divisor__in wrap">
            <Reveal inView>
              <p className="hm-divisor__title">{t('home.obrasDestacadas')}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===================== PROYECTOS (full-bleed, showcase editable) ===================== */}
      <div className="hm-projects" data-screen-label="Proyectos">
        {showcase.map((p, i) => (
          <section className="hm-proj" key={i}>
            <Parallax
              className="hm-proj__media"
              src={p.imagen || content.inicio_hero_imagen}
              alt={p.titulo}
              strength={20}
            />
            <div className="hm-proj__in wrap">
              <Reveal y={56} inView>
                {p.categoria && <p className="hm-proj__cat">{p.categoria}</p>}
                <h3 className="hm-proj__name">{p.titulo}</h3>
                <Link
                  className="hm-proj__link"
                  href={href(p.slug ? `/proyecto/${p.slug}` : '/proyectos')}
                >
                  {t('cta.verProyecto')} <span className="arr">→</span>
                </Link>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      {(() => {
        const bandImg = content.inicio_vertodos_imagen || content.inicio_divisor_imagen;
        return (
          <section className="hm-allprojects">
            {bandImg && (
              <Parallax className="hm-allprojects__media" src={bandImg} strength={16} />
            )}
            <div className="hm-allprojects__in">
              <Reveal inView>
                <Link className="hm-allprojects__title" href={href('/proyectos')}>
                  {t('cta.verTodos')} <span className="arr">→</span>
                </Link>
              </Reveal>
            </div>
          </section>
        );
      })()}

      {/* ===================== SERVICIOS ===================== */}
      <section className="hm-services" data-screen-label="Servicios">
        <div className="wrap">
          <div className="hm-services__head">
            <Reveal inView>
              <p className="hm-eyebrow hm-eyebrow--dark">{t('home.serviciosEyebrow')}</p>
              <h2
                className="hm-services__title"
                dangerouslySetInnerHTML={{ __html: t('home.serviciosTitulo') }}
              />
            </Reveal>
            <Reveal inView delay={0.1}>
              <Link className="link-arrow" href={href('/servicios')}>
                {t('cta.conocerServicios')} <span className="arr">→</span>
              </Link>
            </Reveal>
          </div>
          <div className="hm-services__list">
            {servicios.map((s, i) => (
              <Reveal key={i} inView delay={Math.min(i, 3) * 0.06}>
                <Link className="hm-srv" href={href('/servicios')}>
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
          <Reveal inView>
            <p className="hm-eyebrow">{t('home.proximoProyecto')}</p>
            <h2
              className="hm-cta__title"
              dangerouslySetInnerHTML={{ __html: content.inicio_cta_titulo }}
            />
            <p
              className="hm-cta__lead"
              dangerouslySetInnerHTML={{ __html: content.inicio_cta_descripcion }}
            />
            <Magnetic>
              <button className="btn btn--light hm-cta__btn" onClick={open}>
                {t('cta.solicitar')} <span className="arr">→</span>
              </button>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
