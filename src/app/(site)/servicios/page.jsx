import ServiciosView from '@/views/Servicios';
import { getServicios, getContent } from '@/lib/config';
import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export function generateMetadata() {
  return { title: translate(getLocale(), 'nav.servicios') };
}
export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const locale = getLocale();
  const [servicios, content] = await Promise.all([getServicios(locale), getContent(locale)]);
  return <ServiciosView servicios={servicios} content={content} />;
}
