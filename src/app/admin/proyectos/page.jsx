import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase';
import { Plus, Pencil } from 'lucide-react';
import DeleteProyectoButton from '@/components/admin/DeleteProyectoButton';

export const dynamic = 'force-dynamic';

export default async function AdminProyectos() {
  const sb = createAdminClient();
  const { data: proyectos } = await sb
    .from('proyectos')
    .select('id, slug, titulo, categoria_label, imagen_portada, destacado, orden')
    .order('orden', { ascending: true });

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Proyectos</h1>
          <p>{proyectos?.length ?? 0} proyectos · ordenados por el campo “orden”.</p>
        </div>
        <Link className="ad-btn" href="/admin/proyectos/nuevo">
          <Plus size={16} /> Nuevo proyecto
        </Link>
      </div>

      {!proyectos || proyectos.length === 0 ? (
        <div className="ad-empty">Todavía no hay proyectos. Creá el primero.</div>
      ) : (
        <div className="ad-list">
          {proyectos.map((p) => (
            <div className="ad-row" key={p.id}>
              {p.imagen_portada ? (
                <img className="ad-row__thumb" src={p.imagen_portada} alt="" />
              ) : (
                <div className="ad-row__thumb" />
              )}
              <div className="ad-row__main">
                <h3>{p.titulo}</h3>
                <p>
                  {p.categoria_label || 'Sin categoría'} · /{p.slug}
                </p>
              </div>
              {p.destacado && <span className="ad-badge">Destacado</span>}
              <div className="ad-actions">
                <Link className="ad-btn ad-btn--ghost" href={`/admin/proyectos/${p.id}`}>
                  <Pencil size={14} /> Editar
                </Link>
                <DeleteProyectoButton id={p.id} titulo={p.titulo} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
