import { getServicios } from '@/lib/config';
import ServiciosEditor from '@/components/admin/ServiciosEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Servicios' };

export default async function AdminServicios() {
  const servicios = await getServicios();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Servicios</h1>
          <p>Editá los servicios que se muestran en el sitio. Arrastrá el orden con las flechas.</p>
        </div>
      </div>
      <ServiciosEditor inicial={servicios} />
    </>
  );
}
