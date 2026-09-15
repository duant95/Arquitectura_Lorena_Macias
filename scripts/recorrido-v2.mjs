// Cura el recorrido de Sobre mí para acercarlo al mockup: menos fotos y bien elegidas por
// etapa, epígrafes con nombre + servicios, 6 "valores" y el texto de la transición.
//   node scripts/recorrido-v2.mjs        → preview
//   RUN=1 node scripts/recorrido-v2.mjs  → aplica
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
const get = async (k) => (await sb.from('configuracion').select('valor').eq('clave', k).maybeSingle()).data?.valor ?? null;
const parse = (v, d) => { try { return JSON.parse(v); } catch { return d; } };

const tray = parse(await get('nosotros_trayectoria'), []);
const url = (im) => im.imagen || im.url || '';
const find = (arr, re) => arr.find((im) => re.test(im.alt || '') || re.test(url(im)));
const pick = (arr, ...res) => {
  const out = [];
  for (const re of res) { const m = find(arr, re); if (m && !out.includes(m)) out.push(m); }
  return out;
};

// --- ETAPA 1 · Gustafson: 3 edificios (evitando la foto de pileta mal etiquetada) ---
const g = (tray[0]?.imagenes || []).filter((im) => !/1785714491781/.test(url(im)));
const gImgs = g.slice(0, 3).map((im, i) => ({
  imagen: url(im),
  alt: 'Edificio Carmen Dora',
  sub: ['Asunción', 'Detalle de acceso', 'Piscina en altura'][i] || '',
}));

// --- ETAPA 3 · Estudio: 7 obras distintas, con epígrafe nombre + servicios ---
const e = tray[1]?.imagenes || [];
const g1 = (re) => { const m = find(e, re); return m ? url(m) : ''; };
const usados = new Set();
const one = (re) => {
  const m = (e).find((im) => (re.test(im.alt || '') || re.test(url(im))) && !usados.has(url(im)));
  if (m) usados.add(url(m));
  return m ? url(m) : '';
};
const estudioImgs = [
  { imagen: one(/fernando de la mora|casa-gv/i), alt: 'Casa en Fernando de la Mora', sub: 'Arquitectura · Dirección de obra' },
  { imagen: one(/pirakutu/i), alt: 'Casa Pirakutu', sub: 'Arquitectura · Paisajismo' },
  { imagen: one(/pirarenda.*amenities|amenities|barrio/i), alt: 'Barrio Cerrado Pirarenda · Amenities', sub: 'Desarrollo · Arquitectura · Paisajismo' },
  { imagen: one(/altagracia|departamento|f1/i), alt: 'Residencia DR · Altagracia', sub: 'Interiorismo' },
  { imagen: one(/altagracia|departamento|f0/i), alt: 'Residencia NG · Altagracia', sub: 'Interiorismo' },
  { imagen: one(/storm/i), alt: 'Casa Storm', sub: 'Arquitectura · Paisajismo' },
  { imagen: one(/paloma|casa en pirarenda|pirarenda/i), alt: 'Casa en Pirarenda', sub: 'Arquitectura · Dirección de obra' },
].filter((x) => x.imagen);

const trayectoria = [
  { ...tray[0], imagenes: gImgs, pilares: [] },
  {
    ...tray[1],
    imagenes: estudioImgs,
    pilares: ['Arquitectura', 'Interiorismo', 'Diseño Náutico', 'Dirección de Obras', 'Project Management', 'Paisajismo'],
  },
];

const pilares = [
  { titulo: 'Diseño integral' },
  { titulo: 'Soluciones técnicas' },
  { titulo: 'Acompañamiento en obra' },
  { titulo: 'Entorno y paisajismo' },
  { titulo: 'Experiencia del usuario' },
  { titulo: 'Valor a largo plazo' },
];

const transicion =
  'En 2019 fundé Estudio Lorena Macías para integrar la experiencia adquirida durante casi dos décadas con una visión propia de la arquitectura, el interiorismo y la manera de llevar cada proyecto a la obra.';

const writes = {
  nosotros_trayectoria: JSON.stringify(trayectoria),
  nosotros_pilares: JSON.stringify(pilares),
  nosotros_transicion: transicion,
};

console.log('Gustafson →', gImgs.length, 'fotos');
console.log('Estudio  →', estudioImgs.length, 'fotos:', estudioImgs.map((x) => x.alt).join(' | '));

if (DRY) { console.log('\n(DRY-RUN. RUN=1 para aplicar.)'); process.exit(0); }
for (const [clave, valor] of Object.entries(writes)) {
  await sb.from('configuracion').upsert({ clave, valor }, { onConflict: 'clave' });
  const json = clave !== 'nosotros_transicion';
  for (const loc of TRANSLATE_LOCALES) {
    const tv = await translateConfigValue(valor, loc, { json });
    await sb.from('configuracion').upsert({ clave: `${clave}__${loc}`, valor: tv }, { onConflict: 'clave' });
  }
  console.log('✔', clave);
}
console.log('Listo.');
