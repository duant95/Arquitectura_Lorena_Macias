import NosotrosView from '@/views/Nosotros';
import { getContent } from '@/lib/config';
import { getAllProjects } from '@/lib/projects';
import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export function generateMetadata() {
  return { title: translate(getLocale(), 'nav.sobre') };
}
export const dynamic = 'force-dynamic';

export default async function NosotrosPage() {
  const locale = getLocale();
  const [content, proyectos] = await Promise.all([getContent(locale), getAllProjects(locale)]);
  // Carrusel del recorrido: portadas de las obras del estudio propio.
  const obras = proyectos
    .filter((p) => p.etapa === 'propio' && p.cover)
    .map((p) => ({ imagen: p.cover, alt: p.name }));
  return <NosotrosView content={content} obras={obras} />;
}
