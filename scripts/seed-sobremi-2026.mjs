// Siembra en la DB `configuracion` el contenido nuevo de Sobre mí (rediseño 2026)
// y traduce a EN/PT lo que corresponda. Sólo escribe claves NUEVAS: no toca la
// página vieja hasta que se publique el código.
//   node scripts/seed-sobremi-2026.mjs        → vista previa (no escribe)
//   RUN=1 node scripts/seed-sobremi-2026.mjs  → ejecuta
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
process.env.DEEPL_API_KEY = env.DEEPL_API_KEY;
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const { translateConfigValue, TRANSLATE_LOCALES } = await import('../src/lib/translate.js');
const { translatableKind } = await import('../src/lib/i18n/translatable.js');

// Valores por defecto del rediseño (espejo de src/lib/config.js — mantener en sync).
const IMG = 'https://ydmbkaeovbogevzgdlui.supabase.co/storage/v1/object/public/proyectos/';
const CD_IMG = IMG + 'curado2/edificio-carmen-dora/';

const SCALARS = {
  nosotros_hero_nombre: 'Lorena Macías',
  nosotros_hero_subtitulo: 'Arquitectura y Diseño Interior',
  nosotros_hero_bajada:
    'Con más de 25 años de trayectoria, desarrollo proyectos desde una mirada integral, combinando diseño, técnica y gestión para acompañarlos desde su concepción hasta su materialización.',
  nosotros_hero_stat_n: '+25',
  nosotros_hero_stat_l: 'Años de trayectoria',
  nosotros_cita_apertura:
    'Cada etapa me ha dado herramientas y una mirada más completa para crear, proyectar y construir con sentido.',
  nosotros_exp_periodo: '2001 — 2019',
  nosotros_exp_titulo: 'Experiencia profesional',
  nosotros_exp_texto:
    'Inicié mi carrera profesional en 2001 como arquitecta, diseñando y dirigiendo proyectos residenciales de alto estándar.\nDesde 2006 me desempeñé como Gerente de Proyectos, liderando el diseño, desarrollo y dirección arquitectónica de edificios de gran escala.\nParalelamente, trabajé en el área inmobiliaria, participando en la comercialización, venta y alquiler de las propiedades que proyectábamos y construíamos. Esta experiencia amplió mi comprensión de las necesidades del cliente y de la relación entre diseño, funcionalidad, calidad y valor inmobiliario.',
  nosotros_exp_nota: 'Etapa desarrollada junto a Gustafson y Asociados S.A.',
  nosotros_cierre_frase:
    'Cada proyecto debe encontrar su propia identidad, responder a su entorno y a quienes lo habitan, y estar respaldado por decisiones técnicamente sólidas que permitan llevarlo con coherencia del diseño a la obra.',
  nosotros_cierre_invit:
    'Te invito a conocer una selección de mis obras y proyectos, donde esta visión se materializa en diferentes escalas, contextos y formas de habitar.',
};

const NOSOTROS_TIMELINE_DEFAULT = [
  { yr: '2001', label: 'Inicio de mi trayectoria profesional' },
  { yr: '2019', label: 'Inicio de mi estudio de arquitectura' },
  { yr: 'Hoy', label: 'Nuevos proyectos, más experiencias y el mismo compromiso.' },
];
const NOSOTROS_EXP_IMAGENES_DEFAULT = [
  { imagen: CD_IMG + 'f0.jpg', alt: 'Torres residenciales', sub: '12 a 30 niveles' },
  { imagen: CD_IMG + 'f1.jpg', alt: 'Amenities', sub: 'Terraza social' },
  { imagen: CD_IMG + 'f4.jpg', alt: 'Viviendas', sub: 'Alto estándar' },
  { imagen: IMG + 'sitio/collage-2.jpg', alt: 'Amenities', sub: 'Piscina en altura' },
];
const NOSOTROS_SERVICIOS_DEFAULT = [
  'Arquitectura',
  'Interiorismo',
  'Dirección de Obras',
  'Obras y Reformas',
  'Paisajismo',
  'Diseño Náutico',
  'Project Management',
];
const NOSOTROS_RELATOS_DEFAULT = [
  {
    n: '01',
    titulo: 'El comienzo',
    imagen: IMG + '1784236058334-vcf8prfmn58.jpg',
    slug: 'barrio-pirarenda-amenities',
    texto:
      'En 2019 inicié mi estudio de arquitectura, dando comienzo a una nueva etapa profesional y consolidando una mirada propia sobre el diseño y la manera de llevar cada proyecto a la obra.\nUno de los primeros grandes desafíos fue el diseño y desarrollo de un barrio cerrado en Itacora, Ñeembucú, concebido para quienes buscan una relación cercana con la naturaleza, el río y la pesca.\nFui convocada como arquitecta independiente y Project Manager para su desarrollo y coordinación, proyectando sus principales amenities y viviendas de campo. Desde entonces continúo desarrollando proyectos y dirigiendo obras dentro del mismo emprendimiento.',
  },
  {
    n: '02',
    titulo: 'Una práctica que se amplía',
    imagen: IMG + 'curado2/casa-gv/cover.jpg',
    slug: 'casa-gv',
    texto:
      'A partir de allí, el estudio fue ampliando su campo de trabajo y su alcance, con proyectos en Asunción, San Bernardino y distintos puntos del interior del país, como Itacora y Filadelfia.\nHe desarrollado proyectos de arquitectura e interiorismo, dirigido obras de viviendas y edificios de gran envergadura y alto estándar, y llevado adelante reformas integrales, asumiendo también el rol de Project Manager cuando la escala y la complejidad lo requerían.\nLa búsqueda de nuevos desafíos abrió también nuevas oportunidades, como el diseño náutico, a partir de la convocatoria de un astillero brasileño para desarrollar el interior de una de sus embarcaciones.',
  },
  {
    n: '03',
    titulo: 'Del diseño a la obra, una misma mirada',
    imagen: CD_IMG + 'f4.jpg',
    slug: 'diseno-interior-edifico-altagracia',
    texto:
      'Diseño y desarrollo cada proyecto acompañándolo desde las primeras ideas hasta su materialización. Arquitectura e interiorismo forman parte de un mismo proceso, donde la distribución, la materialidad, la iluminación y los detalles constructivos se piensan en relación con las personas que los van a habitar.\nMi trabajo continúa durante la ejecución a través de la dirección de obra, la coordinación de profesionales, contratistas y proveedores, y el seguimiento de cada etapa: calidad, costos y avances, con una comunicación cercana, clara y transparente.\nLa confianza de mis clientes, que vuelven a elegirme y me recomiendan, ha sido clave en el crecimiento del estudio y es una de las mayores valoraciones de mi trabajo.',
  },
];

const changes = { ...SCALARS };
changes.nosotros_timeline = JSON.stringify(NOSOTROS_TIMELINE_DEFAULT);
changes.nosotros_exp_imagenes = JSON.stringify(NOSOTROS_EXP_IMAGENES_DEFAULT);
changes.nosotros_servicios = JSON.stringify(NOSOTROS_SERVICIOS_DEFAULT);
changes.nosotros_relatos = JSON.stringify(NOSOTROS_RELATOS_DEFAULT);

for (const [clave, valor] of Object.entries(changes)) {
  const kind = translatableKind(clave);
  console.log(`\n■ ${clave}  (${kind || 'sin traducir'})`);
  console.log(
    '   ES:',
    String(valor).slice(0, 90).replace(/\n/g, ' ⏎ ') + (String(valor).length > 90 ? '…' : ''),
  );
  if (DRY) continue;
  const { error } = await sb.from('configuracion').upsert({ clave, valor }, { onConflict: 'clave' });
  if (error) {
    console.error('   ✗ escribir ES', error.message);
    continue;
  }
  if (!kind) continue; // nombre / stat_n → no se traducen
  for (const loc of TRANSLATE_LOCALES) {
    const tv = await translateConfigValue(valor, loc, { json: kind === 'json' });
    const { error: e2 } = await sb
      .from('configuracion')
      .upsert({ clave: `${clave}__${loc}`, valor: tv }, { onConflict: 'clave' });
    console.log(`   → ${loc}:`, e2 ? '✗ ' + e2.message : 'ok');
  }
}
console.log(DRY ? '\n(DRY-RUN: nada escrito. Usá RUN=1 para aplicar.)' : '\n✔ Listo.');
