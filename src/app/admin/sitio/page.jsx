import { getSiteConfig } from '@/lib/config';
import ConfiguracionEditor from '@/components/admin/ConfiguracionEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Datos del sitio' };

export default async function AdminSitio() {
  const config = await getSiteConfig();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Datos del sitio</h1>
          <p>Datos de contacto que se muestran en todo el sitio (footer, contacto, WhatsApp).</p>
        </div>
      </div>
      <ConfiguracionEditor inicial={config} />
    </>
  );
}
