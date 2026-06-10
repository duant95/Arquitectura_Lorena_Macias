// Siembra la base de Supabase con los proyectos de ejemplo (src/data/projects.js).
// Idempotente: usa upsert por `slug`, así se puede correr varias veces sin duplicar.
//
//   node scripts/seed.mjs
//
// Lee las keys de .env.local (necesita SUPABASE_SERVICE_ROLE_KEY).

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { PROJECTS } from '../src/data/projects.js';

// cargar .env.local manualmente
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const FEATURED = new Set(['casa-del-bosque', 'residencia-mk', 'suite-natural']);

const rows = PROJECTS.map((p, i) => ({
  slug: p.slug,
  titulo: p.name,
  categoria_label: p.catLabel,
  categorias: p.cat,
  resumen: p.heroTitle || '',
  descripcion: [p.intro, p.body].filter(Boolean).join('\n\n'),
  proceso: '',
  anio: p.year,
  superficie: p.area,
  ubicacion: p.location,
  servicios: p.services,
  imagen_portada: p.cover || null,
  galeria: (p.gallery || []).filter((g) => g.img).map((g) => ({ url: g.img, alt: g.alt || '' })),
  planos: [],
  renders: [],
  paleta: (p.palette || []).map((c) => ({ name: c.name, hex: c.bg })),
  destacado: FEATURED.has(p.slug),
  orden: i,
}));

const { error } = await sb.from('proyectos').upsert(rows, { onConflict: 'slug' });
if (error) {
  console.error('Error al sembrar:', error.message);
  process.exit(1);
}
const { count } = await sb.from('proyectos').select('*', { count: 'exact', head: true });
console.log(`✓ Sembrados ${rows.length} proyectos. Total en la base: ${count}`);
