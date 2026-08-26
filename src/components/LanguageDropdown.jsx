'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_NAMES, localizedHref, stripLocale } from '../lib/i18n/config';
import { useLocale } from '../context/LocaleContext';

/**
 * Selector de idioma compacto (desplegable) para el nav: ocupa poco lugar y no
 * mueve los títulos de las páginas. Navegación completa (<a>) para que cambie al
 * primer clic, y guarda la elección en cookie para que persista.
 */
export default function LanguageDropdown() {
  const locale = useLocale();
  const pathname = usePathname();
  const base = stripLocale(pathname || '/');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  function remember(l) {
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div className="langdd" ref={ref}>
      <button
        type="button"
        className="langdd__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LOCALE_NAMES[locale].full}
        onClick={() => setOpen((o) => !o)}
      >
        {LOCALE_NAMES[locale].label}
        <svg className="langdd__caret" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <div className="langdd__menu" role="listbox">
          {LOCALES.map((l) => (
            <a
              key={l}
              href={localizedHref(base, l)}
              onClick={() => remember(l)}
              className={'langdd__opt' + (l === locale ? ' is-active' : '')}
              role="option"
              aria-selected={l === locale}
            >
              {LOCALE_NAMES[l].full}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
