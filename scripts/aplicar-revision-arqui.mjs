// Aplica la revisión editorial de la arqui (HOME, SOBRE MÍ, CONTACTO*, SERVICIOS 01-03,
// PROYECTOS textos) sobre la DB `configuracion`, parcheando los JSON existentes para
// no perder imágenes/URLs, y re-traduce SOLO lo modificado a EN/PT.
//   node scripts/aplicar-revision-arqui.mjs        → vista previa (no escribe)
//   RUN=1 node scripts/aplicar-revision-arqui.mjs  → ejecuta
// (*) Contacto es UI (ui.js), no va por acá.
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

async function getBase(clave) {
  const { data } = await sb.from('configuracion').select('valor').eq('clave', clave).maybeSingle();
  return data?.valor ?? null;
}

// ---------- TEXTOS PLANOS ----------
const TEXT = {
  // HOME
  inicio_hero_eyebrow: 'Arquitectura · Interiorismo · Dirección de Obras · Project Management',
  inicio_hero_descripcion:
    'Arquitectura concebida con una <em>visión integral</em>, donde el diseño, la técnica y la experiencia se unen para crear proyectos con identidad.',
  // SOBRE MÍ
  nosotros_hero_lead:
    'Soy Lorena Macías, arquitecta. Integro Arquitectura, Interiorismo, Dirección de Obras y Project Management para acompañar cada proyecto desde la primera idea hasta su materialización.',
  nosotros_estudio_texto:
    'Estudio de Arquitectura Lorena Macías integra Arquitectura, Interiorismo, Dirección de Obras y Project Management, con más de 25 años de experiencia. Acompaño cada proyecto con una mirada integral, desde la primera idea hasta su materialización, coordinando diseño, técnica, planificación y ejecución para cuidar la calidad, los plazos, los costos y los detalles que definen el resultado final.',
  nosotros_historia: [
    'Inicié mi carrera profesional en 2001 en Gustafson y Asociados S.A., empresa constructora dedicada principalmente al desarrollo de edificios residenciales de alto estándar. Desde 2006 me desempeñé como Gerente de Proyectos y Arquitectura, liderando el diseño, desarrollo y dirección arquitectónica de edificios de gran escala, con residencias de entre 350 y 600 m², en su mayoría una unidad por piso y con un alto nivel de personalización y calidad constructiva.',
    'Paralelamente, también me desempeñé en el área inmobiliaria de la empresa, participando directamente en la comercialización, venta y alquiler de las propiedades que proyectábamos y construíamos. Esta experiencia complementó mi formación técnica con una perspectiva diferente: el contacto directo con clientes y usuarios me permitió comprender con mayor profundidad sus necesidades, expectativas y criterios de decisión, así como la relación entre diseño, funcionalidad, calidad y valor inmobiliario.',
    'Durante 18 años, esta combinación de experiencias me brindó una formación integral en diseño, documentación técnica, coordinación de especialidades, materiales y sistemas constructivos, dirección de obras, gestión de proyectos y relación con clientes, acompañando los proyectos desde su concepción hasta su ejecución y comercialización.',
    'En 2019 fundé Estudio Lorena Macías, iniciando una etapa profesional propia en la que integro esa experiencia con una visión más personal de la arquitectura y el interiorismo.',
    'Actualmente desarrollo proyectos de distintas escalas y tipologías: diseño y ejecución de viviendas, reformas integrales, oficinas y espacios corporativos, planificación y desarrollo de barrios cerrados, paisajismo y diseño de interiores náuticos, abordando cada proyecto desde una mirada integral.',
    'La Dirección de Obras y el Project Management forman parte esencial de esta manera de trabajar. Diseño, técnica, planificación y ejecución se coordinan desde el inicio para mantener una misma visión durante todo el proceso, cuidando la calidad, los plazos, los costos y los detalles que definen el resultado final.',
    'Esta diversidad de experiencias ha construido mi manera de entender la arquitectura: proyectar no es solamente diseñar un espacio, sino comprender a quien lo va a habitar, interpretar sus necesidades y transformar esas ideas en soluciones funcionales, sensibles y técnicamente sólidas, capaces de materializarse con coherencia y calidad.',
    // Última línea = frase destacada (la vista la resalta con mayor jerarquía).
    'Cada proyecto debe encontrar su propia identidad, responder a su entorno y a quienes lo habitan, y estar respaldado por decisiones técnicamente sólidas que permitan llevarlo con coherencia del diseño a la obra.',
  ].join('\n'),
  // PROYECTOS
  proyectos_hero_lead:
    'Una selección de proyectos que recorren distintas escalas y formas de habitar, integrando arquitectura, interiorismo, paisaje, dirección y gestión.',
  // SERVICIOS (encabezado)
  servicios_hero_lead:
    'De la primera idea a la materialización del proyecto. Integro diseño, técnica y gestión en cada etapa, acompañando el proceso con una visión global y una planificación clara.',
};

// ---------- JSON (parche sobre lo existente) ----------
const jsonPatches = {};

// nosotros_trayectoria: sin "CEO"; etapa 2019 = Fundadora y Directora.
{
  const cur = JSON.parse((await getBase('nosotros_trayectoria')) || '[]');
  const byYr = (frag) => cur.findIndex((x) => String(x.yr || '').trim().startsWith(frag));
  const i01 = byYr('2001');
  const i19 = byYr('2019');
  if (i01 >= 0) {
    cur[i01].titulo = 'Gerente de Proyectos · Gustafson y Asociados S.A.';
    cur[i01].descripcion =
      'Desde 2006, responsable del diseño, desarrollo y dirección arquitectónica de edificios residenciales de alto estándar. Una etapa desarrollada dentro de Gustafson y Asociados S.A., junto a un equipo integral.';
  }
  if (i19 >= 0) {
    cur[i19].titulo = 'Fundadora y Directora · Estudio de Arquitectura Lorena Macías';
    cur[i19].descripcion =
      'Mi estudio. Diseño, desarrollo y dirijo proyectos desde una mirada integral, acompañando cada proceso desde su concepción hasta su ejecución: viviendas, barrios cerrados, reformas, interiorismo, oficinas, paisajismo y diseño náutico.';
  }
  jsonPatches.nosotros_trayectoria = JSON.stringify(cur);
}

// proyectos_etapas: sin "CEO", sin etiqueta "Colaboración"; textos nuevos.
{
  const cur = JSON.parse((await getBase('proyectos_etapas')) || '[]');
  const propio = cur.find((x) => x.key === 'propio');
  const gust = cur.find((x) => x.key === 'gustafson');
  if (propio) {
    propio.label = 'Estudio de Arquitectura Lorena Macías';
    propio.period = '2019 — presente';
    propio.blurb =
      'Proyectos desarrollados desde el estudio propio: arquitectura, interiorismo, diseño náutico, dirección de obras, Project Management, reformas, oficinas y paisajismo.';
    propio.note = '';
  }
  if (gust) {
    gust.label = 'Trayectoria profesional · Gustafson y Asociados S.A.';
    gust.period = '2001 — 2019';
    gust.blurb =
      'Durante 18 años formé parte de Gustafson y Asociados S.A. Desde 2006 me desempeñé como Gerente de Proyectos, desarrollando edificios residenciales de alto estándar junto a un equipo integral que concebía y ejecutaba cada obra de manera personalizada dentro de la propia empresa.';
    gust.note =
      'Selección de proyectos desarrollados durante mi trayectoria profesional en Gustafson y Asociados S.A.';
  }
  jsonPatches.proyectos_etapas = JSON.stringify(cur);
}

// servicios: renombrar 01-03, textos/etiquetas nuevos; 04 (Dirección de Obras) texto mínimo
// provisional; 05-07 se mantienen como están.
{
  const cur = JSON.parse((await getBase('servicios')) || '[]');
  const set = (i, patch) => { if (cur[i]) Object.assign(cur[i], patch); };
  set(0, {
    titulo: 'Arquitectura',
    descripcion:
      'Cada proyecto parte de comprender a quien lo va a habitar, su forma de vivir y el entorno en el que se inserta. Desarrollo la arquitectura desde el anteproyecto hasta su resolución ejecutiva, integrando diseño, funcionalidad y precisión técnica para crear espacios con identidad, pensados para perdurar y materializarse con coherencia y calidad.',
    incluye: ['Anteproyecto', 'Proyecto Ejecutivo', 'Documentación Técnica', 'Coordinación de Especialidades'],
  });
  set(1, {
    titulo: 'Interiorismo',
    descripcion:
      'Concibo el interiorismo como una continuidad de la arquitectura. Diseño cada espacio a partir de la forma de vivir y las necesidades de quien lo habita, integrando distribución, materialidad, iluminación, mobiliario y equipamiento para construir ambientes funcionales, atemporales y con una identidad propia.',
    incluye: ['Diseño espacial', 'Materialidad', 'Mobiliario a medida', 'Iluminación'],
  });
  set(2, {
    titulo: 'Diseño Náutico',
    descripcion:
      'El diseño de interiores náuticos exige precisión, funcionalidad y un profundo aprovechamiento del espacio. Cada centímetro, material y solución debe responder a las condiciones propias de la vida a bordo. Integro ergonomía, mobiliario, iluminación y materialidad para crear interiores confortables y elegantes, donde la estética convive con una funcionalidad extrema.',
    incluye: ['Optimización del espacio', 'Materialidad náutica', 'Mobiliario a medida', 'Iluminación'],
  });
  // 04 Dirección de Obras (estaba vacío) — texto mínimo PROVISIONAL hasta el copy final.
  if (cur[3]) {
    cur[3].titulo = 'Dirección de Obras';
    if (!cur[3].descripcion || !cur[3].descripcion.trim()) {
      cur[3].descripcion =
        'Coordino y superviso la ejecución de la obra para que el proyecto se materialice con fidelidad al diseño, cuidando la calidad, los plazos y los costos en cada etapa.';
    }
    if (!Array.isArray(cur[3].incluye) || cur[3].incluye.length === 0) {
      cur[3].incluye = ['Coordinación en obra', 'Control de calidad', 'Plazos y costos', 'Seguimiento técnico'];
    }
  }
  jsonPatches.servicios = JSON.stringify(cur);
}

// ---------- ESCRITURA ----------
const changes = { ...TEXT, ...jsonPatches };
for (const [clave, valor] of Object.entries(changes)) {
  const kind = translatableKind(clave);
  console.log(`\n■ ${clave}  (${kind})`);
  console.log('   ES:', String(valor).slice(0, 90).replace(/\n/g, ' ⏎ ') + (String(valor).length > 90 ? '…' : ''));
  if (DRY) continue;
  const { error } = await sb.from('configuracion').upsert({ clave, valor }, { onConflict: 'clave' });
  if (error) { console.error('   ✗ escribir ES', error.message); continue; }
  for (const loc of TRANSLATE_LOCALES) {
    const tv = await translateConfigValue(valor, loc, { json: kind === 'json' });
    const { error: e2 } = await sb
      .from('configuracion')
      .upsert({ clave: `${clave}__${loc}`, valor: tv }, { onConflict: 'clave' });
    console.log(`   → ${loc}:`, e2 ? '✗ ' + e2.message : 'ok');
  }
}
console.log(DRY ? '\n(DRY-RUN: nada escrito. Usá RUN=1 para aplicar.)' : '\n✔ Listo.');
