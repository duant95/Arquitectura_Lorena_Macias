import { supabase, supabaseEnabled } from './supabase';
import { PROJECTS as LOCAL } from '../data/projects';
import { normalizeRow, normalizeLocal, projectYear } from './projectShape';
import { DEFAULT_LOCALE } from './i18n/config';
import { projKey, applyProjectTranslation } from './i18n/projectI18n';

// Superpone las traducciones (proj__<slug>__<locale>) sobre las filas en español.
async function overlayTranslations(rows, locale) {
  if (locale === DEFAULT_LOCALE) return rows;
  const slugs = rows.map((r) => r.slug).filter(Boolean);
  if (!slugs.length) return rows;
  const claves = slugs.map((s) => projKey(s, locale));
  const { data } = await supabase.from('configuracion').select('clave, valor').in('clave', claves);
  const trMap = new Map();
  if (data) {
    for (const r of data) {
      try {
        trMap.set(r.clave, JSON.parse(r.valor));
      } catch {}
    }
  }
  return rows.map((r) => applyProjectTranslation(r, trMap.get(projKey(r.slug, locale))));
}

// Lee todos los proyectos, ordenados cronológicamente (los más recientes primero).
// Usa Supabase si está configurado y tiene datos; si no, cae a los datos locales.
// locale 'es' devuelve exactamente lo de siempre (sin traducción).
export async function getAllProjects(locale = DEFAULT_LOCALE) {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from('proyectos').select('*');
    if (!error && data && data.length > 0) {
      const ordenados = [...data].sort(
        (a, b) =>
          projectYear(b.anio) - projectYear(a.anio) ||
          new Date(b.created_at) - new Date(a.created_at)
      );
      const rows = await overlayTranslations(ordenados, locale);
      return rows.map((row, i) => normalizeRow(row, i));
    }
  }
  return LOCAL.map(normalizeLocal);
}

export async function getProjectBySlug(slug, locale = DEFAULT_LOCALE) {
  const all = await getAllProjects(locale);
  return all.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProjects(limit = 3, locale = DEFAULT_LOCALE) {
  const all = await getAllProjects(locale);
  const destacados = all.filter((p) => p.destacado);
  return (destacados.length ? destacados : all).slice(0, limit);
}

export async function getNextProject(slug, locale = DEFAULT_LOCALE) {
  const all = await getAllProjects(locale);
  if (all.length === 0) return null;
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return all[0];
  return all[(i + 1) % all.length];
}
