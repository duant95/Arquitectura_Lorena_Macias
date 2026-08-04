'use client';

import { useEffect, useState } from 'react';

/**
 * Intro animada con el logo. Solo se muestra una vez por sesión
 * (igual que el diseño original, usando sessionStorage).
 */
export default function Intro() {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('lm_intro')) setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const root = document.documentElement;
    sessionStorage.setItem('lm_intro', '1');
    root.style.overflow = 'hidden';
    // pausa la animación de entrada del hero mientras la intro tapa la pantalla
    root.classList.add('intro-playing');
    const t1 = setTimeout(() => {
      setHide(true);
      root.style.overflow = '';
      // al levantarse la intro, el hero reanuda su animación y el usuario la ve
      root.classList.remove('intro-playing');
    }, 2900);
    const t2 = setTimeout(() => setShow(false), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      root.style.overflow = '';
      root.classList.remove('intro-playing');
    };
  }, [show]);

  if (!show) return null;

  return (
    <div id="intro" className={hide ? 'hide' : ''}>
      <img className="intro__logo" src="/assets/logo-charcoal.png" alt="Lorena Macias Arquitecta" />
    </div>
  );
}
