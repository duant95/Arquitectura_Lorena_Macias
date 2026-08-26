import SiteShell from '../../components/SiteShell';
import { getSiteConfig } from '../../lib/config';
import { getLocale } from '../../lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const config = await getSiteConfig();
  const locale = getLocale();
  return (
    <SiteShell config={config} locale={locale}>
      {children}
    </SiteShell>
  );
}
