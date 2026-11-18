import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase';
import { Plus, Pencil } from 'lucide-react';
import DeleteProyectoButton from '@/components/admin/DeleteProyectoButton';
import { getAdmin, esDuena } from '@/lib/authServer';
import { inferEtapa } from '@/lib/projectShape';
import { ESTADOS, ESTADO_LABEL, compareProjects, normalizeEstado, ordenNum } from '@/lib/projectOrder';

export const dynamic = 'force-dynamic';

// Mismas secciones que la página pública, en el mismo orden.
const ETAPAS = [
  { key: 'propio', label: 'Estudio propio (2019 – presente)' },
  { key: 'gustafson', label: 'Gustafson y Asociados (2001 – 2019)' },
];
const GRUPO_LABEL = { finalizado: 'Finalizados', proceso: 'En proceso', anteproyecto: 'Anteproyectos' };

export default async function AdminProyectos() {
  const puedeBorrar = esDuena(await getAdmin());
  const sb = createAdminClient();
  const { data } = await sb
    .from('proyectos')
    .select(
      'id, slug, titulo, categoria_label, imagen_portada, orden, estado, etapa, anio, created_at'
    );
  // Mismo orden que la página pública (lib/projectOrder).
  const proyectos = [...(data ?? [])].sort(compareProjects);

  const secciones = ETAPAS.map((et) => {
    const deEtapa = proyectos.filter((p) => inferEtapa(p.anio, p.etapa) === et.key);
    const grupos = ESTADOS.map((e) => ({
      estado: e,
      items: deEtapa.filter((p) => normalizeEstado(p.estado) === e),
    })).filter((g) => g.items.length);
    return { ...et, total: deEtapa.length, grupos };
  }).filter((s) => s.total);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Proyectos</h1>
          <p>{proyectos.length} proyectos · en el mismo orden que en la página.</p>
        </div>
        <Link className="ad-btn" href="/admin/proyectos/nuevo">
          <Plus size={16} /> Nuevo proyecto
        </Link>
      </div>
      <p className="ad-hint" style={{ margin: '-6px 0 8px' }}>
        Primero salen los finalizados, después los en proceso y al final los anteproyectos. Dentro de
        cada grupo manda el número de orden (el recuadro de la izquierda): menor = primero.
      </p>

      {proyectos.length === 0 ? (
        <div className="ad-empty">Todavía no hay proyectos. Creá el primero.</div>
      ) : (
        secciones.map((sec) => (
          <section className="ad-etapa-list" key={sec.key}>
            {secciones.length > 1 && <h2 className="ad-etapa-list__title">{sec.label}</h2>}
            {sec.grupos.map((g) => (
              <div className="ad-group" key={g.estado}>
                <h3 className="ad-group__title">
                  {GRUPO_LABEL[g.estado]} <span>· {g.items.length}</span>
                </h3>
                <div className="ad-list">
                  {g.items.map((p) => (
                    <div className="ad-row" key={p.id}>
                      <span className="ad-row__orden" title="Orden dentro de su estado">
                        {ordenNum(p.orden)}
                      </span>
                      {p.imagen_portada ? (
                        <img className="ad-row__thumb" src={p.imagen_portada} alt="" />
                      ) : (
                        <div className="ad-row__thumb" />
                      )}
                      <div className="ad-row__main">
                        <h3>{p.titulo}</h3>
                        <p>
                          {[p.anio?.trim(), p.categoria_label || 'Sin categoría', `/${p.slug}`]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <span className={`ad-badge ad-badge--${normalizeEstado(p.estado)}`}>
                        {ESTADO_LABEL[normalizeEstado(p.estado)]}
                      </span>
                      <div className="ad-actions">
                        <Link className="ad-btn ad-btn--ghost" href={`/admin/proyectos/${p.id}`}>
                          <Pencil size={14} /> Editar
                        </Link>
                        {puedeBorrar && <DeleteProyectoButton id={p.id} titulo={p.titulo} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))
      )}
    </>
  );
}
