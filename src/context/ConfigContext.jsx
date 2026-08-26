'use client';

import { createContext, useContext } from 'react';

// Valores por defecto (deben coincidir con SITE_DEFAULTS de lib/config.js)
const DEFAULTS = {
  contacto_email: 'arquitectura@lorenamacias.com.py',
  contacto_tel: '+595 981 109 295',
  contacto_tel2: '',
  contacto_tel3: '',
  contacto_whatsapp: '595981109295',
  contacto_whatsapp_msg: 'Hola Lorena, me gustaría una consulta sobre un proyecto.',
  contacto_instagram: 'lorenamacias_arq',
  contacto_linkedin: '',
  contacto_facebook: '',
  contacto_ciudad: 'Asunción, Paraguay',
  logo_claro: '',
  logo_oscuro: '',
  logo_horizontal: '',
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
    tels: [c.contacto_tel, c.contacto_tel2, c.contacto_tel3].filter((t) => t && t.trim()),
    waUrl: `https://wa.me/${c.contacto_whatsapp}?text=${encodeURIComponent(c.contacto_whatsapp_msg)}`,
    igUrl: c.contacto_instagram ? `https://www.instagram.com/${c.contacto_instagram}` : '',
    linkedinUrl: c.contacto_linkedin || '',
    facebookUrl: c.contacto_facebook || '',
    mailto: `mailto:${c.contacto_email}`,
  };
}
