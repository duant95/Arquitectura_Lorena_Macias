'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/**
 * Imagen con parallax: se desplaza y hace un zoom-out sutil al hacer scroll.
 * `strength` controla cuánto se mueve (más = más movimiento).
 */
export function Parallax({ src, alt = '', className, strength = 14, priority = false }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <div className={className} ref={ref}>
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={reduce ? undefined : { y, scale }}
      />
    </div>
  );
}

/**
 * Aparición con fade + desplazamiento. Por defecto anima al montar (fiable en
 * todos los navegadores). Con `inView` usa la entrada al viewport (scroll).
 * El estado animado garantiza que el contenido SIEMPRE termina visible.
 */
export function Reveal({ children, className, delay = 0, y = 48, as = 'div', inView = false }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) return <Comp className={className}>{children}</Comp>;
  const anim = inView
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10%' } }
    : { animate: { opacity: 1, y: 0 } };
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.95, ease: EASE, delay }}
      {...anim}
    >
      {children}
    </Comp>
  );
}

/**
 * Título que sube línea por línea desde abajo. Anima al montar (fiable).
 * Pasale un array de líneas (texto o JSX). El recorte lo hace .ln en el CSS.
 */
export function LineReveal({ lines = [], className, delay = 0, stagger = 0.13 }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((ln, i) => (
        <span className="ln" key={i}>
          {reduce ? (
            <span style={{ display: 'block' }}>{ln}</span>
          ) : (
            <motion.span
              style={{ display: 'block' }}
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, ease: EASE, delay: delay + i * stagger }}
            >
              {ln}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * Botón/elemento magnético: se "pega" al cursor. Degrada a estático en táctil.
 */
export function Magnetic({ children, className, strength = 0.32, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  function onMove(e) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <span
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-flex', willChange: 'transform', transition: 'transform .35s var(--ease)' }}
      {...rest}
    >
      {children}
    </span>
  );
}
