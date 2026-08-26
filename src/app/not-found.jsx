import Link from 'next/link';
import SiteShell from '../components/SiteShell';
import { getLocale } from '../lib/i18n/server';
import { translate } from '../lib/i18n/ui';
import { localizedHref } from '../lib/i18n/config';

export default function NotFound() {
  const locale = getLocale();
  const t = (k) => translate(locale, k);
  const home = localizedHref('/', locale);
  return (
    <SiteShell locale={locale}>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href={home}>{t('nav.inicio')}</Link>
            <span>/</span>
            <span>{t('nf.crumb')}</span>
          </div>
          <h1>{t('nf.titulo')}</h1>
          <p className="phero__lead">{t('nf.lead')}</p>
          <div style={{ marginTop: 36 }}>
            <Link className="btn" href={home}>
              {t('nf.volver')} <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
