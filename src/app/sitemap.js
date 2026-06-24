import { getAllProjects } from '@/lib/projects';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lorenamacias.com';

export default async function sitemap() {
  const fijas = ['', '/sobre-mi', '/proyectos', '/servicios', '/contacto'].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));

  let obras = [];
  try {
    const proyectos = await getAllProjects();
    obras = proyectos.map((p) => ({
      url: `${SITE_URL}/proyecto/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    obras = [];
  }

  return [...fijas, ...obras];
}
