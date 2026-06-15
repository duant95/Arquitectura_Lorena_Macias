import { supabase, supabaseEnabled } from './supabase';
import { PROJECTS as LOCAL } from '../data/projects';
import { normalizeRow, normalizeLocal } from './projectShape';

// Lee todos los proyectos. Usa Supabase si está configurado y tiene datos;
// si no, cae a los proyectos de ejemplo locales (para que el sitio nunca quede vacío).
export async function getAllProjects() {
  if (supabaseEnabled && supabase) {
    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((row, i) => normalizeRow(row, i));
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
