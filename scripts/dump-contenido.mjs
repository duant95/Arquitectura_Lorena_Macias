// Solo lectura: vuelca el contenido real de la DB (configuracion + proyectos)
// para revisar qué está publicado hoy.  node scripts/dump-contenido.mjs
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data: cfg, error: e1 } = await sb.from('configuracion').select('clave,valor').order('clave');
if (e1) { console.error('config err', e1); process.exit(1); }

// Solo claves base en español (sin sufijo __en / __pt) para ver lo que edita la arqui.
const base = cfg.filter((r) => !/__(en|pt)$/.test(r.clave));
console.log('===== CONFIGURACION (claves base ES) =====');
for (const r of base) {
  let v = r.valor;
  if (typeof v === 'string' && (v.startsWith('[') || v.startsWith('{'))) {
    try { v = JSON.stringify(JSON.parse(v), null, 2); } catch {}
  }
  console.log(`\n### ${r.clave}\n${v}`);
}
console.log(`\n(claves __en/__pt existentes: ${cfg.length - base.length})`);

const { data: proj, error: e2 } = await sb.from('proyectos').select('*').order('orden', { ascending: true });
if (e2) { console.error('proj err', e2); process.exit(1); }
console.log('\n\n===== PROYECTOS (columnas) =====');
if (proj[0]) console.log('columnas:', Object.keys(proj[0]).join(', '));
console.log(`total: ${proj.length}`);
for (const p of proj) {
  console.log(`\n### [${p.orden}] ${p.titulo}  | slug=${p.slug} | cat=${p.categoria} | etapa=${p.etapa ?? '-'} | anio=${p.anio ?? p.year ?? '-'} | destacado=${p.destacado ?? '-'}`);
  if (p.ubicacion) console.log('   ubicacion:', p.ubicacion);
  if (p.resumen) console.log('   resumen:', p.resumen);
}
