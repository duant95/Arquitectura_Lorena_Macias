// ============================================================
//  CURADURÍA VISUAL — selección manual (director creativo).
//  Cada imagen fue elegida mirándola (hojas de contacto), no por
//  metadatos. Sube selecciones a curado/<slug>/ y actualiza
//  portadas, galerías, renders y las imágenes del sitio.
//    node scripts/curaduria.mjs         → vista previa
//    RUN=1 node scripts/curaduria.mjs   → ejecuta
// ============================================================
import { readFileSync } from 'fs';
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

const D1 = `${DL}/drive-download-20260714T003920Z-1-001`;
const D2 = `${DL}/drive-download-20260714T004006Z-1-001`;
const D3 = `${DL}/drive-download-20260714T004042Z-1-001`;
const D5 = `${DL}/drive-download-20260714T004146Z-1-001`;
const D6 = `${DL}/drive-download-20260714T004242Z-1-001`;

const CD = `${D6}/OBRAS DE GUSTAFSON Y ASOCIADOS /CARMEN DORA`;
const PK = `${D1}/2. Casa Pirakutu_2024`;
const CH = `${D3}/8. Club House y Portico_ 2023_ba, Pirarenda/Club House Pirarenda `;
const LC = `${D1}/1. Casa La Carolina 2026/La Carolina del Rio_ Fotos_ 2026`;
const GV = `${D5}/casa GV_2020_proyecto y obra`;
const ST = `${D3}/7. Casa Riviera_ Diego Storm`;
const VY = `${D2}/4. Victory Yachts 2026/V426_ Proyecto de diseño interior d ela cabina`;
const A23 = `${D2}/5. Altagracia Depto 23_2025`;

// Selección curada por proyecto. gallery = fotos reales (fase), renders = renders.
const PLAN = {
  'edificio-carmen-dora': {
    cover: 0,
    gallery: [
      { f: `${CD}/edif-carmen-dora-paneo360-  (4).jpg` }, // fachada torre (portada)
      { f: `${CD}/edif-carmen-dora-paneo360-  (26).jpg` }, // terraza al atardecer
      { f: `${CD}/edif-carmen-dora-paneo360-  (25).jpg` }, // piscina nocturna + skyline
      { f: `${CD}/edif-carmen-dora-paneo360-  (15).jpg` }, // piscina aérea + ciudad
      { f: `${CD}/Evento 10-05-2022_LINEAS (63).jpg` },
      { f: `${CD}/Evento 10-05-2022_LINEAS (62).jpg` },
      { f: `${CD}/Evento 10-05-2022_LINEAS (148).jpg` },
      { f: `${CD}/Evento 10-05-2022_LINEAS (102).jpg` },
      { f: `${CD}/Evento 10-05-2022_LINEAS (59).jpg` },
      { f: `${CD}/Evento 10-05-2022_LINEAS (64).jpg` },
    ],
  },
  'casa-pirakutu': {
    cover: 0,
    keepDurante: true,
    gallery: [
      { f: `${PK}/PK_ casa finalizada/LM - Posteo - Espacios.zip - 27.png` }, // exterior dorado
      { f: `${PK}/PK_ casa finalizada/IMG_3349 (1).jpg` }, // nocturna sobre el río
      { f: `${PK}/PK_ casa finalizada/pirarenda-pirakutu-09.JPEG` }, // dron con río
      { f: `${PK}/PK_ casa finalizada/IMG_8900.JPEG` },
      { f: `${PK}/PK_ casa finalizada/IMG_9265.JPEG` },
      { f: `${PK}/PK_ casa finalizada/LM - Posteo - Espacios.zip - 8.png` }, // interior vista río
      { f: `${PK}/PK_ casa finalizada/Pirakutu interiores /Casa Pirakutu.zip - _.png` },
      { f: `${PK}/PK_ casa finalizada/LM - Posteo - Espacios.zip - 14.png` }, // pool con vista
      { f: `${PK}/PK_ casa finalizada/IMG_0443.JPEG` },
    ],
  },
  'barrio-pirarenda-amenities': {
    cover: 0,
    keepDurante: true,
    gallery: [
      { f: `${CH}/Club house Pirarenda _.zip - 14.png` }, // piscina infinita → río (portada)
      { f: `${CH}/Club house Pirarenda _.zip - 6.png` }, // club house dorado
      { f: `${CH}/Club house Pirarenda _.zip - 16.png` },
      { f: `${CH}/Club house Pirarenda _.zip - 13.png` }, // pérgola atardecer
      { f: `${CH}/Club house Pirarenda _.zip - 24.png` }, // aérea dron
      { f: `${CH}/Club house Pirarenda _.zip - 10.png` },
      { f: `${CH}/Club house Pirarenda _.zip - 2.png` },
      { f: `${CH}/Club house Pirarenda _.zip - 11.png` },
      { f: `${CH}/Club house Pirarenda _.zip - 12.png` },
      { f: `${CH}/Club house Pirarenda _.zip - 7.png` },
    ],
  },
  'casa-la-carolina': {
    cover: 0,
    keepDurante: true,
    gallery: [
      { f: `${LC}/IMG_1352.JPEG` }, // casa + piscina + cielo (portada)
      { f: `${LC}/IMG_1369(1).JPEG` },
      { f: `${LC}/IMG_1322.JPEG` },
      { f: `${LC}/IMG_1364.JPEG` },
      { f: `${LC}/IMG_1324.JPEG` },
      { f: `${LC}/IMG_1363.JPEG` },
      { f: `${LC}/IMG_1332.JPEG` },
      { f: `${LC}/IMG_1319.JPEG` },
      { f: `${LC}/IMG_1338.JPEG` },
      { f: `${LC}/IMG_1327.JPEG` },
    ],
  },
  'casa-gv': {
    coverFile: `${GV}/EXTERIOR VISTA 2 DENOISED_Post.jpg`, // render (no hay foto final)
    gallery: [
      { f: `${GV}/20180918_101131.jpg`, fase: 'durante' },
      { f: `${GV}/20180918_101123.jpg`, fase: 'durante' },
      { f: `${GV}/20180918_101156.jpg`, fase: 'durante' },
    ],
  },
  'casa-storm': {
    coverFile: `${ST}/_PROPUESTA STORM - 11.PNG`, // render atardecer (obra en proceso)
    keepDurante: true,
    gallery: [],
  },
  'v426-victory-yachts': {
    coverFile: `${VY}/V426 Dis Int (5).png`,
    renders: [
      `${VY}/V426 Dis Int (5).png`,
      `${VY}/Copia de 7.png`,
      `${VY}/Escena 1_2.png`,
      `${VY}/V426 Dis Int (10).png`,
      `${VY}/V426 Dis Int (8).png`,
      `${VY}/V426 Dis Int (9).png`,
      `${VY}/V426 Dis Int (7).png`,
      `${VY}/V426 Dis Int (4).png`,
    ],
    gallery: [],
  },
  'edificio-altagracia': {
    cover: 0,
    gallery: [
      { f: `${A23}/3. Galeria/IMG_4620.JPEG` }, // living ventanal curvo + ciudad (portada)
      { f: `${A23}/3. Galeria/IMG_8092.JPEG` },
      { f: `${A23}/Living y comedor social/IMG_8117 (1).JPEG` },
      { f: `${A23}/Living y comedor social/IMG_8101 (1).JPEG` },
      { f: `${A23}/2. Estar, comedor/IMG_8612.JPEG` },
      { f: `${A23}/2. Estar, comedor/IMG_8611.JPEG` },
    ],
    renders: [
      `${A23}/Living y comedor social/Escena 5_1.png`,
      `${A23}/Living y comedor social/Imagen_9.png`,
      `${A23}/3. Galeria/ABRIL 2.png`,
      `${A23}/Living y comedor social/Escena 5.png`,
      `${A23}/Living y comedor social/Imagen_1.png`,
      `${A23}/Living y comedor social/Imagen_10.png`,
    ],
  },
};

// Imágenes del sitio (todas fotos reales de obra terminada).
const SITE = (u) => ({
  inicio_hero_imagen: u('casa-pirakutu', 2), // dron día: casa + río
  inicio_cta_imagen: u('edificio-carmen-dora', 1), // terraza al atardecer
  inicio_showcase: JSON.stringify([
    { imagen: u('casa-pirakutu', 0), titulo: 'Casa Pirakutu', categoria: 'Residencia ribereña', slug: 'casa-pirakutu' },
    { imagen: u('barrio-pirarenda-amenities', 0), titulo: 'Barrio Cerrado Pirarenda', categoria: 'Barrio cerrado · Amenities', slug: 'barrio-pirarenda-amenities' },
    { imagen: u('casa-la-carolina', 0), titulo: 'Casa La Carolina del Río', categoria: 'Residencia', slug: 'casa-la-carolina' },
  ]),
  proyectos_hero_imagen: u('barrio-pirarenda-amenities', 1), // club house dorado
  nosotros_intro_imagen: u('casa-pirakutu', 5), // interior con vista al río
  nosotros_cta_imagen: u('casa-la-carolina', 6), // terraza sobre piscina y río
  nosotros_historia_imagenes: JSON.stringify([
    { imagen: u('edificio-carmen-dora', 0), alt: 'Edificio Carmen Dora' },
    { imagen: u('edificio-carmen-dora', 2), alt: 'Piscina en altura' },
    { imagen: u('casa-la-carolina', 2), alt: 'Casa La Carolina del Río' },
    { imagen: u('barrio-pirarenda-amenities', 3), alt: 'Club House Pirarenda' },
  ]),
});

function optimize(src) {
  const tmp = path.join(os.tmpdir(), `cur-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  execFileSync('sips', ['-Z', '2200', '-s', 'format', 'jpeg', '-s', 'formatOptions', '80', src, '--out', tmp], {
    stdio: 'ignore',
  });
  const buf = readFileSync(tmp);
  execFileSync('rm', ['-f', tmp]);
  return buf;
}
async function up(key, src) {
  const buf = optimize(src);
  const { error } = await sb.storage.from('proyectos').upload(key, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(`${key}: ${error.message}`);
  return sb.storage.from('proyectos').getPublicUrl(key).data.publicUrl;
}

async function run() {
  console.log(DRY ? '── VISTA PREVIA ──\n' : '── EJECUTANDO CURADURÍA ──\n');
  const { data: rows } = await sb.from('proyectos').select('slug,titulo,galeria');
  const bySlug = Object.fromEntries((rows || []).map((r) => [r.slug, r]));
  const urls = {}; // slug -> [gallery urls]

  for (const [slug, plan] of Object.entries(PLAN)) {
    const row = bySlug[slug];
    if (!row) {
      console.log(`⚠ no existe ${slug}`);
      continue;
    }
    console.log(`• ${row.titulo}: ${plan.gallery.length} fotos curadas${plan.renders ? ` + ${plan.renders.length} renders` : ''}${plan.keepDurante ? ' (+durante existentes)' : ''}`);
    if (DRY) continue;

    const galeria = [];
    for (let i = 0; i < plan.gallery.length; i++) {
      const url = await up(`curado/${slug}/f${String(i).padStart(2, '0')}.jpg`, plan.gallery[i].f);
      galeria.push({ url, alt: row.titulo, fase: plan.gallery[i].fase || 'finalizado' });
    }
    if (plan.keepDurante) {
      for (const g of (row.galeria || []).filter((g) => g.fase === 'durante')) galeria.push(g);
    }
    urls[slug] = galeria.map((g) => g.url);

    const patch = { galeria };
    if (plan.renders) {
      const rendersArr = [];
      for (let i = 0; i < plan.renders.length; i++) {
        const url = await up(`curado/${slug}/r${String(i).padStart(2, '0')}.jpg`, plan.renders[i]);
        rendersArr.push({ url, alt: row.titulo });
      }
      patch.renders = rendersArr;
    }
    patch.imagen_portada = plan.coverFile
      ? await up(`curado/${slug}/cover.jpg`, plan.coverFile)
      : galeria[plan.cover]?.url || null;

    const { error } = await sb.from('proyectos').update(patch).eq('slug', slug);
    console.log(error ? `   ⚠ ${error.message}` : `   ✓ portada + ${galeria.length} fotos`);
  }

  if (!DRY) {
    const u = (slug, i) => urls[slug]?.[i] || '';
    const entries = SITE(u);
    const rows2 = Object.entries(entries).map(([clave, valor]) => ({ clave, valor }));
    const { error } = await sb.from('configuracion').upsert(rows2);
    console.log(error ? `⚠ config: ${error.message}` : `✓ imágenes del sitio actualizadas (${rows2.length})`);
  }
  console.log('\nListo.');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
