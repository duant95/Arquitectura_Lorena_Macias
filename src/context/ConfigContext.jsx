'use client';

import { createContext, useContext } from 'react';

// Valores por defecto (deben coincidir con SITE_DEFAULTS de lib/config.js)
const DEFAULTS = {
  contacto_email: 'arquitectura@lorenamacias.com.py',
  contacto_tel: '+595 981 109 295',
  contacto_whatsapp: '595981109295',
  contacto_whatsapp_msg: 'Hola Lorena, me gustaría una consulta sobre un proyecto.',
  contacto_instagram: 'lorenamacias_arq',
  contacto_ciudad: 'Asunción, Paraguay',
};

const ConfigContext = createContext(DEFAULTS);

export function ConfigProvider({ value, children }) {
  return (
    <ConfigContext.Provider value={{ ...DEFAULTS, ...(value || {}) }}>
      {children}
    </ConfigContext.Provider>
  );
}

// Devuelve la config + URLs derivadas listas para usar.
export function useSiteConfig() {
  const c = useContext(ConfigContext);
  return {
    ...c,
    waUrl: `https://wa.me/${c.contacto_whatsapp}?text=${encodeURIComponent(c.contacto_whatsapp_msg)}`,
    igUrl: `https://www.instagram.com/${c.contacto_instagram}`,
    mailto: `mailto:${c.contacto_email}`,
  };
}
