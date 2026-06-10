import ProyectosView from '@/views/Proyectos';
import { getAllProjects } from '@/lib/projects';

export const metadata = { title: 'Proyectos' };
export const dynamic = 'force-dynamic';

export default async function ProyectosPage() {
  const projects = await getAllProjects();
  return <ProyectosView projects={projects} />;
}
