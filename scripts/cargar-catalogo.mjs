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
  {
    slug: 'casa-la-carolina',
    titulo: 'Casa La Carolina del Río',
    categoria_label: 'Residencia',
    categorias: 'residencial',
    etapa: 'propio',
    estado: 'finalizado',
    anio: 'Entregada 2026',
    ubicacion: '',
    superficie: '',
    servicios: 'Diseño · Dirección de obra',
    descripcion:
      'Obra entregada a los clientes; período de garantía iniciado. Autoría propia 100%.',
    folderKeys: ['Casa La Carolina'],
  },
  {
    slug: 'casa-paloma',
    titulo: 'Casa Paloma',
    categoria_label: 'Residencia',
    categorias: 'residencial',
    etapa: 'propio',
    estado: 'proceso',
    anio: '',
    ubicacion: 'Pirarenda',
    superficie: '312 m² · lote 524 m²',
    servicios: 'Diseño · Dirección',
    descripcion:
      '312 m² de construcción en un lote de 524 m², para la clienta Paloma Zavala. Autoría propia 100%.',
    folderKeys: ['Casa Paloma Z'],
  },
];

const IMG_RE = /\.(jpe?g|png|webp|heic)$/i;
// tope de FOTOS REALES por fase, y de renders
const CAPS = { finalizado: 16, durante: 8, antes: 5 };
const CAP_RENDERS = 10;
// panorámicas 360°, planos, cortes y relevamientos → al final (no son buenas fotos web)
const BAD_RE = /paneo|360|plano|planta|corte|vista|topog|releva|croquis|dwg/i;

// --- Detección render vs. foto real (a discreción, combinando 3 señales) ---
const CAM_RE = /^(img|dsc|dji|_mg|_dsc|pano|gopr)[-_ ]?\d|^p\d{7}/i; // nombres de cámara/celular
const REALDIR_RE = /finaliz|terminad|fotos?\s*final|obra\s*terminad|exterior|drone|fachada|evento|piscina/;
const RENDERDIR_RE = /render|anteproyecto|propuesta|\b3d\b|proyecto de dise|dis\.?\s?int/;
function hasExif(full) {
  try {
    const o = execFileSync('sips', ['-g', 'make', full], { encoding: 'utf8' });
    return /make:\s*\S/.test(o) && !/<nil>/.test(o);
  } catch {
    return false;
  }
}
// true = render · false = foto real
function isRender(full, rel) {
  const base = path.basename(full).toLowerCase();
  const p = rel.join(' ').toLowerCase();
  if (CAM_RE.test(base) || REALDIR_RE.test(p)) return false; // señal fuerte de foto real
  if (RENDERDIR_RE.test(p)) return true; // carpeta de render/proyecto
  return !hasExif(full); // ambiguo: con EXIF de cámara = real; sin EXIF = render
}

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
      else if (IMG_RE.test(name))
        out.push({ full, fase: faseOf(rel), size: st.size, render: isRender(full, rel) });
    }
  })(root, []);
  return out;
}

const byQuality = (a, b) =>
  (BAD_RE.test(a.full) ? 1 : 0) - (BAD_RE.test(b.full) ? 1 : 0) || b.size - a.size;

// separa FOTOS REALES (galería, por fase) de RENDERS (sección aparte)
function pick(images) {
  const reales = images.filter((im) => !im.render);
  const rends = images.filter((im) => im.render).sort(byQuality);
  const byFase = { antes: [], durante: [], finalizado: [] };
  for (const im of reales) byFase[im.fase].push(im);
  const gallery = [];
  for (const f of ['finalizado', 'durante', 'antes']) {
    byFase[f].sort(byQuality);
    for (const im of byFase[f].slice(0, CAPS[f])) gallery.push(im);
  }
  return { gallery, renders: rends.slice(0, CAP_RENDERS) };
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

  const ONLY = (process.env.ONLY || '').split(',').map((s) => s.trim()).filter(Boolean);
  let orden = 1;
  for (const p of PROJECTS) {
    if (ONLY.length && !ONLY.includes(p.slug)) {
      orden++;
      continue;
    }
    const folder = findFolder(p.folderKeys);
    const images = folder ? collectImages(folder) : [];
    const { gallery, renders } = pick(images);
    const rc = gallery.reduce((a, im) => ((a[im.fase] = (a[im.fase] || 0) + 1), a), {});
    console.log(`• ${p.titulo}  [${p.etapa}/${p.estado}]`);
    console.log(`   carpeta: ${folder ? path.basename(folder) : '— (sin fotos, placeholder)'}`);
    console.log(
      `   fotos reales: ${gallery.length} (final ${rc.finalizado || 0} · dur ${rc.durante || 0} · antes ${rc.antes || 0}) · renders: ${renders.length}`
    );

    if (DRY) {
      orden++;
      continue;
    }

    const subir = async (im, key) => {
      const { buf, tmp } = optimizeToBuffer(im.full);
      const { error } = await sb.storage.from('proyectos').upload(key, buf, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      try {
        execFileSync('rm', ['-f', tmp]);
      } catch {}
      if (error) {
        console.log('   ⚠', key, error.message);
        return null;
      }
      return sb.storage.from('proyectos').getPublicUrl(key).data.publicUrl;
    };

    const galeria = [];
    for (let i = 0; i < gallery.length; i++) {
      const url = await subir(gallery[i], `catalogo/${p.slug}/f${String(i).padStart(2, '0')}.jpg`);
      if (url) galeria.push({ url, alt: p.titulo, fase: gallery[i].fase });
    }
    const rendersArr = [];
    for (let i = 0; i < renders.length; i++) {
      const url = await subir(renders[i], `catalogo/${p.slug}/r${String(i).padStart(2, '0')}.jpg`);
      if (url) rendersArr.push({ url, alt: p.titulo });
    }
    // portada: SIEMPRE una foto real de obra (nunca render); si no hay, cae a render
    const cover =
      (galeria.find((g) => g.fase === 'finalizado') || galeria[0] || rendersArr[0])?.url || null;

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
      renders: rendersArr,
      destacado: false,
      orden: orden,
    };
    const { error } = await sb.from('proyectos').upsert(row, { onConflict: 'slug' });
    console.log(
      error ? `   ⚠ error DB: ${error.message}` : `   ✓ ${galeria.length} fotos + ${rendersArr.length} renders`
    );
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
