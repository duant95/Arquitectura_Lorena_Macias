import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase';
import ProyectoForm from '@/components/admin/ProyectoForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Editar proyecto' };

export default async function EditarProyecto({ params }) {
  const sb = createAdminClient();
  const { data: proyecto } = await sb.from('proyectos').select('*').eq('id', params.id).single();
  if (!proyecto) notFound();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Editar proyecto</h1>
          <p>{proyecto.titulo}</p>
        </div>
      </div>
      <ProyectoForm proyecto={proyecto} isEditing />
    </>
  );
}
