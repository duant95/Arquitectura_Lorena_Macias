'use client';

import { useEffect, useRef } from 'react';

// Carrusel horizontal tipo línea de tiempo (sin fechas): imágenes del mismo
// tamaño en una fila. Al apoyar el cursor en los extremos, se desliza solo,
// lento. Pensado para acompañar el relato de la trayectoria con fotos de obra.
export default function CarruselLinea({ imagenes = [] }) {
  const trackRef = useRef(null);
  const dirRef = useRef(0); // -1 izquierda · 1 derecha · 0 quieto
  const rafRef = useRef(0);

  useEffect(() => {
    const step = () => {
      const el = trackRef.current;
      if (el && dirRef.current !== 0) {
        el.scrollLeft += dirRef.current * 1.3; // desplazamiento lento
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onMove = (e) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const zona = r.width * 0.16; // 16% en cada extremo
    dirRef.current = x < zona ? -1 : x > r.width - zona ? 1 : 0;
  };
  const onLeave = () => {
    dirRef.current = 0;
  };

  if (!imagenes.length) return null;

  return (
    <div className="carr">
      <div className="carr__track" ref={trackRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        {imagenes.map((im, i) => (
          <figure className="carr__cell" key={i}>
            <img src={im.src || im.imagen || im.url} alt={im.alt || ''} loading="lazy" />
          </figure>
        ))}
      </div>
      <span className="carr__fade carr__fade--l" aria-hidden="true" />
      <span className="carr__fade carr__fade--r" aria-hidden="true" />
    </div>
  );
}
