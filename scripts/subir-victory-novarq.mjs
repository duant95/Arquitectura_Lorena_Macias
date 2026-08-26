// Sube a Supabase los renders de Victory (→ proyecto) y las imágenes de NOVARQ
// (#4 portada + pág 29-31, #23) + el PDF de la entrevista (→ prensa), y actualiza
// la base de datos. Traduce a EN/PT lo que cambió.
//   RUN=1 node scripts/subir-victory-novarq.mjs
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import os from 'os';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const DL = path.join(os.homedir(), 'Downloads');
const TMP = '/tmp/lm-content';

const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
process.env.DEEPL_API_KEY = env.DEEPL_API_KEY || '';
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'proyectos';
async function up(localPath, destName, contentType) {
  const buf = readFileSync(localPath);
  const dest = `content/${Date.now()}-${destName}`;
  if (DRY) return `DRY:${dest}`;
  const { error } = await sb.storage.from(BUCKET).upload(dest, buf, { contentType, upsert: false });
  if (error) throw new Error(`upload ${destName}: ${error.message}`);
  const { data } = sb.storage.from(BUCKET).getPublicUrl(dest);
  return data.publicUrl;
}

async function main() {
  // 1) Renders Victory (8) → subir
  const renderUrls = [];
  for (let n = 1; n <= 8; n++) {
    const f = path.join(TMP, `v426-render-${n}.jpg`);
    if (existsSync(f)) renderUrls.push(await up(f, `v426-render-${n}.jpg`, 'image/jpeg'));
  }
  console.log(`renders subidos: ${renderUrls.length}`);

  // 2) NOVARQ imágenes
  const novarq = {};
  for (const key of ['portada', 'p29', 'p30', 'p31']) {
    const f = path.join(TMP, `novarq4-${key}.jpg`);
    if (existsSync(f)) novarq[key] = await up(f, `novarq4-${key}.jpg`, 'image/jpeg');
  }
  const n23 = existsSync(path.join(TMP, 'novarq23.jpg'))
    ? await up(path.join(TMP, 'novarq23.jpg'), 'novarq23.jpg', 'image/jpeg')
    : '';

  // 3) PDF entrevista (Náutica / Victory) → subir
  const pdfLocal = path.join(DL, 'Lorena_Macias_Entrevista_Portugues 19.06.25 (1).pdf');
  const entrevistaPdf = existsSync(pdfLocal)
    ? await up(pdfLocal, 'entrevista-victory-nautica.pdf', 'application/pdf')
    : '';
  console.log('novarq imgs:', Object.keys(novarq), 'n23:', !!n23, 'pdf:', !!entrevistaPdf);

  if (DRY) {
    console.log('\n(DRY-RUN, no se escribió nada. Usá RUN=1 para ejecutar.)');
    return;
  }

  // ---- 4) Proyecto Victory: agregar renders ----
  const { data: proy } = await sb
    .from('proyectos')
    .select('id, slug, renders')
    .eq('slug', 'v426-victory-yachts')
    .maybeSingle();
  if (proy) {
    const prev = Array.isArray(proy.renders) ? proy.renders : [];
    const nuevos = renderUrls.map((url, i) => ({ url, alt: `V426 Victory Yachts · render ${i + 1}` }));
    const renders = [...prev, ...nuevos];
    await sb.from('proyectos').update({ renders }).eq('id', proy.id);
    console.log(`proyecto victory: ${prev.length} → ${renders.length} renders`);
    const { translateAndStoreProject } = await import('../src/lib/i18n/projectI18n.js');
    const { data: full } = await sb.from('proyectos').select('*').eq('id', proy.id).single();
    await translateAndStoreProject(sb, full);
  } else {
    console.log('⚠ no encontré el proyecto v426-victory-yachts');
  }

  // ---- 5) Prensa: NOVARQ (imágenes, sin el PDF completo) + items de Victory ----
  const { data: prRow } = await sb
    .from('configuracion')
    .select('valor')
    .eq('clave', 'nosotros_prensa')
    .maybeSingle();
  let prensa = [];
  try {
    prensa = prRow?.valor ? JSON.parse(prRow.valor) : [];
  } catch {}

  const novarqImgs = [novarq.portada, novarq.p29, novarq.p30, novarq.p31, n23]
    .filter(Boolean)
    .map((url) => ({ url }));
  const idxNovarq = prensa.findIndex((p) => /novarq/i.test(p.medio || ''));
  if (idxNovarq >= 0) {
    prensa[idxNovarq] = {
      ...prensa[idxNovarq],
      imagenes: novarqImgs,
      pdf: '', // solo portada + páginas de su obra, no la revista completa
    };
  } else {
    prensa.push({ medio: 'Revista NOVARQ', fecha: 'Ediciones #4 y #23', titulo: '', descripcion: '', url: '', pdf: '', imagenes: novarqImgs });
  }

  const victoryItems = [
    {
      medio: 'Náutica · Portal (Brasil)',
      fecha: '2026',
      titulo: 'Victory aposta no olhar feminino',
      descripcion: 'Nota sobre el interiorismo náutico del V426 de Victory Yachts.',
      url: 'https://nautica.com.br/victory-aposta-olhar-feminino-lancha-une-aventura-sofisticacao/',
      pdf: entrevistaPdf,
      imagenes: [],
    },
    {
      medio: 'Victory Yachts · Instagram',
      fecha: '',
      titulo: '',
      descripcion: '',
      url: 'https://www.instagram.com/p/DaBDVRXkVVw/',
      pdf: '',
      imagenes: [],
    },
    {
      medio: 'Victory Yachts · Reel',
      fecha: '',
      titulo: '',
      descripcion: '',
      url: 'https://www.instagram.com/reel/DcBPwKLhV1a/',
      pdf: '',
      imagenes: [],
    },
  ];
  // evitar duplicados por URL
  const existentes = new Set(prensa.map((p) => p.url).filter(Boolean));
  for (const it of victoryItems) if (!existentes.has(it.url)) prensa.push(it);

  const valor = JSON.stringify(prensa);
  await sb.from('configuracion').upsert({ clave: 'nosotros_prensa', valor });
  console.log(`prensa: ${prensa.length} publicaciones`);

  // traducir prensa a EN/PT
  const { translateConfigValue, TRANSLATE_LOCALES } = await import('../src/lib/translate.js');
  for (const locale of TRANSLATE_LOCALES) {
    try {
      const tr = await translateConfigValue(valor, locale, { json: true });
      await sb.from('configuracion').upsert({ clave: `nosotros_prensa__${locale}`, valor: tr });
      console.log(`prensa traducida → ${locale}`);
    } catch (e) {
      console.log('translate prensa', locale, e.message);
    }
  }

  console.log('\nListo.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
