'use client';

import Link from 'next/link';
import { NAV } from '../data/site';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';

export default function MobileMenu({ open, onClose }) {
  const { open: openAgenda } = useAgenda();
  const { contacto_tel, contacto_ciudad } = useSiteConfig();

  return (
    <div className={'mmenu' + (open ? ' open' : '')}>
      <button className="mmenu__close" aria-label="Cerrar" onClick={onClose}>
        ×
      </button>
      {NAV.map(({ label, href }) => (
        <Link key={href} href={href} onClick={onClose}>
          {label}
        </Link>
      ))}
      <a
        href="#agenda"
        onClick={(e) => {
          e.preventDefault();
          onClose();
          openAgenda();
        }}
      >
        Solicitar reunión
      </a>
      <div className="mmenu__foot">
        {contacto_tel} · {contacto_ciudad}
      </div>
    </div>
  );
}
