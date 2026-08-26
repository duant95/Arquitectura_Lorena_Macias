// Traducción de proyectos (tabla `proyectos`) a EN/PT.
// Las traducciones se guardan en `configuracion` bajo la clave proj__<slug>__<locale>
// (no hace falta tocar el esquema de la tabla). El español queda intacto.
import { translateDeep, deeplEnabled, TRANSLATE_LOCALES } from '../translate.js';

// Campos de texto plano traducibles de un proyecto.
const SCALAR = ['titulo', 'categoria_label', 'resumen', 'descripcion', 'proceso', 'servicios'];

export function projKey(slug, locale) {
  return `proj__${slug}__${locale}`;
}

// Extrae SOLO lo traducible de una fila de proyecto (alineado por índice en arrays).
export function extractProjectTranslatable(row) {
  const t = {};
  for (const k of SCALAR) if (row[k]) t[k] = row[k];
  const arr = (a) => (Array.isArray(a) ? a : []);
  t.galeria = arr(row.galeria).map((g) => ({ alt: g?.alt || '', seccion: g?.seccion || '' }));
  t.planos = arr(row.planos).map((g) => ({ alt: g?.alt || '' }));
  t.renders = arr(row.renders).map((g) => ({ alt: g?.alt || '' }));
  t.paleta = arr(row.paleta).map((p) => ({ name: p?.name || '' }));
  return t;
}

// Traduce una fila de proyecto a `locale`; devuelve el objeto compacto a guardar.
export async function translateProjectRow(row, locale) {
  return translateDeep(extractProjectTranslatable(row), locale);
}

// Traduce un proyecto a EN/PT y guarda las traducciones en `configuracion`.
// Se llama al crear/editar un proyecto. Si DeepL no está, no hace nada (respaldo español).
export async function translateAndStoreProject(sb, row) {
  if (!deeplEnabled() || !row?.slug) return;
  const trRows = [];
  for (const locale of TRANSLATE_LOCALES) {
    try {
      const tr = await translateProjectRow(row, locale);
      trRows.push({ clave: projKey(row.slug, locale), valor: JSON.stringify(tr) });
    } catch (e) {
      console.error('[projectI18n] traducir', row.slug, locale, e.message);
    }
  }
  if (trRows.length) {
    const { error } = await sb.from('configuracion').upsert(trRows);
    if (error) console.error('[projectI18n] guardar traducción:', error.message);
  }
}

// Fusiona una traducción sobre la fila en español (respeta imágenes, colores, etc.).
export function applyProjectTranslation(row, tr) {
  if (!tr) return row;
  const out = { ...row };
  for (const k of SCALAR) if (tr[k]) out[k] = tr[k];
  const mergeArr = (arr, tarr, fields) => {
    if (!Array.isArray(arr)) return arr;
    return arr.map((it, i) => {
      const t = tarr && tarr[i];
      if (!t || !it) return it;
      const m = { ...it };
      for (const f of fields) if (t[f]) m[f] = t[f];
      return m;
    });
  };
  out.galeria = mergeArr(row.galeria, tr.galeria, ['alt', 'seccion']);
  out.planos = mergeArr(row.planos, tr.planos, ['alt']);
  out.renders = mergeArr(row.renders, tr.renders, ['alt']);
  out.paleta = mergeArr(row.paleta, tr.paleta, ['name']);
  return out;
}
