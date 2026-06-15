'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '../data/site';
import { useAgenda } from '../context/AgendaContext';
import MobileMenu from './MobileMenu';

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
  const pathname = usePathname();
  const navMode = isDarkHero(pathname) ? 'dark' : 'light';
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
          <Link className="nav__logo" href="/" aria-label="Lorena Macías inicio">
            <img
              className="logo-dark"
              src="/assets/logo-charcoal.png"
              alt="Lorena Macías Arquitecta"
            />
            <img className="logo-light" src="/assets/logo-cream.png" alt="" />
          </Link>
          <nav>
            <ul className="nav__links">
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={pathname === href ? 'active' : ''}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="nav__cta" onClick={open}>
            Solicitar reunión
          </button>
          <button className="nav__burger" aria-label="Menú" onClick={() => setMenuOpen(true)}>
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
