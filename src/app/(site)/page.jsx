import HomeView from '@/views/Home';
import { getFeaturedProjects } from '@/lib/projects';
import { getServicios } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, servicios] = await Promise.all([getFeaturedProjects(3), getServicios()]);
  return <HomeView featured={featured} servicios={servicios} />;
}
