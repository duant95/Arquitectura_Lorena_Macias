import ProyectosView from '@/views/Proyectos';
import { getAllProjects } from '@/lib/projects';
import { getContent } from '@/lib/config';

export const metadata = { title: 'Proyectos' };
export const dynamic = 'force-dynamic';

export default async function ProyectosPage() {
  const [projects, content] = await Promise.all([getAllProjects(), getContent()]);
  return <ProyectosView projects={projects} content={content} />;
}
