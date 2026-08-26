// Traduce a EN y PT-BR los proyectos ya cargados en la tabla `proyectos`,
// guardando cada traducción en configuracion (proj__<slug>__<locale>).
//   node scripts/traducir-proyectos.mjs         → vista previa (no escribe)
//   RUN=1 node scripts/traducir-proyectos.mjs   → ejecuta
//   RUN=1 FORCE=1 node ...                       → re-traduce aunque ya exista
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const FORCE = process.env.FORCE === '1';

const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
if (!env.DEEPL_API_KEY) {
  console.error('Falta DEEPL_API_KEY en .env.local');
  process.exit(1);
}
process.env.DEEPL_API_KEY = env.DEEPL_API_KEY;

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { translateProjectRow, projKey } = await import('../src/lib/i18n/projectI18n.js');
const { TRANSLATE_LOCALES } = await import('../src/lib/translate.js');

async function main() {
  const { data: proyectos, error } = await sb.from('proyectos').select('*');
  if (error) throw error;
  if (!proyectos?.length) {
    console.log('No hay proyectos en la tabla.');
    return;
  }

  const claves = [];
  for (const p of proyectos) for (const l of TRANSLATE_LOCALES) claves.push(projKey(p.slug, l));
  const { data: existentes } = await sb.from('configuracion').select('clave').in('clave', claves);
  const yaHay = new Set((existentes || []).map((r) => r.clave));

  const upserts = [];
  for (const p of proyectos) {
    for (const locale of TRANSLATE_LOCALES) {
      const destKey = projKey(p.slug, locale);
      if (!FORCE && yaHay.has(destKey)) continue;
      process.stdout.write(`· ${destKey} … `);
      try {
        const tr = await translateProjectRow(p, locale);
        upserts.push({ clave: destKey, valor: JSON.stringify(tr) });
        console.log('ok');
      } catch (e) {
        console.log('ERROR', e.message);
      }
    }
  }

  console.log(`\n${upserts.length} traducciones ${DRY ? '(vista previa)' : 'a guardar'}`);
  if (!DRY && upserts.length) {
    const { error: upErr } = await sb.from('configuracion').upsert(upserts, { onConflict: 'clave' });
    if (upErr) throw upErr;
    console.log('Guardado.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
