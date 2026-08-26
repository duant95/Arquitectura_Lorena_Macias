import { notFound } from 'next/navigation';
import ProyectoView from '@/views/Proyecto';
import { getProjectBySlug, getNextProject } from '@/lib/projects';
import { getLocale } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const locale = getLocale();
  const project = await getProjectBySlug(params.slug, locale);
  if (!project) return { title: 'Proyecto no encontrado' };
  return {
    title: project.name,
    description: project.leadParagraph || `Proyecto de Lorena Macías: ${project.name}`,
    openGraph: { images: project.cover ? [project.cover] : [] },
  };
}

export default async function ProyectoPage({ params }) {
  const locale = getLocale();
  const project = await getProjectBySlug(params.slug, locale);
  if (!project) notFound();
  const next = await getNextProject(params.slug, locale);
  return <ProyectoView project={project} next={next} />;
}
