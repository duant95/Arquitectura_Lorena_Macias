// Precarga los proyectos reales de Lorena (del CV) en Supabase.
// Reemplaza lo que haya en la tabla `proyectos`. Lorena solo sube las fotos.
//   node scripts/seed-proyectos.mjs
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const PALETA = [
  { name: 'Bronce', hex: '#9c8765' },
  { name: 'Madera', hex: '#8a5d33' },
  { name: 'Piedra', hex: '#a89f90' },
  { name: 'Arena', hex: '#e9ddca' },
];

// Recientes → antiguos. El orden cronológico real lo calcula el sitio por `anio`.
const PROYECTOS = [
  {
    slug: 'v426-victory-yachts',
    titulo: 'V426 Victory Yachts',
    categoria_label: 'Interiorismo náutico',
    categorias: 'nautico interior',
    anio: '2026',
    superficie: "Yate 42'",
    ubicacion: 'Paraguay',
    servicios: 'Diseño náutico',
    resumen: 'Primera arquitecta en Paraguay en diseñar <em>interiores náuticos</em>.',
    descripcion:
      'Relevé el casco desde cero, lo digitalicé en CAD/SketchUp y coordiné con el astillero el desarrollo completo del interior del yate de 42 pies.\nUn proyecto pionero que combina precisión técnica y diseño a medida para la vida a bordo.',
    destacado: true,
  },
  {
    slug: 'casa-itacora',
    titulo: 'Casa Itacora',
    categoria_label: 'Residencia premium',
    categorias: 'residencial interior',
    anio: '2024 — 2025',
    ubicacion: 'Itacora',
    servicios: 'Arquitectura + Interiores',
    resumen: 'Una residencia premium pensada al <em>detalle</em>.',
    descripcion:
      'Diseño integral, memoria descriptiva y pliego de especificaciones. Proyecto presentado al Concurso Portinari (Porcelanosa).',
    destacado: true,
  },
  {
    slug: 'casa-del-rio-pirarenda',
    titulo: 'Casa del Río — Pirarenda',
    categoria_label: 'Residencia',
    categorias: 'residencial',
    anio: '2024',
    ubicacion: 'Pirarenda, Itacora',
    servicios: 'Project Management + Diseño',
    resumen: 'Diseño integral y dirección, junto al <em>río</em>.',
    descripcion:
      'Project management y diseño integral, en coordinación con la empresa constructora asociada.',
  },
  {
    slug: 'barrio-pirarenda-viviendas',
    titulo: 'Barrio Cerrado Pirarenda · Viviendas',
    categoria_label: 'Viviendas · Barrio cerrado',
    categorias: 'residencial arquitectura',
    anio: '2023 — Presente',
    ubicacion: 'Pirarenda, Itacora',
    servicios: 'Arquitectura + Dirección de obra',
    resumen: 'Viviendas de autor dentro del <em>emprendimiento</em>.',
    descripcion:
      'Diseño, gerenciamiento y dirección de obra de viviendas dentro del barrio cerrado. 11 proyectos desarrollados · 5 obras finalizadas, asumiendo en todas el rol de Project Manager y Directora de Obras.',
    destacado: true,
  },
  {
    slug: 'barrio-pirarenda-amenities',
    titulo: 'Barrio Cerrado Pirarenda · Amenities',
    categoria_label: 'Barrio cerrado · Amenities',
    categorias: 'arquitectura paisaje',
    anio: '2021 — 2023',
    superficie: '12 ha',
    ubicacion: 'Pirarenda, Itacora',
    servicios: 'Coordinación + Project Management',
    resumen: 'Un barrio cerrado diseñado desde <em>cero</em>.',
    descripcion:
      'Coordinadora y Project Manager desde el inicio del emprendimiento: coordiné equipos, procesos y proyectos, incluido el relleno y la contención perimetral de las 12 hectáreas.\nDiseñé y dirigí todos los amenities: pórtico de acceso, Club House de 300 m² en dos niveles, terraza de 120 m² sin columnas, pérgola de 9 m sin apoyos intermedios y piscina infinita con vista al Paraná.',
    destacado: true,
  },
  {
    slug: 'edificio-carmen-dora',
    titulo: 'Edificio Carmen Dora',
    categoria_label: 'Edificio · 27 niveles',
    categorias: 'arquitectura edificio',
    anio: '2019 — 2022',
    superficie: '27 niveles',
    ubicacion: 'Asunción',
    servicios: 'Dirección arquitectónica',
    resumen: 'Dirección arquitectónica de una torre de <em>27 niveles</em>.',
    descripcion:
      'Dirección arquitectónica de obra de la torre que yo misma diseñé. Gestión directa de constructores, calculistas y especialistas de instalaciones, concluida exitosamente en 2022.',
    destacado: true,
  },
  {
    slug: 'salumax-project-management',
    titulo: 'Salumax · Project Management',
    categoria_label: 'Project Management',
    categorias: 'arquitectura',
    anio: '2020 — 2022',
    ubicacion: 'Asunción',
    servicios: 'Project Management externo',
    resumen: 'Coordinación de una obra compleja, terminada en <em>plazo</em>.',
    descripcion:
      'Contratada como Project Manager externo para articular la coordinación entre la constructora y los proveedores del cliente, sin vínculo jerárquico sobre ninguno. Obra finalizada exitosamente en plazo; desde 2022 continúo con proyectos de oficinas en el mismo edificio.',
  },
  {
    slug: 'edificio-altagracia',
    titulo: 'Edificio Altagracia',
    categoria_label: 'Edificio · 30 niveles',
    categorias: 'arquitectura edificio',
    anio: '2012 — 2015',
    superficie: '30 niveles',
    ubicacion: 'Asunción',
    servicios: 'Diseño + Dirección',
    resumen: 'Una torre residencial premium de <em>30 niveles</em>.',
    descripcion:
      'Como Gerente de Proyectos en Gustafson y Asociados fui pieza clave del diseño arquitectónico, el proyecto ejecutivo y la dirección de obra. Unidades premium de 350 a 550 m².',
  },
  {
    slug: 'edificio-casa-vista',
    titulo: 'Edificio Casa Vista',
    categoria_label: 'Edificio · 12 niveles',
    categorias: 'arquitectura edificio',
    anio: '2007 — 2009',
    superficie: '12 niveles',
    ubicacion: 'Asunción',
    servicios: 'Diseño + Dirección',
    resumen: 'Unidades premium con una mirada <em>cuidada</em>.',
    descripcion:
      'Pieza clave del equipo de Gustafson y Asociados en el diseño, proyecto ejecutivo, dirección de obra, interiorismo y paisajismo del edificio.',
  },
  {
    slug: 'edificio-soleil',
    titulo: 'Edificio Soleil',
    categoria_label: 'Edificio · Pionero de lujo',
    categorias: 'arquitectura edificio',
    anio: '2004 — 2005',
    ubicacion: 'Asunción',
    servicios: 'Diseño + Dirección',
    resumen: 'Pionero del segmento <em>residencial de lujo</em> en Asunción.',
    descripcion:
      'Pieza clave del equipo de Gustafson y Asociados en el diseño, proyecto ejecutivo, dirección de obra, interiorismo y paisajismo. Un proyecto que marcó el inicio del segmento de lujo en Asunción.',
  },
  {
    slug: 'edificio-santa-teresa',
    titulo: 'Edificio Santa Teresa',
    categoria_label: 'Edificio residencial',
    categorias: 'arquitectura edificio',
    anio: '',
    ubicacion: 'Asunción',
    servicios: 'Diseño + Dirección',
    resumen: 'Diseño integral de un edificio residencial.',
    descripcion:
      'Pieza clave del equipo de Gustafson y Asociados en el diseño, proyecto ejecutivo, dirección de obra, interiorismo y paisajismo.',
  },
];

const rows = PROYECTOS.map((p, i) => ({
  imagen_portada: null,
  galeria: [],
  planos: [],
  renders: [],
  paleta: PALETA,
  proceso: '',
  destacado: false,
  orden: i + 1,
  ...p,
}));

// Reemplaza el contenido actual de la tabla
const { error: delErr } = await sb
  .from('proyectos')
  .delete()
  .gte('created_at', '1900-01-01T00:00:00Z');
if (delErr) {
  console.error('Error al limpiar:', delErr.message);
  process.exit(1);
}

const { error: insErr } = await sb.from('proyectos').insert(rows);
if (insErr) {
  console.error('Error al insertar:', insErr.message);
  process.exit(1);
}
console.log(
  `✅ ${rows.length} proyectos precargados (sin fotos — listos para que Lorena las suba).`
);
