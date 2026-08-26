// Traduce a EN y PT-BR el contenido ya cargado en `configuracion` usando DeepL,
// guardando cada traducción en la clave `<clave>__en` / `<clave>__pt`.
// El español (claves base) NO se toca.
//   node scripts/traducir-contenido.mjs         → vista previa (no escribe)
//   RUN=1 node scripts/traducir-contenido.mjs   → ejecuta
//   RUN=1 FORCE=1 node ...                       → re-traduce aunque ya exista
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const FORCE = process.env.FORCE === '1';

// --- env ---
const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
if (!env.DEEPL_API_KEY) {
  console.error('Falta DEEPL_API_KEY en .env.local');
  process.exit(1);
}
process.env.DEEPL_API_KEY = env.DEEPL_API_KEY; // para lib/translate.js

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { translateConfigValue, TRANSLATE_LOCALES } = await import('../src/lib/translate.js');
const { TEXT_KEYS, JSON_KEYS } = await import('../src/lib/i18n/translatable.js');

const ALL = [...TEXT_KEYS.map((k) => [k, false]), ...JSON_KEYS.map((k) => [k, true])];

async function main() {
  const baseClaves = ALL.map(([k]) => k);
  const suffixed = [];
  for (const k of baseClaves) for (const l of TRANSLATE_LOCALES) suffixed.push(`${k}__${l}`);

  const { data: rows, error } = await sb
    .from('configuracion')
    .select('clave, valor')
    .in('clave', [...baseClaves, ...suffixed]);
  if (error) throw error;

  const map = new Map(rows.map((r) => [r.clave, r.valor]));
  const upserts = [];

  for (const [clave, isJson] of ALL) {
    const valor = map.get(clave);
    if (valor == null || valor === '') continue; // sin contenido cargado → usa el default traducido
    for (const locale of TRANSLATE_LOCALES) {
      const destKey = `${clave}__${locale}`;
      if (!FORCE && map.get(destKey) != null && map.get(destKey) !== '') continue;
      process.stdout.write(`· ${destKey} … `);
      try {
        const translated = await translateConfigValue(valor, locale, { json: isJson });
        upserts.push({ clave: destKey, valor: translated });
        console.log('ok');
      } catch (e) {
        console.log('ERROR', e.message);
      }
    }
  }

  console.log(`\n${upserts.length} traducciones ${DRY ? '(vista previa, no se escribió)' : 'a guardar'}`);
  if (!DRY && upserts.length) {
    const { error: upErr } = await sb.from('configuracion').upsert(upserts, { onConflict: 'clave' });
    if (upErr) throw upErr;
    console.log('Guardado en configuracion.');
  }
  if (DRY && upserts[0]) {
    console.log('\nEjemplo:', upserts[0].clave, '→', String(upserts[0].valor).slice(0, 160));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
