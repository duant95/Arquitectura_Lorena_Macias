import { getLocale } from '@/lib/i18n/server';
import { translate } from '@/lib/i18n/ui';

export { default } from '@/views/Contacto';

export const dynamic = 'force-dynamic';

export function generateMetadata() {
  return { title: translate(getLocale(), 'nav.contacto') };
}
