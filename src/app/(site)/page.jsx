import HomeView from '@/views/Home';
import { getFeaturedProjects } from '@/lib/projects';
import { getServicios, getContent } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, servicios, content] = await Promise.all([
    getFeaturedProjects(3),
    getServicios(),
    getContent(),
  ]);
  return <HomeView featured={featured} servicios={servicios} content={content} />;
}
