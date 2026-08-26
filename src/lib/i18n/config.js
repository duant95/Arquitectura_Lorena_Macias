// Configuración de idiomas del sitio.
// El español es el idioma por defecto y vive en la raíz SIN prefijo (intacto).
// El inglés y el portugués (Brasil) viven bajo /en y /pt.

export const DEFAULT_LOCALE = 'es';
export const LOCALES = ['es', 'en', 'pt'];
export const PREFIXED_LOCALES = ['en', 'pt']; // los que llevan prefijo en la URL

export function isLocale(x) {
  return LOCALES.includes(x);
}

// Nombres para el selector de idioma.
export const LOCALE_NAMES = {
  es: { label: 'ES', full: 'Español' },
  en: { label: 'EN', full: 'English' },
  pt: { label: 'PT', full: 'Português' },
};

// Códigos de DeepL por locale destino.
export const DEEPL_TARGET = {
  en: 'EN-US',
  pt: 'PT-BR',
};

/**
 * Devuelve el locale de un pathname del navegador (que SÍ incluye el prefijo).
 * '/en/proyectos' -> 'en'   ·   '/proyectos' -> 'es'
 */
export function localeFromPath(pathname) {
  const seg = (pathname || '/').split('/')[1];
  return PREFIXED_LOCALES.includes(seg) ? seg : DEFAULT_LOCALE;
}

/**
 * Quita el prefijo de idioma de un pathname del navegador.
 * '/en/proyectos' -> '/proyectos'   ·   '/proyectos' -> '/proyectos'
 */
export function stripLocale(pathname) {
  const parts = (pathname || '/').split('/');
  if (PREFIXED_LOCALES.includes(parts[1])) {
    const rest = '/' + parts.slice(2).join('/');
    return rest === '/' ? '/' : rest.replace(/\/$/, '');
  }
  return pathname || '/';
}

/**
 * Construye un href interno para el locale actual.
 * es -> sin cambios (raíz intacta).  en/pt -> con prefijo.
 * localizedHref('/proyectos', 'en') -> '/en/proyectos'
 * localizedHref('/', 'pt') -> '/pt'
 */
export function localizedHref(href, locale) {
  if (!href || typeof href !== 'string') return href;
  // Enlaces externos, anclas, mailto, tel: sin tocar.
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (locale === DEFAULT_LOCALE || !PREFIXED_LOCALES.includes(locale)) return href;
  if (href === '/') return `/${locale}`;
  return `/${locale}${href}`;
}
