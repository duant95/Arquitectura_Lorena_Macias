import NosotrosView from '@/views/Nosotros';
import { getContent } from '@/lib/config';
import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export function generateMetadata() {
  return { title: translate(getLocale(), 'nav.sobre') };
}
export const dynamic = 'force-dynamic';

export default async function NosotrosPage() {
  const locale = getLocale();
  const content = await getContent(locale);
  return <NosotrosView content={content} />;
}
