import ServiciosView from '@/views/Servicios';
import { getServicios, getContent } from '@/lib/config';

export const metadata = { title: 'Servicios' };
export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const [servicios, content] = await Promise.all([getServicios(), getContent()]);
  return <ServiciosView servicios={servicios} content={content} />;
}
