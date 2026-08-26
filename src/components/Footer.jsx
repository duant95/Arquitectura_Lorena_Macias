'use client';

import { useSiteConfig } from '../context/ConfigContext';
import { useT } from '../context/LocaleContext';

// Íconos de redes (SVG inline, heredan el color).
const IG = (
  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.3A4.1 4.1 0 1 0 16.1 12 4.1 4.1 0 0 0 12 7.5m0 6.8A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.3m5.2-7a1 1 0 1 1-1-1 1 1 0 0 1 1 1z" />
);
const LI = (
  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4z" />
);
const FB = (
  <path d="M13 22v-8h2.7l.4-3H13V9.1c0-.9.25-1.5 1.5-1.5H16V5c-.28-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V11H7.5v3H9.9v8z" />
);
const WA = (
  <path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" />
);

export default function Footer() {
  const {
    contacto_email,
    contacto_ciudad,
    tels,
    waUrl,
    igUrl,
    linkedinUrl,
    facebookUrl,
    mailto,
    logo_horizontal,
  } = useSiteConfig();
  const t = useT();

  const redes = [
    { key: 'ig', label: 'Instagram', href: igUrl, icon: IG },
    { key: 'in', label: 'LinkedIn', href: linkedinUrl, icon: LI },
    { key: 'fb', label: 'Facebook', href: facebookUrl, icon: FB },
    { key: 'wa', label: 'WhatsApp', href: waUrl, icon: WA },
  ];
  return (
    <footer className="footer">
      <div className="wrap footer__top">
        <div className="footer__brand">
          <img
            className="footer__logo"
            src={logo_horizontal || '/assets/logo-h-charcoal.png'}
            alt="Lorena Macias Arquitecta"
          />
        </div>

        <div className="footer__right">
          <div className="footer__contact">
            <a href={mailto}>{contacto_email}</a>
            {tels.map((tel, i) =>
              i === 0 ? (
                <a key={i} href={waUrl} target="_blank" rel="noopener noreferrer">
                  {tel}
                </a>
              ) : (
                <a key={i} href={`tel:${tel.replace(/[^\d+]/g, '')}`}>
                  {tel}
                </a>
              )
            )}
            <span>{contacto_ciudad}</span>
          </div>
          <div className="footer__social">
            {redes.map((r) =>
              r.href ? (
                <a
                  key={r.key}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__soc"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {r.icon}
                  </svg>
                  <span>{r.label}</span>
                </a>
              ) : (
                <span key={r.key} className="footer__soc footer__soc--off" aria-disabled="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {r.icon}
                  </svg>
                  <span>{r.label}</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} Lorena Macías Arquitectura</span>
        <span>{t('footer.tagline')}</span>
      </div>
    </footer>
  );
}
