// Sube el hero del Home en máxima resolución nativa (sin recomprimir de más,
// sin escalar) y actualiza `inicio_hero_imagen`.
//   node scripts/hero-4k.mjs        → vista previa
//   RUN=1 node scripts/hero-4k.mjs  → ejecuta
import { readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';
import os from 'os';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Casa Pirakutu — casa de vidrio encendida sobre el río, hora azul. La foto más
// "hero" del catálogo: arquitectura premium + drama + cielo para el título.
const PKf = path.join(os.homedir(), 'Downloads', '2. Casa Pirakutu_2024', 'PK_ casa finalizada');
const SRC = path.join(PKf, 'IMG_3349 (1).jpg');
const KEY = 'sitio/home-hero-v3.jpg'; // clave nueva = evita caché del CDN

function optimize(src) {
  const info = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', src], { encoding: 'utf8' });
  const w = +(/pixelWidth:\s*(\d+)/.exec(info)?.[1] || 0);
  const h = +(/pixelHeight:\s*(\d+)/.exec(info)?.[1] || 0);
  const maxDim = Math.max(w, h);
  const tmp = path.join(os.tmpdir(), `hero-${Date.now()}.jpg`);
  const args = [];
  if (maxDim > 3840) args.push('-Z', '3840'); // sólo baja si fuese >4K; nunca escala
  args.push('-s', 'format', 'jpeg', '-s', 'formatOptions', '90', src, '--out', tmp);
  execFileSync('sips', args, { stdio: 'ignore' });
  const buf = readFileSync(tmp);
  execFileSync('rm', ['-f', tmp]);
  return { buf, w, h };
}

async function run() {
  if (!existsSync(SRC)) { console.log('⚠ NO EXISTE:', SRC); process.exit(1); }
  console.log(DRY ? '── VISTA PREVIA ──' : '── EJECUTANDO ──');
  const { buf, w, h } = optimize(SRC);
  console.log(`Fuente: ${path.basename(SRC)}  ${w}x${h}  →  ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
  if (DRY) { console.log('\n(vista previa — nada subido)'); return; }
  const { error } = await sb.storage.from('proyectos').upload(KEY, buf, { contentType: 'image/jpeg', upsert: true });
  if (error) { console.log('⚠', error.message); process.exit(1); }
  const url = sb.storage.from('proyectos').getPublicUrl(KEY).data.publicUrl;
  const { error: e2 } = await sb.from('configuracion').upsert({ clave: 'inicio_hero_imagen', valor: url });
  console.log(e2 ? `⚠ ${e2.message}` : `✓ inicio_hero_imagen = ${url}`);
}
run().catch((e) => { console.error(e); process.exit(1); });
