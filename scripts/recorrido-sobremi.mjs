// Reestructura "Mi recorrido" de Sobre mí en etapas cronológicas con imágenes propias por
// etapa (Gustafson vs Estudio), reparte la bio por etapa y define la frase de cierre.
//   node scripts/recorrido-sobremi.mjs        → vista previa
//   RUN=1 node scripts/recorrido-sobremi.mjs  → ejecuta
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

const get = async (k) => {
  const { data } = await sb.from('configuracion').select('valor').eq('clave', k).maybeSingle();
  return data?.valor ?? null;
};
const parse = (v, d) => { try { return JSON.parse(v); } catch { return d; } };

// --- imágenes actuales (mezcladas) ---
const carrusel = parse(await get('nosotros_carrusel'), []);
const histImgs = parse(await get('nosotros_historia_imagenes'), []);
const asImg = (x) => ({ imagen: x.imagen || x.url || '', alt: x.alt || '' });
const todas = [...carrusel, ...histImgs].map(asImg).filter((x) => x.imagen);

// Gustafson = edificios de esa etapa (por el texto alternativo).
const esGustafson = (alt) => /carmen dora|piscina en altura|edificio/i.test(alt || '');
const imgsGustafson = todas.filter((x) => esGustafson(x.alt));
// dedup por url
const dedup = (arr) => {
  const seen = new Set();
  return arr.filter((x) => (seen.has(x.imagen) ? false : seen.add(x.imagen)));
};
const gust = dedup(imgsGustafson);
const propio = dedup(todas.filter((x) => !esGustafson(x.alt)));

// --- bio: repartir párrafos por etapa ---
const bio = String((await get('nosotros_historia')) || '')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);
// 0-2: Gustafson · 3-5: estudio · 6: filosofía · 7: cita de cierre
const parrafosGustafson = bio.slice(0, 3);
const parrafosEstudio = bio.slice(3, 6);
const citaCierre =
  bio[7] ||
  'Cada proyecto debe encontrar su propia identidad, responder a su entorno y a quienes lo habitan, y estar respaldado por decisiones técnicamente sólidas que permitan llevarlo con coherencia del diseño a la obra.';

const trayectoria = [
  {
    yr: '2001 — 2019',
    titulo: 'Trayectoria profesional · Gustafson y Asociados S.A.',
    descripcion: parrafosGustafson.join('\n\n'),
    imagenes: gust,
    pilares: [],
    proyectos: [],
  },
  {
    yr: '2019 — presente',
    titulo: 'Fundadora y Directora · Estudio Lorena Macías',
    descripcion: parrafosEstudio.join('\n\n'),
    imagenes: propio,
    pilares: [
      'Arquitectura',
      'Interiorismo',
      'Diseño Náutico',
      'Dirección de Obras',
      'Project Management',
      'Paisajismo',
    ],
    proyectos: [],
  },
];

const writes = {
  nosotros_trayectoria: JSON.stringify(trayectoria),
  nosotros_cita: citaCierre,
};

console.log('Gustafson →', gust.length, 'imágenes:', gust.map((x) => x.alt).join(' | '));
console.log('Estudio  →', propio.length, 'imágenes:', propio.map((x) => x.alt).join(' | '));
console.log('Etapa 1 párrafos:', parrafosGustafson.length, '· Etapa 2 párrafos:', parrafosEstudio.length);

if (DRY) { console.log('\n(DRY-RUN. RUN=1 para aplicar.)'); process.exit(0); }

for (const [clave, valor] of Object.entries(writes)) {
  await sb.from('configuracion').upsert({ clave, valor }, { onConflict: 'clave' });
  const json = clave === 'nosotros_trayectoria';
  for (const loc of TRANSLATE_LOCALES) {
    const tv = await translateConfigValue(valor, loc, { json });
    await sb.from('configuracion').upsert({ clave: `${clave}__${loc}`, valor: tv }, { onConflict: 'clave' });
  }
  console.log('✔', clave, '(+ en/pt)');
}
console.log('Listo.');
