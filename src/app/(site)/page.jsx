import HomeView from '@/views/Home';
import { getFeaturedProjects } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featured = await getFeaturedProjects(3);
  return <HomeView featured={featured} />;
}
