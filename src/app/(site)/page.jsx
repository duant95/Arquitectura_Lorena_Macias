import HomeView from '@/views/Home';
import { getServicios, getContent } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [servicios, content] = await Promise.all([getServicios(), getContent()]);
  return <HomeView servicios={servicios} content={content} />;
}
