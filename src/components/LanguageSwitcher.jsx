'use client';

import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_NAMES, localizedHref, stripLocale } from '../lib/i18n/config';
import { useLocale } from '../context/LocaleContext';

/**
 * Selector de idioma. Mantiene la misma página y sólo cambia el prefijo:
 *   /proyectos  ·  /en/proyectos  ·  /pt/proyectos
 *
 * Usa navegación completa (<a>) a propósito: garantiza que la página se
 * renderice en el idioma nuevo al primer clic (sin caché del router), y guarda
 * la elección en una cookie para que persista en cada visita y navegación.
 */
export default function LanguageSwitcher({ className = '' }) {
  const locale = useLocale();
  const pathname = usePathname();
  const base = stripLocale(pathname || '/');

  function remember(l) {
    // 1 año; el middleware la lee para respetar el idioma elegido.
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className={'langsw ' + className}>
      {LOCALES.map((l, i) => (
        <span key={l} className="langsw__item">
          {i > 0 && (
            <span className="langsw__sep" aria-hidden="true">
              ·
            </span>
          )}
          <a
            href={localizedHref(base, l)}
            onClick={() => remember(l)}
            className={'langsw__lnk' + (l === locale ? ' is-active' : '')}
            aria-current={l === locale ? 'true' : undefined}
            aria-label={LOCALE_NAMES[l].full}
          >
            {LOCALE_NAMES[l].label}
          </a>
        </span>
      ))}
    </div>
  );
}
