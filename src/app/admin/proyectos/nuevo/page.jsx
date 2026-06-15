import ProyectoForm from '@/components/admin/ProyectoForm';

export const metadata = { title: 'Nuevo proyecto' };

export default function NuevoProyecto() {
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Nuevo proyecto</h1>
          <p>Completá los datos y subí las imágenes.</p>
        </div>
      </div>
      <ProyectoForm />
    </>
  );
}
