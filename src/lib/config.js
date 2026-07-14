import { supabase, supabaseEnabled } from './supabase';

// Servicios por defecto (se usan si no hay nada cargado en el panel).
export const SERVICIOS_DEFAULT = [
  {
    titulo: 'Proyecto arquitectónico',
    descripcion:
      'Del anteproyecto al proyecto ejecutivo y la dirección de obra. Edificios, barrios cerrados y residencias de alto estándar, resueltos con rigor técnico y sensibilidad de diseño.',
    incluye: [
      'Anteproyecto & partido de diseño',
      'Proyecto ejecutivo & documentación técnica',
      'Renders 3D',
      'Dirección arquitectónica de obra',
    ],
    imagen: '/assets/img/exterior.jpg',
  },
  {
    titulo: 'Project Management',
    descripcion:
      'Coordinación integral de proyectos de alta complejidad. Articulo equipos y proveedores, controlo plazos, costos y calidad, y defiendo tu inversión como responsable técnica independiente.',
    incluye: [
      'Coordinación de equipos y proveedores',
      'Control de plazos y costos',
      'Gestión de riesgos & change orders',
      'Reportes ejecutivos & auditoría independiente',
    ],
    imagen: '/assets/img/proceso.jpg',
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
  inicio_hero_titulo: 'Arquitectura\nque <em>respira</em>.',
  inicio_hero_descripcion:
    'Proyectos de arquitectura e interiorismo con identidad y propósito. Del edificio al detalle.',
  inicio_manifiesto:
    'Una arquitectura que escucha el lugar, abraza la <em>luz</em> y se construye para vivirse.',
  inicio_cta_imagen: '/assets/img/terraza.jpg',
  inicio_cta_titulo: 'Demos vida a tu <em>proyecto</em>.',
  inicio_cta_descripcion:
    'Contanos tu idea o el proyecto que imaginás. Nosotros te ayudamos a hacerlo realidad.',
  // Proyectos (hero)
  proyectos_hero_imagen: '/assets/img/exterior.jpg',
  proyectos_hero_titulo: 'Dos décadas\nde <em>proyectos</em>.',
  proyectos_hero_lead:
    'Una trayectoria contada por su obra: de los edificios en altura junto a Gustafson y Asociados al estudio de autor de hoy. Elegí la etapa para recorrerla.',
  // Servicios (hero)
  servicios_hero_imagen: '/assets/img/cocina.jpg',
  servicios_hero_titulo: 'Servicios',
  servicios_hero_lead:
    'Acompañamiento integral, desde la primera idea hasta el último detalle de obra. Diseño a medida en cada etapa.',
  // Sobre mí
  nosotros_hero_titulo: 'Diseñar es<br /><em>escuchar</em>.',
  nosotros_intro_imagen: '/assets/img/living.jpg',
  nosotros_intro_titulo: 'Una mirada que combina técnica, sensibilidad y trayectoria.',
  // El estudio (institucional, voz "nosotros")
  nosotros_estudio_titulo: 'Un servicio <em>integral</em>, de la idea a la obra.',
  nosotros_estudio_texto:
    'Estudio de Arquitectura Lorena Macías es un estudio especializado en arquitectura, diseño de interiores y gerenciamiento de proyectos, con más de 25 años de experiencia. Desarrollamos proyectos residenciales, comerciales y corporativos, brindando un servicio integral que abarca desde el diseño y la documentación técnica hasta la coordinación, construcción, el seguimiento de obra, diseño interior y paisajismo. Nos enfocamos en crear espacios funcionales, estéticos y personalizados, ofreciendo atención cercana, calidad y compromiso en cada proyecto.',
  nosotros_intro_lead:
    'Mi trabajo es <em>funcional</em>, <em>sofisticado</em> y <em>práctico</em>. Cada proyecto es una conversación con el lugar, la luz y las personas que lo van a habitar.',
  nosotros_intro_texto:
    'Diseño, documento, dirijo y vendo: una visión integral del proyecto que me permite cuidar tu inversión en cada etapa, desde la primera idea hasta la entrega de obra.',
  nosotros_hero_lead:
    'Soy Lorena Macías, arquitecta y project manager. Más de 25 años liderando proyectos de alta complejidad (edificios, barrios cerrados, residencias, interiorismo y diseño náutico), de principio a fin.',
  nosotros_historia:
    'Soy arquitecta con más de 25 años de trayectoria ininterrumpida en Paraguay. Desde 2001 me dediqué al diseño, la documentación técnica y la dirección de obra de edificios residenciales de alto estándar, ejerciendo como Gerente de Proyectos. En esa etapa, en colaboración con el estudio Gustafson y Asociados, lideré algunas de las obras de mayor envergadura del mercado premium de Asunción: edificios de 12 a 30 niveles, con departamentos de 350 a 550 m².\n\nDurante una década trabajé además en la comercialización de unidades premium. Esa doble mirada, técnica y de negocio, me permite acompañar cada proyecto entendiendo también su valor y su mercado, y cuidar tu inversión en cada etapa.\n\nEn 2019 fundé mi propio estudio, Lorena Macías Arquitectura. Hoy lidero proyectos de gran complejidad como Project Manager y Directora de Obras: de barrios cerrados y residencias premium al interiorismo náutico, siendo la primera arquitecta en Paraguay en diseñar interiores de yates, con proyectos en Paraguay, Brasil y Uruguay.',
  nosotros_retrato_imagen: '',
  nosotros_proceso_imagen: '/assets/img/proceso.jpg',
  nosotros_cta_imagen: '/assets/img/living.jpg',
  nosotros_cita:
    'Diseño espacios para ser vividos: cuidados en su materialidad, conectados con la luz y fieles a quienes los habitan.',
};

// Cifras del inicio (editables).
export const INICIO_STATS_DEFAULT = [
  { n: '+200', l: 'PROYECTOS REALIZADOS' },
  { n: '25', l: 'AÑOS DE TRAYECTORIA' },
  { n: '30', l: 'NIVELES · OBRA PREMIUM' },
  { n: '1ª', l: 'EN DISEÑO NÁUTICO EN PY' },
];

// Showcase del inicio: bloques a pantalla completa (imagen + proyecto), editables.
export const INICIO_SHOWCASE_DEFAULT = [
  {
    imagen: '/assets/img/exterior.jpg',
    titulo: 'Barrio Cerrado Pirarenda',
    categoria: 'Arquitectura · Barrio cerrado',
    slug: 'barrio-pirarenda-viviendas',
  },
  {
    imagen: '/assets/img/escalera.jpg',
    titulo: 'Edificio Carmen Dora',
    categoria: 'Arquitectura · 27 niveles',
    slug: 'edificio-carmen-dora',
  },
  {
    imagen: '/assets/img/dormitorio.jpg',
    titulo: 'V426 Victory Yachts',
    categoria: 'Interiorismo náutico',
    slug: 'v426-victory-yachts',
  },
];

// Pilares ("Lo que me distingue") de Sobre mí.
export const NOSOTROS_PILARES_DEFAULT = [
  {
    titulo: 'Project Management',
    descripcion:
      'Coordino proyectos de alta complejidad, articulando a arquitectos, calculistas, especialistas y proveedores hacia un mismo objetivo.',
  },
  {
    titulo: 'Visión integral',
    descripcion:
      'Diseño, documento, dirijo y vendo: acompaño el proyecto completo, de la primera idea a la entrega, en una sola mano.',
  },
  {
    titulo: 'Interiorismo náutico',
    descripcion: 'Primera arquitecta en Paraguay en diseñar interiores de yates.',
  },
  {
    titulo: 'Equipo y aliados de obra',
    descripcion:
      'Un equipo propio de obra y una red de especialistas asociados que sumo a cada proyecto, según lo que necesita.',
  },
];

export const SERVICIOS_PASOS_DEFAULT = [
  { titulo: 'Escuchar', descripcion: 'Entendemos tu idea, necesidades y presupuesto.' },
  { titulo: 'Diseñar', descripcion: 'Anteproyecto, materialidad y renders.' },
  { titulo: 'Construir', descripcion: 'Documentación y dirección de obra.' },
  { titulo: 'Habitar', descripcion: 'Un espacio listo para vivirse.' },
];

// Mi historia: collage de imágenes (2 edificios en altura + 2 estudio propio).
export const NOSOTROS_HISTORIA_IMAGENES_DEFAULT = [
  { imagen: '/assets/img/escalera.jpg', alt: 'Edificio en altura' },
  { imagen: '/assets/img/exterior.jpg', alt: 'Barrio cerrado' },
  { imagen: '/assets/img/living.jpg', alt: 'Interior de estudio propio' },
  { imagen: '/assets/img/dormitorio.jpg', alt: 'Interiorismo náutico' },
];

// Prensa: publicaciones/apariciones (con o sin enlace).
export const NOSOTROS_PRENSA_DEFAULT = [
  {
    imagen: '',
    medio: 'Nombre del medio',
    titulo: 'Título del artículo o entrevista',
    descripcion: 'Breve descripción de la publicación.',
    fecha: '',
    url: '',
  },
];

// Formación & capacidades (columnas con listas).
export const NOSOTROS_FORMACION_DEFAULT = [
  {
    titulo: 'Formación',
    items: [
      'Arquitectura · Universidad Católica de Asunción',
      'Dirección Integrada de Proyectos · UCOM',
      'Desarrollo y Negocios Inmobiliarios',
      'Sistema de Calidad en Construcción',
      'Gestión de Presupuestos en Obras · USIL',
      'Project Management para Construcción',
      'Diseño de Interiores Náuticos · Brasil (2023)',
    ],
  },
  {
    titulo: 'Capacidades & herramientas',
    items: [
      'Project Management & coordinación multidisciplinaria',
      'Dirección de obra & control de plazos y costos',
      'Gestión de presupuestos & documentación técnica',
      'Herramientas: Revit, SketchUp, Lumion',
      'Arquitectura residencial premium · interiorismo · paisajismo',
      'Arquitectura fluvial & diseño náutico',
    ],
  },
  {
    titulo: 'Idiomas & mercados',
    items: [
      'Español (nativo)',
      'Portugués (avanzado)',
      'Inglés (lectocomprensión)',
      'Mercados: Paraguay · Brasil · Uruguay',
    ],
  },
];

// Etapas de la página de Proyectos (textos del selector).
export const PROYECTOS_ETAPAS_DEFAULT = [
  {
    key: 'propio',
    label: 'Estudio propio',
    period: '2019 — presente',
    blurb:
      'Mi estudio de autor. Diseño, documento, dirijo y vendo cada proyecto de principio a fin: barrios cerrados, residencias premium, interiorismo y diseño náutico.',
    note: '',
  },
  {
    key: 'gustafson',
    label: 'Gerente de Proyectos',
    period: '2001 — 2019',
    blurb:
      'Durante casi dos décadas lideré el diseño y la dirección de grandes proyectos residenciales de altura, ayudando a definir el estándar premium de Asunción. Una etapa desarrollada en colaboración con el estudio Gustafson y Asociados.',
    note: 'Obras de esta etapa, desarrolladas en colaboración. La propiedad intelectual corresponde al estudio.',
  },
];

// Línea de tiempo de Nosotros (cada etapa se despliega y muestra sus proyectos).
export const TRAYECTORIA_DEFAULT = [
  {
    yr: '2001–2019',
    titulo: 'Gerente de Proyectos',
    descripcion:
      'Etapa en la que fui responsable del área de diseño y proyecto ejecutivo (Gerente de Proyectos desde 2007), en colaboración con el estudio Gustafson y Asociados. Dirigí equipos de arquitectos, calculistas y especialistas, y ayudé a definir el estándar del mercado residencial premium de altura de Asunción, en edificios de hasta 30 niveles con unidades de 350 a 550 m².',
    proyectos: [
      {
        titulo: 'Edificio Altagracia · 30 niveles',
        descripcion:
          'Diseño, proyecto ejecutivo, dirección de obra, interiorismo y paisajismo. Residencial premium. (2012–2015)',
      },
      {
        titulo: 'Edificio Casa Vista · 12 niveles',
        descripcion:
          'Diseño, proyecto ejecutivo, dirección de obra, interiorismo y paisajismo. (2007–2009)',
      },
      {
        titulo: 'Edificio Soleil',
        descripcion:
          'Diseño integral y dirección de obra. Pionero del segmento residencial de lujo en Asunción. (2004–2005)',
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
      'Fundo mi estudio y sigo liderando proyectos de gran complejidad: barrios cerrados, residencias premium, interiorismo y diseño náutico, coordinando múltiples equipos independientes.',
    proyectos: [
      {
        titulo: 'Barrio Cerrado Pirarenda · Itacora',
        descripcion:
          'Coordinadora y Project Manager desde el inicio (12 ha): infraestructura, amenities (Club House de 300 m², piscina infinita) y viviendas. 11 proyectos, 5 obras finalizadas. (2021–presente)',
      },
      {
        titulo: 'Edificio Carmen Dora · 27 niveles',
        descripcion:
          'Dirección arquitectónica de obra de un proyecto que yo misma diseñé en Gustafson. (2019–2022)',
      },
      {
        titulo: 'Salumax · Project Manager externo',
        descripcion:
          'Coordinación entre la constructora CCI y los proveedores del cliente. Obra finalizada en plazo. (2020–2022)',
      },
      {
        titulo: 'Casa Itacora',
        descripcion:
          'Residencia premium: diseño, memoria y pliego de especificaciones. Concurso Portinari (Porcelanosa). (2024–2025)',
      },
      {
        titulo: 'Casa del Río · Pirarenda',
        descripcion: 'Project Management y diseño integral, con empresa constructora asociada. (2024)',
      },
      {
        titulo: 'V426 Victory Yachts · interiorismo náutico',
        descripcion:
          'Relevamiento del casco, digitalización en CAD/SketchUp y desarrollo del interior junto al astillero. (2026)',
      },
    ],
  },
  {
    yr: 'Hoy',
    titulo: 'Pionera en diseño náutico',
    descripcion:
      'Primera arquitecta en Paraguay en diseñar interiores de yates, con mercados activos en Paraguay, Brasil (Paraná, São Paulo, costa) y Uruguay (Punta del Este, en expansión).',
    proyectos: [],
  },
];

// Lee el contenido editable de las páginas (Supabase sobre los valores por defecto).
export async function getContent() {
  const c = {
    ...CONTENT_DEFAULTS,
    trayectoria: TRAYECTORIA_DEFAULT,
    stats: INICIO_STATS_DEFAULT,
    showcase: INICIO_SHOWCASE_DEFAULT,
    pilares: NOSOTROS_PILARES_DEFAULT,
    etapas: PROYECTOS_ETAPAS_DEFAULT,
    servicios_pasos: SERVICIOS_PASOS_DEFAULT,
    historia_imagenes: NOSOTROS_HISTORIA_IMAGENES_DEFAULT,
    prensa: NOSOTROS_PRENSA_DEFAULT,
  };
  // claves JSON (array) → propiedad del objeto
  const JSON_KEYS = {
    nosotros_trayectoria: ['trayectoria', TRAYECTORIA_DEFAULT],
    inicio_stats: ['stats', INICIO_STATS_DEFAULT],
    inicio_showcase: ['showcase', INICIO_SHOWCASE_DEFAULT],
    nosotros_pilares: ['pilares', NOSOTROS_PILARES_DEFAULT],
    proyectos_etapas: ['etapas', PROYECTOS_ETAPAS_DEFAULT],
    servicios_pasos: ['servicios_pasos', SERVICIOS_PASOS_DEFAULT],
    nosotros_historia_imagenes: ['historia_imagenes', NOSOTROS_HISTORIA_IMAGENES_DEFAULT],
    nosotros_prensa: ['prensa', NOSOTROS_PRENSA_DEFAULT],
  };
  if (supabaseEnabled && supabase) {
    const claves = [...Object.keys(CONTENT_DEFAULTS), ...Object.keys(JSON_KEYS)];
    const { data } = await supabase
      .from('configuracion')
      .select('clave, valor')
      .in('clave', claves);
    if (data) {
      for (const row of data) {
        if (row.valor == null || row.valor === '') continue;
        if (JSON_KEYS[row.clave]) {
          const [prop, fallback] = JSON_KEYS[row.clave];
          c[prop] = parseJSON(row.valor, fallback);
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
