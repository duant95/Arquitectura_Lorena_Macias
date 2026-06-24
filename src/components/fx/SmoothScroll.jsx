'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Scroll suave (Lenis) para todo el sitio: da ese deslizamiento "mantecoso"
 * y cinematográfico, y sincroniza el scroll con las animaciones de Framer Motion.
 * Respeta "reducir movimiento" del sistema.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      smoothWheel: true,
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    // exponer para que otros (anclas, botón "subir") puedan usarlo
    window.__lenis = lenis;

    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
