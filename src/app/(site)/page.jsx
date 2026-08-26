import HomeView from '@/views/Home';
import { getServicios, getContent } from '@/lib/config';
import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return { title: { absolute: translate(getLocale(), 'meta.homeTitle') } };
}

export default async function HomePage() {
  const locale = getLocale();
  const [servicios, content] = await Promise.all([getServicios(locale), getContent(locale)]);
  return <HomeView servicios={servicios} content={content} />;
}
