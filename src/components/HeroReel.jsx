'use client';

import { useRef, useState } from 'react';
import { useT } from '../context/LocaleContext';

/**
 * Tarjeta del reel en el hero: muestra "Ver reel" y, al hacer click, gira (flip)
 * y aparece el video que sube la arqui desde el panel. Si no hay video, no se
 * muestra nada (queda listo para cuando lo cargue).
 */
export default function HeroReel({ video, poster }) {
  const [flipped, setFlipped] = useState(false);
  const videoRef = useRef(null);
  const t = useT();
  if (!video) return null;

  function open() {
    setFlipped(true);
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (v) v.play().catch(() => {});
    });
  }
  function close() {
    const v = videoRef.current;
    if (v) v.pause();
    setFlipped(false);
  }

  return (
    <div className={'hero-reel' + (flipped ? ' is-flipped' : '')}>
      <div className="hero-reel__inner">
        <button
          type="button"
          className="hero-reel__front"
          onClick={open}
          style={poster ? { backgroundImage: `url(${poster})` } : undefined}
          aria-label={t('home.verReel')}
        >
          <span className="hero-reel__play" aria-hidden="true">
            ▶
          </span>
          <span className="hero-reel__label">{t('home.verReel')}</span>
        </button>
        <div className="hero-reel__back">
          <video ref={videoRef} src={video} controls playsInline preload="none" poster={poster || undefined} />
          <button type="button" className="hero-reel__close" onClick={close} aria-label="Cerrar">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
