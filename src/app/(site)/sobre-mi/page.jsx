import NosotrosView from '@/views/Nosotros';
import { getContent } from '@/lib/config';

export const metadata = { title: 'Nosotros' };
export const dynamic = 'force-dynamic';

export default async function NosotrosPage() {
  const content = await getContent();
  return <NosotrosView content={content} />;
}
