'use client';

import Link from 'next/link';
import { NAV } from '../data/site';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';
import { useT, useHref } from '../context/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

// href de cada item -> clave de traducción.
const NAV_KEY = {
  '/': 'nav.inicio',
  '/sobre-mi': 'nav.sobre',
  '/proyectos': 'nav.proyectos',
  '/servicios': 'nav.servicios',
  '/contacto': 'nav.contacto',
};

export default function MobileMenu({ open, onClose }) {
  const { open: openAgenda } = useAgenda();
  const { contacto_tel, contacto_ciudad } = useSiteConfig();
  const t = useT();
  const href = useHref();

  return (
    <div className={'mmenu' + (open ? ' open' : '')}>
      <button className="mmenu__close" aria-label={t('nav.cerrar')} onClick={onClose}>
        ×
      </button>
      {NAV.map(({ label, href: h }) => (
        <Link key={h} href={href(h)} onClick={onClose}>
          {NAV_KEY[h] ? t(NAV_KEY[h]) : label}
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
        {t('cta.solicitar')}
      </a>
      <LanguageSwitcher className="langsw--mobile" />
      <div className="mmenu__foot">
        {contacto_tel} · {contacto_ciudad}
      </div>
    </div>
  );
}
