// ============================================================
//  Carga del catálogo maestro de Lorena Macías a Supabase.
//  Lee las fotos del Drive descargado en ~/Downloads, las
//  clasifica por etapa (antes/durante/finalizado) según la
//  subcarpeta, las optimiza (~2000px) y sube + inserta.
//
//  Uso:
//    node scripts/cargar-catalogo.mjs         → vista previa (no toca nada)
//    RUN=1 node scripts/cargar-catalogo.mjs   → ejecuta de verdad
// ============================================================
import { readFileSync, readdirSync, statSync } from 'fs';
import { execFileSync } from 'child_process';
import os from 'os';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DRY = process.env.RUN !== '1';
const DL = path.join(os.homedir(), 'Downloads');

// ---- env ----
const env = {};
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ---- proyectos estrella (marcados "Sí" en el catálogo) ----
const PROJECTS = [
  {
    slug: 'edificio-altagracia',
    titulo: 'Edificio Altagracia',
    categoria_label: 'Edificio · 30 niveles',
    categorias: 'edificio',
    etapa: 'gustafson',
    estado: 'finalizado',
    anio: '2012–2015',
    ubicacion: 'Asunción',
    superficie: '',
    servicios: 'Diseño · Proyecto ejecutivo · Dirección · Interiorismo · Paisajismo',
    descripcion:
      'Torre residencial premium de 30 niveles.\n\nDiseño de Arq. Lorena Macías. Propiedad de Gustafson y Asociados S.A.',
    folderKeys: [], // sin carpeta de fotos disponible
  },
  {
    slug: 'edificio-carmen-dora',
    titulo: 'Edificio Carmen Dora',
    categoria_label: 'Edificio · 27 niveles',
    categorias: 'edificio',
    etapa: 'gustafson',
    estado: 'finalizado',
    anio: 'Diseño G&A · obra 2019–2022',
    ubicacion: 'Asunción',
    superficie: '',
    servicios: 'Diseño (G&A) + Dirección de obra (estudio propio)',
    descripcion:
      'Torre premium de 27 niveles diseñada durante mi etapa en Gustafson y Asociados y dirigida por mí de forma independiente (2019–2022).\n\nDiseño de Arq. Lorena Macías · Dirección independiente.',
    folderKeys: ['OBRAS DE GUSTAFSON', 'CARMEN DORA'],
  },
  {
    slug: 'casa-gv',
    titulo: 'Vivienda Unifamiliar GV',
    categoria_label: 'Residencia',
    categorias: 'residencial',
    etapa: 'propio',
    estado: 'finalizado',
    anio: '2019–2020',
    ubicacion: 'Fernando de la Mora',
    superficie: '865 m² const. · terreno 1.360 m²',
    servicios: 'Diseño · Dirección de obra · Interiorismo',
    descripcion:
      'Líneas puras con ladrillo visto y madera; planta en L y quincho gourmet de más de 100 m². Autoría propia 100% (construcción: Gustafson y Asociados).',
    folderKeys: ['casa GV'],
  },
  {
    slug: 'barrio-pirarenda-amenities',
    titulo: 'Barrio Cerrado Pirarenda · Amenities',
    categoria_label: 'Barrio cerrado · Club House y Pórtico',
    categorias: 'residencial paisaje',
    etapa: 'propio',
    estado: 'finalizado',
    anio: '2021–2023',
    ubicacion: 'Itacora, Río Paraná',
    superficie: '12 ha · Club House 300 m²',
    servicios: 'Coordinación · Project Management · Diseño de amenities · Dirección',
    descripcion:
      'Coordinación del emprendimiento desde cero: relleno y contención de 12 ha, pórtico de acceso y Club House de 300 m² con terraza de 120 m² sin columnas, pérgola de 9 m y piscina infinita con vista al río. Autoría propia 100%.',
    folderKeys: ['Club House y Portico'],
  },
  {
    slug: 'casa-pirakutu',
    titulo: 'Casa Pirakutu',
    categoria_label: 'Residencia ribereña',
    categorias: 'residencial interior',
    etapa: 'propio',
    estado: 'finalizado',
    anio: '2024',
    ubicacion: 'Barrio cerrado Pirarenda, Río Paraná',
    superficie: '250 m²',
    servicios: 'Diseño · Gerenciamiento · Dirección · Interiorismo · Paisajismo',
    descripcion:
      'Vivienda familiar de 250 m² con 4 dormitorios en suite y estar-comedor-parrilla integrados, con vistas privilegiadas al río Paraná. Un refugio contemplativo: el terreno se rellenó con 200 m³ de tierra, con muro de contención de piedra y zapatas de 4 m de profundidad; estructura metálica y cubierta de chapa termoacústica.\n\nAutoría propia 100%. Publicada en la revista NOVARQ.',
    folderKeys: ['Casa Pirakutu_2024'],
  },
  {
    slug: 'casa-itacora',
    titulo: 'Casa Itacora',
    categoria_label: 'Residencia premium',
    categorias: 'residencial',
    etapa: 'propio',
    estado: 'proceso',
    anio: '2024–2025',
    ubicacion: 'Itacora',
    superficie: '',
    servicios: 'Diseño · Interiorismo',
    descripcion:
      'Diseño integral, memoria y pliego de especificaciones. Presentada al Concurso Portinari (Porcelanosa). Autoría propia 100%.',
    folderKeys: [], // renders (sin carpeta clara)
  },
  {
    slug: 'casa-storm',
    titulo: 'Casa Storm',
    categoria_label: 'Residencia',
    categorias: 'residencial',
    etapa: 'propio',
    estado: 'proceso',
    anio: '',
    ubicacion: '',
    superficie: '',
    servicios: 'Diseño · Interiorismo',
    descripcion:
      'Vivienda con sector social, quincho y parrilla; render de autor. Autoría propia 100%.',
    folderKeys: ['Casa Riviera_ Diego Storm'],
  },
  {
    slug: 'v426-victory-yachts',
    titulo: 'Victory Athena V426',
    categoria_label: 'Interiorismo náutico',
    categorias: 'nautico interior',
    etapa: 'propio',
    estado: 'finalizado',
    anio: '2026',
    ubicacion: 'Paraná, Brasil · Victory Yachts',
    superficie: 'Yate 42’',
    servicios: 'Diseño náutico · Interiorismo',
    descripcion:
      'Primer interior de yate diseñado por una arquitecta en Paraguay: relevamiento del casco e interiorismo integral. Autoría propia 100%.',
    folderKeys: ['Victory Yachts 2026'],
  },
];

const IMG_RE = /\.(jpe?g|png|webp|heic)$/i;
const CAPS = { finalizado: 14, durante: 6, antes: 5 };
// panorámicas 360°, planos, cortes y relevamientos → al final (no son buenas fotos web)
const BAD_RE = /paneo|360|plano|planta|corte|vista|topog|releva|croquis|dwg/i;

// resuelve una carpeta bajo ~/Downloads/drive-download-* que matchee las keys (anidadas)
function findFolder(keys) {
  if (!keys.length) return null;
  const drives = readdirSync(DL).filter((d) => d.startsWith('drive-download-'));
  for (const dr of drives) {
    let base = path.join(DL, dr);
    let ok = true;
    for (const key of keys) {
      const kids = safeDirs(base);
      const hit = kids.find((k) => norm(k).includes(norm(key)));
      if (!hit) {
        ok = false;
        break;
      }
      base = path.join(base, hit);
    }
    if (ok) return base;
  }
  return null;
}
function safeDirs(dir) {
  try {
    return readdirSync(dir).filter((n) => {
      try {
        return statSync(path.join(dir, n)).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

function faseOf(relParts) {
  const s = norm(relParts.join(' '));
  if (/antes/.test(s)) return 'antes';
  if (/proceso|obra en|preliminar|terreno|en obra/.test(s)) return 'durante';
  return 'finalizado';
}

// junta todas las imágenes con su fase (según subcarpeta relativa)
function collectImages(root) {
  const out = [];
  (function walk(dir, rel) {
    let entries = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const full = path.join(dir, name);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) walk(full, [...rel, name]);
      else if (IMG_RE.test(name)) out.push({ full, fase: faseOf(rel), size: st.size });
    }
  })(root, []);
  return out;
}

// selecciona con tope por fase, priorizando finalizado como portada
function pick(images) {
  const byFase = { antes: [], durante: [], finalizado: [] };
  for (const im of images) byFase[im.fase].push(im);
  const chosen = [];
  for (const f of ['finalizado', 'durante', 'antes']) {
    // fotos reales primero (por tamaño = calidad); panorámicas/planos al final
    byFase[f].sort(
      (a, b) => (BAD_RE.test(a.full) ? 1 : 0) - (BAD_RE.test(b.full) ? 1 : 0) || b.size - a.size
    );
    for (const im of byFase[f].slice(0, CAPS[f])) chosen.push(im);
  }
  return chosen;
}

function optimizeToBuffer(src) {
  const tmp = path.join(os.tmpdir(), `lm-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`);
  execFileSync('sips', ['-Z', '2000', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', src, '--out', tmp], {
    stdio: 'ignore',
  });
  const buf = readFileSync(tmp);
  return { buf, tmp };
}

async function run() {
  console.log(DRY ? '── VISTA PREVIA (no se sube ni inserta nada) ──\n' : '── EJECUTANDO (subida real) ──\n');

  const { data: existing } = await sb.from('proyectos').select('slug');
  console.log('Proyectos ya en la base:', (existing || []).map((r) => r.slug).join(', ') || '(ninguno)', '\n');

  let orden = 1;
  for (const p of PROJECTS) {
    const folder = findFolder(p.folderKeys);
    let images = folder ? collectImages(folder) : [];
    const chosen = pick(images);
    const counts = chosen.reduce((a, im) => ((a[im.fase] = (a[im.fase] || 0) + 1), a), {});
    console.log(`• ${p.titulo}  [${p.etapa}/${p.estado}]`);
    console.log(`   carpeta: ${folder ? path.basename(folder) : '— (sin fotos, placeholder)'}`);
    console.log(
      `   fotos: ${chosen.length}  (finalizado ${counts.finalizado || 0} · durante ${counts.durante || 0} · antes ${counts.antes || 0})`
    );

    if (DRY) {
      orden++;
      continue;
    }

    // subir imágenes
    const galeria = [];
    let i = 0;
    for (const im of chosen) {
      const { buf, tmp } = optimizeToBuffer(im.full);
      const key = `catalogo/${p.slug}/${String(i).padStart(2, '0')}.jpg`;
      const { error } = await sb.storage.from('proyectos').upload(key, buf, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      try {
        execFileSync('rm', ['-f', tmp]);
      } catch {}
      if (error) {
        console.log('   ⚠ error subiendo', key, error.message);
        continue;
      }
      const { data } = sb.storage.from('proyectos').getPublicUrl(key);
      galeria.push({ url: data.publicUrl, alt: p.titulo, fase: im.fase });
      i++;
    }
    const cover = (galeria.find((g) => g.fase === 'finalizado') || galeria[0])?.url || null;

    const row = {
      slug: p.slug,
      titulo: p.titulo,
      categoria_label: p.categoria_label,
      categorias: p.categorias,
      resumen: p.titulo,
      descripcion: p.descripcion,
      anio: p.anio,
      superficie: p.superficie,
      ubicacion: p.ubicacion,
      servicios: p.servicios,
      etapa: p.etapa,
      estado: p.estado,
      imagen_portada: cover,
      galeria,
      destacado: false,
      orden: orden,
    };
    const { error } = await sb.from('proyectos').upsert(row, { onConflict: 'slug' });
    console.log(error ? `   ⚠ error DB: ${error.message}` : `   ✓ cargado (${galeria.length} fotos)`);
    orden++;
  }

  // Limpieza: dejar SOLO las 8 estrella (borra los placeholder del seed viejo).
  if (process.env.CLEAN === '1') {
    const keep = PROJECTS.map((p) => p.slug);
    const sobra = (existing || []).map((r) => r.slug).filter((s) => !keep.includes(s));
    if (sobra.length) {
      if (DRY) {
        console.log('\n[CLEAN] se borrarían:', sobra.join(', '));
      } else {
        const { error } = await sb.from('proyectos').delete().in('slug', sobra);
        console.log(error ? `\n⚠ error limpieza: ${error.message}` : `\n🧹 borrados: ${sobra.join(', ')}`);
      }
    }
  }
  console.log('\nListo.');
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
