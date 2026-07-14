// Completa las imágenes del sitio (Home + Sobre mí) con fotos reales ya
// cargadas, y sube un retrato de Lorena. Escribe en la tabla `configuracion`.
//   node scripts/completar-contenido.mjs         → vista previa
//   RUN=1 node scripts/completar-contenido.mjs   → ejecuta
import { readFileSync, readdirSync } from 'fs';
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

function findRetrato() {
  const drives = readdirSync(DL).filter((d) => d.startsWith('drive-download-'));
  for (const dr of drives) {
    const base = path.join(DL, dr, 'LM RETRATOS PROFESIONALES');
    try {
      const imgs = readdirSync(base)
        .filter((n) => /\.(jpe?g|png)$/i.test(n))
        .sort();
      if (imgs.length) return path.join(base, imgs[0]);
    } catch {}
  }
  return null;
}

async function uploadRetrato(src) {
  const tmp = path.join(os.tmpdir(), `lm-ret-${Date.now()}.jpg`);
  execFileSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '75', src, '--out', tmp], {
    stdio: 'ignore',
  });
  const buf = readFileSync(tmp);
  const key = 'contenido/retrato-lorena.jpg';
  await sb.storage.from('proyectos').upload(key, buf, { contentType: 'image/jpeg', upsert: true });
  return sb.storage.from('proyectos').getPublicUrl(key).data.publicUrl;
}

async function run() {
  console.log(DRY ? '── VISTA PREVIA ──\n' : '── EJECUTANDO ──\n');
  const { data: projs } = await sb.from('proyectos').select('slug,titulo,galeria,imagen_portada');
  const map = Object.fromEntries((projs || []).map((p) => [p.slug, p]));
  const photo = (slug, i = 0) => {
    const g = map[slug]?.galeria || [];
    return (g[i]?.url) || map[slug]?.imagen_portada || '';
  };

  let retrato = '';
  const src = findRetrato();
  if (src) {
    console.log('Retrato:', path.basename(src));
    if (!DRY) retrato = await uploadRetrato(src);
  }

  const entries = {
    // Inicio
    inicio_hero_imagen: photo('casa-pirakutu', 0),
    inicio_cta_imagen: photo('barrio-pirarenda-amenities', 1),
    inicio_showcase: JSON.stringify([
      { imagen: photo('casa-pirakutu', 0), titulo: 'Casa Pirakutu', categoria: 'Residencia ribereña', slug: 'casa-pirakutu' },
      { imagen: photo('barrio-pirarenda-amenities', 0), titulo: 'Barrio Cerrado Pirarenda', categoria: 'Barrio cerrado · Amenities', slug: 'barrio-pirarenda-amenities' },
      { imagen: photo('v426-victory-yachts', 0), titulo: 'Victory Athena V426', categoria: 'Interiorismo náutico', slug: 'v426-victory-yachts' },
    ]),
    // Sobre mí
    nosotros_intro_imagen: photo('casa-gv', 0),
    nosotros_cta_imagen: photo('casa-storm', 0),
    nosotros_historia_imagenes: JSON.stringify([
      { imagen: photo('edificio-carmen-dora', 0), alt: 'Edificio Carmen Dora' },
      { imagen: photo('edificio-carmen-dora', 2), alt: 'Edificio en altura' },
      { imagen: photo('casa-gv', 0), alt: 'Vivienda GV' },
      { imagen: photo('casa-pirakutu', 0), alt: 'Casa Pirakutu' },
    ]),
  };
  if (retrato) entries.nosotros_retrato_imagen = retrato;

  for (const [k, v] of Object.entries(entries)) {
    const short = typeof v === 'string' && v.length > 70 ? v.slice(0, 67) + '…' : v;
    console.log(`  ${k} = ${short}`);
  }

  if (!DRY) {
    const rows = Object.entries(entries).map(([clave, valor]) => ({ clave, valor }));
    const { error } = await sb.from('configuracion').upsert(rows);
    console.log(error ? `\n⚠ ${error.message}` : `\n✓ ${rows.length} claves guardadas`);
  }
  console.log('\nListo.');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
