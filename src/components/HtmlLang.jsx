'use client';

import { useEffect } from 'react';

// Ajusta el atributo lang del <html> según el idioma actual (SEO / accesibilidad).
export default function HtmlLang({ locale = 'es' }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
