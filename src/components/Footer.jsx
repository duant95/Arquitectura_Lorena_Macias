import Link from 'next/link';
import { NAV, SERVICES, WA, IG, MAIL, TEL } from '../data/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">
              <img src="/assets/logo-cream.png" alt="Lorena Macías Arquitecta" />
            </div>
            <p style={{ maxWidth: 300, color: 'var(--taupe)', fontSize: 15, lineHeight: 1.7 }}>
              Estudio de arquitectura y diseño de interiores. Espacios que conectan naturaleza,
              materialidad y función.
            </p>
          </div>
          <div>
            <h5>Navegación</h5>
            <ul>
              {NAV.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Servicios</h5>
            <ul>
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/servicios">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li>
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  {TEL}
                </a>
              </li>
              <li>
                <a href={`mailto:${MAIL}`}>{MAIL}</a>
              </li>
              <li style={{ color: 'var(--taupe)' }}>Calle Fortín Arce e/ Senador Flecha</li>
              <li style={{ color: 'var(--taupe)' }}>Luque · Paraguay</li>
            </ul>
            <div className="footer__social" style={{ marginTop: 20 }}>
              <a href={IG} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 2.2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 10.3 2.6 10.7 2.6 12s0 1.7.1 2.9c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-2.9s0-1.7-.1-2.9c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.7A4.1 4.1 0 1 0 12 16a4.1 4.1 0 0 0 0-8.1zm0 6.8A2.7 2.7 0 1 1 12 9.3a2.7 2.7 0 0 1 0 5.4zm5.2-7a1 1 0 1 1-1-1 1 1 0 0 1 1 1z" />
                </svg>
              </a>
              <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24">
                  <path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" />
                </svg>
              </a>
              <a href={`mailto:${MAIL}`} aria-label="Email">
                <svg viewBox="0 0 24 24">
                  <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L20 7H4zm0 2L4.2 8.8V18h15.6V8.8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} Lorena Macías · Arquitecta. Todos los derechos reservados.
          </span>
          <span>Luque, Paraguay · Diseño &amp; arquitectura</span>
        </div>
      </div>
    </footer>
  );
}
