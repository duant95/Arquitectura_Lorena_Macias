'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Cursor personalizado: un anillo que sigue el mouse con inercia y crece sobre
// links, botones e imágenes (elementos con [data-cursor]).
export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const t = e.target.closest('a, button, [data-cursor]');
      if (t) {
        setHover(true);
        setLabel(t.getAttribute('data-cursor-label') || '');
      }
    };
    const out = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) {
        setHover(false);
        setLabel('');
      }
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout', out);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className={'pcursor' + (hover ? ' on' : '') + (label ? ' labeled' : '')}
      style={{ left: sx, top: sy }}
      aria-hidden="true"
    >
      {label && <span>{label}</span>}
    </motion.div>
  );
}
