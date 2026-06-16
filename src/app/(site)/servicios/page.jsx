import ServiciosView from '@/views/Servicios';
import { getServicios } from '@/lib/config';

export const metadata = { title: 'Servicios' };
export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const servicios = await getServicios();
  return <ServiciosView servicios={servicios} />;
}
