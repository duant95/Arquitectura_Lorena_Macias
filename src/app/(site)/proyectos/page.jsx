import ProyectosView from '@/views/Proyectos';
import { getAllProjects } from '@/lib/projects';
import { getContent } from '@/lib/config';
import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export function generateMetadata() {
  return { title: translate(getLocale(), 'nav.proyectos') };
}
export const dynamic = 'force-dynamic';

export default async function ProyectosPage() {
  const locale = getLocale();
  const [projects, content] = await Promise.all([getAllProjects(locale), getContent(locale)]);
  return <ProyectosView projects={projects} content={content} />;
}
