'use client';

import { createContext, useContext, useCallback } from 'react';
import { DEFAULT_LOCALE, localizedHref } from '../lib/i18n/config';
import { UI, translate } from '../lib/i18n/ui';

const LocaleContext = createContext(DEFAULT_LOCALE);

export function LocaleProvider({ locale = DEFAULT_LOCALE, children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

// Traductor de textos fijos del código para el locale actual.
export function useT() {
  const locale = useLocale();
  return useCallback((key) => translate(locale, key), [locale]);
}

// Devuelve una función que localiza hrefs internos según el locale actual.
export function useHref() {
  const locale = useLocale();
  return useCallback((href) => localizedHref(href, locale), [locale]);
}

export { UI };
