import { headers } from 'next/headers';
import { DEFAULT_LOCALE, isLocale } from './config';

/**
 * Locale del request en el servidor. Lo inyecta el middleware vía header
 * 'x-locale' para /en y /pt. En español no hay header -> DEFAULT_LOCALE.
 */
export function getLocale() {
  try {
    const l = headers().get('x-locale');
    return isLocale(l) ? l : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}
