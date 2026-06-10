import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const sb = createAdminClient();
  const [proyectos, mensajes, noLeidos] = await Promise.all([
    sb.from('proyectos').select('*', { count: 'exact', head: true }),
    sb.from('mensajes').select('*', { count: 'exact', head: true }),
    sb.from('mensajes').select('*', { count: 'exact', head: true }).eq('leido', false),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Hola 👋</h1>
          <p>Gestioná los proyectos y mensajes de tu sitio.</p>
        </div>
        <Link className="ad-btn" href="/admin/proyectos/nuevo">
          <Plus size={16} /> Nuevo proyecto
        </Link>
      </div>

      <div className="ad-grid">
        <Link href="/admin/proyectos" className="ad-card ad-stat">
          <div className="n">{proyectos.count ?? 0}</div>
          <div className="l">Proyectos publicados</div>
        </Link>
        <Link href="/admin/mensajes" className="ad-card ad-stat">
          <div className="n">{mensajes.count ?? 0}</div>
          <div className="l">Mensajes recibidos</div>
        </Link>
        <Link href="/admin/mensajes" className="ad-card ad-stat">
          <div className="n">{noLeidos.count ?? 0}</div>
          <div className="l">Mensajes sin leer</div>
        </Link>
      </div>
    </>
  );
}
