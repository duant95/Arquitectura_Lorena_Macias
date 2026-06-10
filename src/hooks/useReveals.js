'use client';

import { useEffect } from 'react';

/**
 * Replica el comportamiento de "reveal" del diseño original (site.js):
 * observa los elementos .reveal / .reveal-img y les agrega la clase .in
 * cuando entran en viewport. Se vuelve a ejecutar cuando cambia `deps`
 * (p. ej. al navegar entre páginas) para captar el nuevo contenido.
 */
export default function useReveals(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-img').forEach((el) => {
      if (!el.classList.contains('in')) io.observe(el);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
