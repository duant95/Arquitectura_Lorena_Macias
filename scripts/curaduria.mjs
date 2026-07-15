// ============================================================
//  DIRECCIÓN DE ARTE — curaduría v2 (alta resolución).
//  Cada imagen elegida mirándola (hojas de contacto). Prioriza
//  fotos reales de obra terminada, alta resolución, sin posteos
//  ni AI. Optimiza SIN escalar imágenes pequeñas.
//    node scripts/curaduria.mjs         → vista previa
//    RUN=1 node scripts/curaduria.mjs   → ejecuta
// ============================================================
import { readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import os from 'os';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const DL = path.join(os.homedir(), 'Downloads');
const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// --- carpetas fuente (las de la raíz son las más recientes/completas) ---
const PKf = `${DL}/2. Casa Pirakutu_2024/PK_ casa finalizada`;
const LCf = `${DL}/1. Casa La Carolina 2026/La Carolina del Rio_ Fotos_ 2026`;
const CHf = `${DL}/8. Club House y Portico_ 2023_ba, Pirarenda/Club House Pirarenda `;
const D2 = `${DL}/drive-download-20260714T004006Z-1-001`;
const D6 = `${DL}/drive-download-20260714T004242Z-1-001`;
const CD = `${D6}/OBRAS DE GUSTAFSON Y ASOCIADOS /CARMEN DORA`;
const GVd = `${DL}/drive-download-20260714T004146Z-1-001/casa GV_2020_proyecto y obra`;
const STd = `${DL}/drive-download-20260714T004042Z-1-001/7. Casa Riviera_ Diego Storm`;
const VY = `${D2}/4. Victory Yachts 2026/V426_ Proyecto de diseño interior d ela cabina`;
const A23 = `${D2}/5. Altagracia Depto 23_2025`;

const PLAN = {
  'casa-la-carolina': {
    keepDurante: true,
    finalizado: [
      `${LCf}/IMG_1348.JPEG`, // PORTADA: casa + piscina + cielo (simétrica, magazine)
      `${LCf}/IMG_1369(1).JPEG`, // 4K piscina al crepúsculo
      `${LCf}/IMG_1364.JPEG`, // piscina infinita → río
      `${LCf}/IMG_1351.JPEG`,
      `${LCf}/IMG_1363.JPEG`,
      `${LCf}/IMG_1327.JPEG`,
      `${LCf}/IMG_1319.JPEG`,
      `${LCf}/IMG_1323.JPEG`,
      `${LCf}/IMG_1320.JPEG`,
      `${LCf}/IMG_1322.JPEG`,
    ],
  },
  'casa-pirakutu': {
    keepDurante: true,
    finalizado: [
      `${PKf}/IMG_1645.JPEG`, // PORTADA: casa al atardecer + río + cielo dramático
      `${PKf}/IMG_3349 (1).jpg`, // exterior nocturno sobre el río
      `${PKf}/pirarenda-pirakutu-09.JPEG`, // dron con río
      `${PKf}/IMG_3324.jpg`, // interior comedor + vista río
      `${PKf}/IMG_3349.jpg`,
      `${PKf}/IMG_3323.JPEG`,
      `${PKf}/IMG_0443.JPEG`,
      `${PKf}/IMG_9265.JPEG`,
      `${PKf}/IMG_9268.JPEG`,
    ],
  },
  'barrio-pirarenda-amenities': {
    keepDurante: true,
    finalizado: [
      `${CHf}/Club house Pirarenda _.zip - 14.png`, // PORTADA: piscina infinita → río, hora dorada
      `${CHf}/Club house Pirarenda _.zip - 13.png`, // pérgola atardecer
      `${CHf}/Club house Pirarenda _.zip - 16.png`,
      `${CHf}/Club house Pirarenda _.zip - 19.png`, // piscina nocturna
      `${CHf}/Club house Pirarenda _.zip - 10.png`,
      `${CHf}/Club house Pirarenda _.zip - 1.png`,
      `${CHf}/Club house Pirarenda _.zip - 7.png`,
      `${CHf}/Club house Pirarenda _.zip - 6.png`,
      `${CHf}/Club house Pirarenda _.zip - 24.png`, // dron
    ],
  },
  'edificio-carmen-dora': {
    finalizado: [
      `${CD}/edif-carmen-dora-paneo360-  (4).jpg`, // PORTADA: fachada de la torre
      `${CD}/edif-carmen-dora-paneo360-  (26).jpg`, // terraza penthouse atardecer
      `${CD}/edif-carmen-dora-paneo360-  (25).jpg`, // piscina nocturna + skyline
      `${CD}/edif-carmen-dora-paneo360-  (15).jpg`, // piscina aérea + ciudad
      `${CD}/Evento 10-05-2022_LINEAS (63).jpg`,
      `${CD}/Evento 10-05-2022_LINEAS (62).jpg`,
      `${CD}/Evento 10-05-2022_LINEAS (148).jpg`,
      `${CD}/Evento 10-05-2022_LINEAS (102).jpg`,
      `${CD}/Evento 10-05-2022_LINEAS (59).jpg`,
      `${CD}/Evento 10-05-2022_LINEAS (64).jpg`,
    ],
  },
  'edificio-altagracia': {
    finalizado: [
      `${A23}/3. Galeria/IMG_4620.JPEG`, // PORTADA: living ventanal curvo + ciudad
      `${A23}/3. Galeria/IMG_8092.JPEG`,
      `${A23}/Living y comedor social/IMG_8117 (1).JPEG`,
      `${A23}/Living y comedor social/IMG_8101 (1).JPEG`,
      `${A23}/2. Estar, comedor/IMG_8612.JPEG`,
      `${A23}/2. Estar, comedor/IMG_8611.JPEG`,
    ],
    renders: [
      `${A23}/Living y comedor social/Escena 5_1.png`,
      `${A23}/3. Galeria/ABRIL 2.png`,
      `${A23}/Living y comedor social/Escena 5.png`,
      `${A23}/Living y comedor social/Imagen_1.png`,
    ],
  },
  'casa-gv': {
    coverFile: `${GVd}/EXTERIOR VISTA 2 DENOISED_Post.jpg`, // render (no hay foto final del exterior)
    duranteFiles: [`${GVd}/20180918_101131.jpg`, `${GVd}/20180918_101123.jpg`, `${GVd}/20180918_101156.jpg`],
  },
  'casa-storm': {
    coverFile: `${STd}/_PROPUESTA STORM - 11.PNG`,
    keepDurante: true,
  },
  'v426-victory-yachts': {
    coverFile: `${VY}/V426 Dis Int (5).png`,
    renders: [
      `${VY}/V426 Dis Int (5).png`,
      `${VY}/Escena 1_2.png`,
      `${VY}/V426 Dis Int (10).png`,
      `${VY}/V426 Dis Int (8).png`,
      `${VY}/V426 Dis Int (9).png`,
      `${VY}/V426 Dis Int (7).png`,
      `${VY}/V426 Dis Int (4).png`,
    ],
  },
};

// Imágenes del sitio (fuente directa, alta resolución)
const SITE_IMG = {
  'sitio/home-hero': `${PKf}/IMG_1645.JPEG`, // Pirakutu atardecer (mucho aire para el título)
  'sitio/home-cta': `${LCf}/IMG_1363.JPEG`, // La Carolina piscina infinita
  'sitio/sobremi-intro': `${PKf}/IMG_3324.jpg`, // interior con vista al río
  'sitio/sobremi-cta': `${CHf}/Club house Pirarenda _.zip - 13.png`, // pérgola dorada
  'sitio/show-1': `${LCf}/IMG_1348.JPEG`,
  'sitio/show-2': `${CHf}/Club house Pirarenda _.zip - 14.png`,
  'sitio/show-3': `${CD}/edif-carmen-dora-paneo360-  (26).jpg`,
  'sitio/collage-1': `${CD}/edif-carmen-dora-paneo360-  (4).jpg`,
  'sitio/collage-2': `${CD}/edif-carmen-dora-paneo360-  (15).jpg`,
  'sitio/collage-3': `${LCf}/IMG_1364.JPEG`,
  'sitio/collage-4': `${CHf}/Club house Pirarenda _.zip - 13.png`,
  'servicios/arquitectura': `${LCf}/IMG_1348.JPEG`,
  'servicios/pm': `${CHf}/Club house Pirarenda _.zip - 24.png`, // dron (coordinación del emprendimiento)
  'servicios/interiores': `${PKf}/IMG_3324.jpg`,
  'servicios/nautico': `${VY}/V426 Dis Int (5).png`,
  'servicios/reformas': `${A23}/Living y comedor social/IMG_8117 (1).JPEG`,
  'servicios/paisajismo': `${LCf}/IMG_1364.JPEG`,
};

const SERVICIOS = (u) => [
  {
    titulo: 'Proyecto arquitectónico',
    descripcion:
      'Del anteproyecto al proyecto ejecutivo y la dirección de obra. Edificios, barrios cerrados y residencias de alto estándar, resueltos con rigor técnico y sensibilidad de diseño.',
    incluye: ['Anteproyecto & partido de diseño', 'Proyecto ejecutivo & documentación técnica', 'Renders 3D', 'Dirección arquitectónica de obra'],
    imagen: u('servicios/arquitectura'),
  },
  {
    titulo: 'Project Management',
    descripcion:
      'Coordinación integral de proyectos de alta complejidad. Articulo equipos y proveedores, controlo plazos, costos y calidad, y defiendo tu inversión como responsable técnica independiente.',
    incluye: ['Coordinación de equipos y proveedores', 'Control de plazos y costos', 'Gestión de riesgos & change orders', 'Reportes ejecutivos & auditoría independiente'],
    imagen: u('servicios/pm'),
  },
  {
    titulo: 'Diseño de interiores',
    descripcion:
      'Interiores residenciales y comerciales a medida. Definimos materialidad, mobiliario e iluminación para lograr espacios cálidos, sofisticados y funcionales.',
    incluye: ['Residencial & comercial', 'Materialidad', 'Mobiliario a medida', 'Iluminación'],
    imagen: u('servicios/interiores'),
  },
  {
    titulo: 'Interiorismo náutico',
    descripcion:
      'Diseño de interiores náuticos: espacios funcionales y elegantes, pensados al detalle para la vida a bordo y el aprovechamiento de cada centímetro.',
    incluye: ['Aprovechamiento del espacio', 'Materialidad marina', 'Mobiliario a medida', 'Iluminación'],
    imagen: u('servicios/nautico'),
  },
  {
    titulo: 'Reformas y obras',
    descripcion:
      'Renovamos y ampliamos espacios con visión integral. Dirigimos y ejecutamos la obra con estándares de calidad y atención al detalle.',
    incluye: ['Reformas integrales', 'Ampliaciones', 'Dirección de obra', 'Ejecución'],
    imagen: u('servicios/reformas'),
  },
  {
    titulo: 'Paisajismo',
    descripcion:
      'Diseñamos el exterior como una extensión natural de tu ambiente: jardines, decks, piscinas y áreas verdes que conectan el espacio con su entorno.',
    incluye: ['Diseño de jardines', 'Decks & exteriores', 'Vegetación', 'Áreas de relax'],
    imagen: u('servicios/paisajismo'),
  },
];

// optimiza SIN escalar (solo baja si es > 2400px)
function optimize(src) {
  let maxDim = 9999;
  try {
    const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', src], { encoding: 'utf8' });
    const w = +(/pixelWidth:\s*(\d+)/.exec(info)?.[1] || 0);
    const h = +(/pixelHeight:\s*(\d+)/.exec(info)?.[1] || 0);
    maxDim = Math.max(w, h) || 9999;
  } catch {}
  const tmp = path.join(os.tmpdir(), `cur-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  const args = [];
  if (maxDim > 2400) args.push('-Z', '2400');
  args.push('-s', 'format', 'jpeg', '-s', 'formatOptions', '82', src, '--out', tmp);
  execFileSync('sips', args, { stdio: 'ignore' });
  const buf = readFileSync(tmp);
  execFileSync('rm', ['-f', tmp]);
  return buf;
}
async function up(key, src) {
  if (!existsSync(src)) throw new Error(`NO EXISTE: ${src}`);
  const buf = optimize(src);
  const { error } = await sb.storage.from('proyectos').upload(key, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(`${key}: ${error.message}`);
  return sb.storage.from('proyectos').getPublicUrl(key).data.publicUrl;
}

async function run() {
  console.log(DRY ? '── VISTA PREVIA ──\n' : '── EJECUTANDO CURADURÍA v2 ──\n');

  // validar que todos los archivos existan
  let missing = 0;
  const all = [
    ...Object.values(PLAN).flatMap((p) => [...(p.finalizado || []), ...(p.renders || []), ...(p.duranteFiles || []), p.coverFile].filter(Boolean)),
    ...Object.values(SITE_IMG),
  ];
  for (const f of all) if (!existsSync(f)) { console.log('⚠ FALTA:', f); missing++; }
  if (missing) { console.log(`\n${missing} archivos faltan — abortar.`); return; }
  console.log(`✓ ${all.length} archivos verificados en disco.\n`);

  const { data: rows } = await sb.from('proyectos').select('slug,titulo,galeria');
  const bySlug = Object.fromEntries((rows || []).map((r) => [r.slug, r]));

  for (const [slug, plan] of Object.entries(PLAN)) {
    const row = bySlug[slug];
    if (!row) { console.log(`⚠ no existe ${slug}`); continue; }
    const nf = (plan.finalizado || []).length, nr = (plan.renders || []).length, nd = (plan.duranteFiles || []).length;
    console.log(`• ${row.titulo}: ${nf} finalizado · ${nr} renders · ${nd} durante${plan.keepDurante ? ' (+durante existentes)' : ''}`);
    if (DRY) continue;

    const galeria = [];
    let i = 0;
    for (const f of plan.finalizado || []) galeria.push({ url: await up(`curado2/${slug}/f${i++}.jpg`, f), alt: row.titulo, fase: 'finalizado' });
    let j = 0;
    for (const f of plan.duranteFiles || []) galeria.push({ url: await up(`curado2/${slug}/d${j++}.jpg`, f), alt: row.titulo, fase: 'durante' });
    if (plan.keepDurante) for (const g of (row.galeria || []).filter((g) => g.fase === 'durante')) galeria.push(g);

    const patch = { galeria };
    if (plan.renders) {
      const rr = [];
      let k = 0;
      for (const f of plan.renders) rr.push({ url: await up(`curado2/${slug}/r${k++}.jpg`, f), alt: row.titulo });
      patch.renders = rr;
    }
    patch.imagen_portada = plan.coverFile
      ? await up(`curado2/${slug}/cover.jpg`, plan.coverFile)
      : galeria.find((g) => g.fase === 'finalizado')?.url || galeria[0]?.url || null;

    const { error } = await sb.from('proyectos').update(patch).eq('slug', slug);
    console.log(error ? `   ⚠ ${error.message}` : `   ✓ portada + ${galeria.length} fotos`);
  }

  if (DRY) { console.log('\n(vista previa — nada subido)'); return; }

  // imágenes del sitio + servicios
  const U = {};
  for (const [key, src] of Object.entries(SITE_IMG)) U[key] = await up(`${key}.jpg`, src);
  const u = (k) => U[k];
  const entries = {
    inicio_hero_imagen: u('sitio/home-hero'),
    inicio_cta_imagen: u('sitio/home-cta'),
    nosotros_intro_imagen: u('sitio/sobremi-intro'),
    nosotros_cta_imagen: u('sitio/sobremi-cta'),
    proyectos_hero_imagen: u('sitio/show-2'),
    servicios_hero_imagen: u('servicios/arquitectura'),
    inicio_showcase: JSON.stringify([
      { imagen: u('sitio/show-1'), titulo: 'Casa La Carolina del Río', categoria: 'Residencia', slug: 'casa-la-carolina' },
      { imagen: u('sitio/show-2'), titulo: 'Barrio Cerrado Pirarenda', categoria: 'Barrio cerrado · Amenities', slug: 'barrio-pirarenda-amenities' },
      { imagen: u('sitio/show-3'), titulo: 'Edificio Carmen Dora', categoria: 'Edificio · 27 niveles', slug: 'edificio-carmen-dora' },
    ]),
    nosotros_historia_imagenes: JSON.stringify([
      { imagen: u('sitio/collage-1'), alt: 'Edificio Carmen Dora' },
      { imagen: u('sitio/collage-2'), alt: 'Piscina en altura' },
      { imagen: u('sitio/collage-3'), alt: 'Casa La Carolina del Río' },
      { imagen: u('sitio/collage-4'), alt: 'Club House Pirarenda' },
    ]),
    servicios: JSON.stringify(SERVICIOS(u)),
  };
  const cfgRows = Object.entries(entries).map(([clave, valor]) => ({ clave, valor }));
  const { error } = await sb.from('configuracion').upsert(cfgRows);
  console.log(error ? `⚠ config: ${error.message}` : `\n✓ sitio + servicios actualizados (${cfgRows.length} claves)`);
  console.log('\nListo.');
}
run().catch((e) => { console.error(e); process.exit(1); });
