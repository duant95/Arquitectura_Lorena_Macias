'use client';

import '../../styles/preview.css';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';
import CustomCursor from '@/components/preview/CustomCursor';

const EASE = [0.22, 1, 0.36, 1];

function ParallaxMedia({ src, alt, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  return (
    <div className={className} ref={ref}>
      <motion.img src={src} alt={alt} style={{ y, scale }} />
    </div>
  );
}

function Reveal({ children, className, delay = 0, y = 40 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Magnetic({ children }) {
  const ref = useRef(null);
  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
  }
  function onLeave() {
    ref.current.style.transform = '';
  }
  return (
    <button
      ref={ref}
      className="pv-magnetic"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor
    >
      {children}
    </button>
  );
}

const PROYECTOS = [
  {
    idx: '01',
    cat: 'Arquitectura · Barrio cerrado',
    name: 'Barrio Cerrado Pirarenda',
    img: '/assets/img/exterior.jpg',
  },
  {
    idx: '02',
    cat: 'Arquitectura · 27 niveles',
    name: 'Edificio Carmen Dora',
    img: '/assets/img/escalera.jpg',
  },
  {
    idx: '03',
    cat: 'Interiorismo náutico',
    name: 'V426 Victory Yachts',
    img: '/assets/img/dormitorio.jpg',
  },
];

export default function PreviewHome() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="pv pv-root">
      <CustomCursor />

      <nav className="pv-nav">
        <img src="/assets/logo-cream.png" alt="Lorena Macías" />
        <div className="pv-nav__links">
          <a href="#">Proyectos</a>
          <a href="#">Nosotros</a>
          <a href="#">Servicios</a>
          <a href="#">Contacto</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pv-hero">
        <ParallaxMedia className="pv-hero__media" src="/assets/img/living.jpg" alt="" />
        <div className="pv-hero__in">
          <motion.p
            className="pv-eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Arquitectura · Interiorismo
          </motion.p>
          <h1 className="pv-hero__title">
            <span className="pv-line">
              <motion.span
                style={{ display: 'block' }}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              >
                Arquitectura
              </motion.span>
            </span>
            <span className="pv-line">
              <motion.span
                style={{ display: 'block' }}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.34 }}
              >
                que <em>respira</em>.
              </motion.span>
            </span>
          </h1>
        </div>
        <div className="pv-scrollcue">Scroll</div>
      </section>

      {/* MANIFIESTO */}
      <section className="pv-section">
        <Reveal>
          <p className="pv-manifesto">
            Más de dos décadas dando forma a espacios con <em>identidad</em> y <em>propósito</em>.
          </p>
        </Reveal>
      </section>

      {/* PROYECTOS full-bleed */}
      {PROYECTOS.map((p) => (
        <section className="pv-proj" key={p.idx}>
          <ParallaxMedia className="pv-proj__media" src={p.img} alt={p.name} />
          <div className="pv-proj__in">
            <Reveal>
              <span className="pv-proj__idx">{p.idx}</span>
              <p className="pv-proj__cat">{p.cat}</p>
              <h2 className="pv-proj__name">{p.name}</h2>
              <a className="pv-proj__link" href="#" data-cursor data-cursor-label="Ver">
                Ver proyecto →
              </a>
            </Reveal>
          </div>
        </section>
      ))}

      {/* STATS */}
      <section className="pv-section">
        <div className="pv-stats">
          {[
            ['+200', 'proyectos realizados'],
            ['25', 'años de trayectoria'],
            ['30', 'niveles · obra premium'],
            ['1ª', 'en diseño náutico en PY'],
          ].map(([n, l], i) => (
            <Reveal className="pv-stat" key={l} delay={i * 0.08}>
              <div className="n">{n}</div>
              <div className="l">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pv-cta">
        <ParallaxMedia className="pv-cta__media" src="/assets/img/terraza.jpg" alt="" />
        <div className="pv-cta__in">
          <Reveal>
            <h2 className="pv-cta__title">
              Demos vida a tu <em>proyecto</em>.
            </h2>
            <Magnetic>Solicitar reunión →</Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
