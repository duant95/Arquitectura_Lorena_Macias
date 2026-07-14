// Carga las 4 publicaciones de Prensa en configuracion (nosotros_prensa).
//   RUN=1 node scripts/cargar-prensa.mjs
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

function findNovarqPdf() {
  const drives = readdirSync(DL).filter((d) => d.startsWith('drive-download-'));
  for (const dr of drives) {
    const base = path.join(DL, dr, 'NOVARQ_ENTREVISTA 2021');
    try {
      const f = readdirSync(base).find((n) => n.toLowerCase().endsWith('.pdf'));
      if (f) return path.join(base, f);
    } catch {}
  }
  return null;
}
async function uploadPdfCover(pdf) {
  const tmp = path.join(os.tmpdir(), `novarq-${Date.now()}.jpg`);
  execFileSync('sips', ['-s', 'format', 'jpeg', '-Z', '1400', '-s', 'formatOptions', '78', pdf, '--out', tmp], {
    stdio: 'ignore',
  });
  const buf = readFileSync(tmp);
  const key = 'prensa/novarq-4.jpg';
  await sb.storage.from('proyectos').upload(key, buf, { contentType: 'image/jpeg', upsert: true });
  return sb.storage.from('proyectos').getPublicUrl(key).data.publicUrl;
}

async function run() {
  const { data: projs } = await sb.from('proyectos').select('slug,imagen_portada');
  const cover = (slug) => (projs || []).find((p) => p.slug === slug)?.imagen_portada || '';
  const { data: cfg } = await sb.from('configuracion').select('valor').eq('clave', 'nosotros_retrato_imagen').maybeSingle();
  const retrato = cfg?.valor || '';

  let novarq = '';
  const pdf = findNovarqPdf();
  if (pdf && !DRY) novarq = await uploadPdfCover(pdf);

  const prensa = [
    {
      imagen: novarq,
      medio: 'Revista NOVARQ',
      titulo: 'Proyectos de autor en NOVARQ',
      descripcion: 'Publicación de obras del estudio en las ediciones #4 y #23 de la revista.',
      fecha: '2021 · 2024',
      url: '',
    },
    {
      imagen: cover('v426-victory-yachts'),
      medio: 'Revista Náutica · Brasil',
      titulo: 'El primer interior de yate diseñado por una arquitecta en Paraguay',
      descripcion: 'Nota sobre el diseño del interior del Victory Athena V426.',
      fecha: 'Brasil · 2026',
      url: '',
    },
    {
      imagen: retrato,
      medio: 'Fuerza y Forma · TV',
      titulo: 'Entrevista televisiva',
      descripcion: 'Conversación sobre su mirada de la arquitectura, el interiorismo y su trayectoria.',
      fecha: 'Asunción · 2026',
      url: '',
    },
    {
      imagen: cover('casa-gv'),
      medio: 'Diario ABC Color',
      titulo: 'Cobertura en distribución nacional',
      descripcion: 'Nota sobre el estudio y su obra en el diario de mayor distribución del país.',
      fecha: 'Paraguay',
      url: '',
    },
  ];

  console.log(DRY ? '── VISTA PREVIA ──' : '── EJECUTANDO ──');
  for (const p of prensa) console.log(`  • ${p.medio} — ${p.titulo}  [img: ${p.imagen ? 'sí' : '—'}]`);

  if (!DRY) {
    const { error } = await sb
      .from('configuracion')
      .upsert({ clave: 'nosotros_prensa', valor: JSON.stringify(prensa) });
    console.log(error ? `⚠ ${error.message}` : '✓ Prensa cargada (4 publicaciones)');
  }
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
