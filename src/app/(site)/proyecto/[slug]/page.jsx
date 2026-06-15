import { notFound } from 'next/navigation';
import ProyectoView from '@/views/Proyecto';
import { getProjectBySlug, getNextProject } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Proyecto no encontrado' };
  return {
    title: project.name,
    description: project.leadParagraph || `Proyecto de Lorena Macías: ${project.name}`,
    openGraph: { images: project.cover ? [project.cover] : [] },
  };
}

export default async function ProyectoPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();
  const next = await getNextProject(params.slug);
  return <ProyectoView project={project} next={next} />;
}
