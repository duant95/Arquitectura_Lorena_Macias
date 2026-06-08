import { useEffect, useState } from 'react';

/**
 * Intro animada con el logo. Solo se muestra una vez por sesión
 * (igual que el diseño original, usando sessionStorage).
 */
export default function Intro() {
  const [show, setShow] = useState(() => !sessionStorage.getItem('lm_intro'));
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem('lm_intro', '1');
    document.documentElement.style.overflow = 'hidden';
    const t1 = setTimeout(() => {
      setHide(true);
      document.documentElement.style.overflow = '';
    }, 2900);
    const t2 = setTimeout(() => setShow(false), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div id="intro" className={hide ? 'hide' : ''}>
      <div style={{ textAlign: 'center' }}>
        <img className="intro__mark" src="/assets/mark-charcoal.png" alt="" />
        <div className="intro__name"><span>LORENA MACÍAS</span></div>
        <div className="intro__sub">Arquitecta</div>
      </div>
    </div>
  );
}
