import SiteShell from '../../components/SiteShell';
import { getSiteConfig } from '../../lib/config';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const config = await getSiteConfig();
  return <SiteShell config={config}>{children}</SiteShell>;
}
