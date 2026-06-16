import { supabase, supabaseEnabled } from './supabase';

// Servicios por defecto (se usan si no hay nada cargado en el panel).
export const SERVICIOS_DEFAULT = [
  {
    titulo: 'Proyecto arquitectónico & Project Management',
    descripcion:
      'Edificios, barrios cerrados y proyectos de gran envergadura. Llevamos tu proyecto del anteproyecto a la dirección de obra, con una mirada integral en cada etapa.',
    incluye: [
      'Anteproyecto & proyecto ejecutivo',
      'Edificios & barrios cerrados',
      'Renders 3D',
      'Dirección de obra',
      'Project management',
    ],
    imagen: '/assets/img/exterior.jpg',
  },
  {
    titulo: 'Diseño de interiores',
    descripcion:
      'Interiores residenciales y comerciales a medida. Definimos materialidad, mobiliario e iluminación para lograr espacios cálidos, sofisticados y funcionales.',
    incluye: ['Residencial & comercial', 'Materialidad', 'Mobiliario a medida', 'Iluminación'],
    imagen: '/assets/img/living.jpg',
  },
  {
    titulo: 'Interiorismo náutico',
    descripcion:
      'Diseño de interiores náuticos: espacios funcionales y elegantes, pensados al detalle para la vida a bordo y el aprovechamiento de cada centímetro.',
    incluye: [
      'Aprovechamiento del espacio',
      'Materialidad marina',
      'Mobiliario a medida',
      'Iluminación',
    ],
    imagen: '',
  },
  {
    titulo: 'Reformas y obras',
    descripcion:
      'Renovamos y ampliamos espacios con visión integral. Dirigimos y ejecutamos la obra con estándares de calidad y atención al detalle.',
    incluye: ['Reformas integrales', 'Ampliaciones', 'Dirección de obra', 'Ejecución'],
    imagen: '/assets/img/cocina.jpg',
  },
  {
    titulo: 'Paisajismo',
    descripcion:
      'Diseñamos el exterior como una extensión natural de tu ambiente: jardines, decks, piscinas y áreas verdes que conectan el espacio con su entorno.',
    incluye: ['Diseño de jardines', 'Decks & exteriores', 'Vegetación', 'Áreas de relax'],
    imagen: '/assets/img/terraza.jpg',
  },
];

// Datos de contacto / marca editables desde el panel (con valores por defecto).
export const SITE_DEFAULTS = {
  contacto_email: 'arquitectura@lorenamacias.com.py',
  contacto_tel: '+595 981 109 295',
  contacto_whatsapp: '595981109295',
  contacto_whatsapp_msg: 'Hola Lorena, me gustaría una consulta sobre un proyecto.',
  contacto_instagram: 'lorenamacias_arq',
  contacto_ciudad: 'Asunción, Paraguay',
};

// Lee toda la config de contacto/marca (Supabase sobre los valores por defecto).
export async function getSiteConfig() {
  const cfg = { ...SITE_DEFAULTS };
  if (supabaseEnabled && supabase) {
    const { data } = await supabase
      .from('configuracion')
      .select('clave, valor')
      .in('clave', Object.keys(SITE_DEFAULTS));
    if (data) {
      for (const row of data) {
        if (row.clave in cfg && row.valor != null && row.valor !== '') cfg[row.clave] = row.valor;
      }
    }
  }
  return cfg;
}

function parseJSON(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Lee un valor de configuración por clave.
export async function getConfigValue(clave) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', clave)
      .maybeSingle();
    if (!error && data?.valor != null) return data.valor;
  }
  return null;
}

// Servicios para mostrar en el sitio (de Supabase o, si no hay, los de ejemplo).
export async function getServicios() {
  const valor = await getConfigValue('servicios');
  return valor ? parseJSON(valor, SERVICIOS_DEFAULT) : SERVICIOS_DEFAULT;
}
