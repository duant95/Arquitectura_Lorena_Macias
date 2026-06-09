import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV } from '../data/site';
import { useAgenda } from '../context/AgendaContext';
import MobileMenu from './MobileMenu';

/**
 * navMode: 'dark'  -> transparente sobre el hero, se vuelve sólida al hacer scroll
 *          'light' -> siempre sólida (páginas interiores con hero claro)
 */
export default function Nav({ navMode = 'dark' }) {
  const { open } = useAgenda();
  const location = useLocation();
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
          <Link className="nav__logo" to="/" aria-label="Lorena Macías inicio">
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
                  <Link to={href} className={location.pathname === href ? 'active' : ''}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="nav__cta" onClick={open}>
            Agendar reunión
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
