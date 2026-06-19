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

// ---------------------------------------------------------------------------
// CONTENIDO EDITABLE de las páginas (textos e imágenes), por página.
// Los textos admiten <em>palabra</em> para resaltar en itálica.
// ---------------------------------------------------------------------------
export const CONTENT_DEFAULTS = {
  // Inicio
  inicio_hero_imagen: '/assets/img/living.jpg',
  inicio_hero_eyebrow: 'Arquitectura · Interiorismo',
  inicio_hero_descripcion:
    'Proyectos de arquitectura e interiorismo con identidad y propósito. Del edificio al detalle.',
  inicio_cta_imagen: '/assets/img/terraza.jpg',
  inicio_cta_titulo: 'Demos vida a tu <em>proyecto</em>.',
  inicio_cta_descripcion:
    'Contanos tu idea o el proyecto que imaginás. Nosotros te ayudamos a hacerlo realidad.',
  // Nosotros
  nosotros_hero_titulo: 'Diseñar es<br /><em>escuchar</em>.',
  nosotros_hero_lead:
    'Soy Lorena Macías, arquitecta y project manager. Más de 25 años liderando proyectos de alta complejidad (edificios, barrios cerrados, residencias, interiorismo y diseño náutico), de principio a fin.',
  nosotros_retrato_imagen: '',
  nosotros_proceso_imagen: '/assets/img/proceso.jpg',
  nosotros_cta_imagen: '/assets/img/living.jpg',
  nosotros_cita:
    'Diseño espacios para ser vividos: cuidados en su materialidad, conectados con la luz y fieles a quienes los habitan.',
};

// Línea de tiempo de Nosotros (cada etapa se despliega y muestra sus proyectos).
export const TRAYECTORIA_DEFAULT = [
  {
    yr: '2001–2019',
    titulo: 'Gustafson y Asociados · Gerente de Proyectos',
    descripcion:
      'Fui pieza clave del área de diseño y proyecto ejecutivo, coordinando equipos de arquitectos, calculistas y especialistas. Ayudé a definir los estándares del mercado residencial premium de altura de Asunción, en edificios de hasta 30 niveles.',
    proyectos: [
      {
        titulo: 'Edificio Altagracia · 30 niveles',
        descripcion:
          'Diseño, proyecto ejecutivo y dirección de obra. Unidades premium. (2012–2015)',
      },
      {
        titulo: 'Edificio Casa Vista · 12 niveles',
        descripcion: 'Diseño, dirección de obra, interiorismo y paisajismo. (2007–2009)',
      },
      {
        titulo: 'Edificio Soleil',
        descripcion: 'Pionero del segmento residencial de lujo en Asunción. (2004–2005)',
      },
      {
        titulo: 'Edificio Santa Teresa',
        descripcion: 'Diseño integral, dirección de obra, interiorismo y paisajismo.',
      },
    ],
  },
  {
    yr: '2019–presente',
    titulo: 'Lorena Macías Arquitectura · Directora y Project Manager',
    descripcion:
      'Fundo mi estudio y sigo liderando proyectos de gran escala: edificios, barrios cerrados, residencias premium, interiorismo y diseño náutico, coordinando múltiples equipos independientes.',
    proyectos: [
      {
        titulo: 'Barrio Cerrado Pirarenda',
        descripcion:
          'Coordinación y Project Management del emprendimiento (12 ha): amenities y 11 viviendas (5 finalizadas).',
      },
      {
        titulo: 'Edificio Carmen Dora · 27 niveles',
        descripcion: 'Dirección arquitectónica de obra. (2019–2022)',
      },
      {
        titulo: 'Salumax · Project Management',
        descripcion: 'PM externo; obra finalizada en plazo. (2020–2022)',
      },
      { titulo: 'V426 Victory Yachts', descripcion: 'Interiores náuticos. (2026)' },
    ],
  },
  {
    yr: 'Hoy',
    titulo: 'Pionera en diseño náutico',
    descripcion:
      'Primera arquitecta en Paraguay en diseñar interiores de yates. Mercados activos en Paraguay, Brasil y Uruguay.',
    proyectos: [],
  },
];

// Lee el contenido editable de las páginas (Supabase sobre los valores por defecto).
export async function getContent() {
  const c = { ...CONTENT_DEFAULTS, trayectoria: TRAYECTORIA_DEFAULT };
  if (supabaseEnabled && supabase) {
    const claves = [...Object.keys(CONTENT_DEFAULTS), 'nosotros_trayectoria'];
    const { data } = await supabase
      .from('configuracion')
      .select('clave, valor')
      .in('clave', claves);
    if (data) {
      for (const row of data) {
        if (row.valor == null || row.valor === '') continue;
        if (row.clave === 'nosotros_trayectoria') {
          c.trayectoria = parseJSON(row.valor, TRAYECTORIA_DEFAULT);
        } else if (row.clave in c) {
          c[row.clave] = row.valor;
        }
      }
    }
  }
  return c;
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
