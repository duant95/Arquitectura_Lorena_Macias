import { supabase, supabaseEnabled } from './supabase';
import { PROJECTS as LOCAL } from '../data/projects';
import { normalizeRow, normalizeLocal, projectYear } from './projectShape';

// Lee todos los proyectos, ordenados cronológicamente (los más recientes primero).
// Usa Supabase si está configurado y tiene datos; si no, cae a los datos locales.
export async function getAllProjects() {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase.from('proyectos').select('*');
    if (!error && data && data.length > 0) {
      const ordenados = [...data].sort(
        (a, b) =>
          projectYear(b.anio) - projectYear(a.anio) ||
          new Date(b.created_at) - new Date(a.created_at)
      );
      return ordenados.map((row, i) => normalizeRow(row, i));
    }
  }
  return LOCAL.map(normalizeLocal);
}

export async function getProjectBySlug(slug) {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProjects(limit = 3) {
  const all = await getAllProjects();
  const destacados = all.filter((p) => p.destacado);
  return (destacados.length ? destacados : all).slice(0, limit);
}

export async function getNextProject(slug) {
  const all = await getAllProjects();
  if (all.length === 0) return null;
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return all[0];
  return all[(i + 1) % all.length];
}
