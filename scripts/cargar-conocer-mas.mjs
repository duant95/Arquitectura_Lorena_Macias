// Carga el contenido "Conocer más" (detalle + nota) de los servicios 01-03 en la DB,
// parcheando el JSON `servicios` existente, y re-traduce a EN/PT.
//   node scripts/cargar-conocer-mas.mjs        → vista previa
//   RUN=1 node scripts/cargar-conocer-mas.mjs  → ejecuta
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

const DETALLE = {
  Arquitectura: [
    { titulo: 'Briefing', texto: 'Interpretación de necesidades, estilo de vida, ubicación, expectativas y alcance del proyecto.' },
    { titulo: 'Anteproyecto', texto: 'Implantación, distribución, volumetría y definición conceptual.' },
    { titulo: 'Desarrollo ejecutivo', texto: 'Resolución técnica y documentación necesaria para ejecutar correctamente el proyecto.' },
    { titulo: 'Coordinación de especialidades', texto: 'Articulación con estructura, instalaciones y profesionales involucrados.' },
    { titulo: 'Materialidad', texto: 'Selección de materiales según estética, función, durabilidad, mantenimiento, clima y condiciones específicas del lugar.' },
  ],
  Interiorismo: [
    { titulo: 'Concepto y distribución', texto: 'Organización espacial y definición del carácter de cada ambiente.' },
    { titulo: 'Materialidad', texto: 'Selección de terminaciones y materiales según uso, mantenimiento, durabilidad, contexto y estética.' },
    { titulo: 'Iluminación', texto: 'Definición de iluminación funcional, ambiental y decorativa.' },
    { titulo: 'Mobiliario y equipamiento', texto: 'Diseño y selección de mobiliario, equipamiento y elementos a medida.' },
    { titulo: 'Criterio de diseño', texto: 'No seguir tendencias de manera literal, sino interpretarlas y adaptarlas a la realidad y personalidad de cada proyecto.' },
  ],
  'Diseño Náutico': [
    { titulo: 'Aprovechamiento del espacio', texto: 'Soluciones precisas en superficies reducidas donde cada centímetro tiene una función.' },
    { titulo: 'Materiales', texto: 'Selección considerando peso, humedad, vibración, durabilidad y condiciones propias del ambiente náutico.' },
    { titulo: 'Ergonomía', texto: 'Diseño adaptado a la circulación y al uso real de los espacios a bordo.' },
    { titulo: 'Mobiliario e iluminación', texto: 'Elementos diseñados o seleccionados para integrar funcionalidad, confort, identidad y elegancia.' },
  ],
};
const NOTA = {
  'Diseño Náutico':
    'Proyecto desarrollado para Victory Yachts, primer hito de esta especialización.',
};

const { data } = await sb.from('configuracion').select('valor').eq('clave', 'servicios').maybeSingle();
const servicios = JSON.parse(data?.valor || '[]');
for (const s of servicios) {
  if (DETALLE[s.titulo]) s.detalle = DETALLE[s.titulo];
  if (NOTA[s.titulo]) s.nota = NOTA[s.titulo];
}
const valor = JSON.stringify(servicios);
console.log('Servicios con detalle:', servicios.filter((s) => s.detalle?.length).map((s) => `${s.titulo} (${s.detalle.length})`).join(', '));

if (DRY) {
  console.log('\n(DRY-RUN. Usá RUN=1 para aplicar.)');
} else {
  await sb.from('configuracion').upsert({ clave: 'servicios', valor }, { onConflict: 'clave' });
  console.log('✔ ES guardado.');
  for (const loc of TRANSLATE_LOCALES) {
    const tv = await translateConfigValue(valor, loc, { json: true });
    await sb.from('configuracion').upsert({ clave: `servicios__${loc}`, valor: tv }, { onConflict: 'clave' });
    console.log(`→ ${loc}: ok`);
  }
  console.log('✔ Listo.');
}
