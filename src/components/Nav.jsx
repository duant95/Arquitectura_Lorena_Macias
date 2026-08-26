'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '../data/site';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';
import { useT, useHref } from '../context/LocaleContext';
import { stripLocale } from '../lib/i18n/config';
import LanguageDropdown from './LanguageDropdown';
import MobileMenu from './MobileMenu';

// href de cada item del nav -> clave de traducción del label.
const NAV_KEY = {
  '/': 'nav.inicio',
  '/sobre-mi': 'nav.sobre',
  '/proyectos': 'nav.proyectos',
  '/servicios': 'nav.servicios',
  '/contacto': 'nav.contacto',
};

// Rutas con hero oscuro: el nav arranca transparente y se vuelve sólido al hacer scroll.
function isDarkHero(pathname) {
  return pathname === '/' || pathname.startsWith('/proyecto/');
}

/**
 * Modo del nav según la ruta:
 *   'dark'  -> transparente sobre el hero, se vuelve sólido al hacer scroll
 *   'light' -> siempre sólido (páginas interiores con hero claro)
 */
export default function Nav() {
  const { open } = useAgenda();
  const { logo_claro, logo_oscuro } = useSiteConfig();
  const pathname = usePathname();
  const path = stripLocale(pathname || '/');
  const t = useT();
  const href = useHref();
  const navMode = isDarkHero(path) ? 'dark' : 'light';
  const [solid, setSolid] = useState(navMode === 'light');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      if (navMode === 'light') {
        setSolid(true);
      } else {
        setSolid(window.scrollY > window.innerHeight * 0.72);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [navMode]);

  return (
    <>
      <header className={'nav' + (solid ? ' solid' : '')}>
        <div className="nav__in">
          <Link className="nav__logo" href={href('/')} aria-label="Lorena Macias Arquitecta — inicio">
            <img
              className="logo-light"
              src={logo_claro || '/assets/logo-cream.png'}
              alt="Lorena Macias Arquitecta"
            />
            <img
              className="logo-dark"
              src={logo_oscuro || '/assets/logo-charcoal.png'}
              alt="Lorena Macias Arquitecta"
            />
          </Link>
          <nav>
            <ul className="nav__links">
              {NAV.map(({ label, href: h }) => (
                <li key={h}>
                  <Link href={href(h)} className={path === h ? 'active' : ''}>
                    {NAV_KEY[h] ? t(NAV_KEY[h]) : label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__actions">
            <button className="nav__cta" onClick={open}>
              {t('cta.solicitar')}
            </button>
            <LanguageDropdown />
          </div>
          <button className="nav__burger" aria-label={t('nav.menu')} onClick={() => setMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
