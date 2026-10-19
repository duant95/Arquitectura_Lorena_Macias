import { redirect } from 'next/navigation';
import { getAdmin, esDuena } from '@/lib/authServer';
import UsuariosEditor from '@/components/admin/UsuariosEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Usuarios' };

export default async function AdminUsuarios() {
  const admin = await getAdmin();
  if (!esDuena(admin)) redirect('/admin');

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Usuarios</h1>
          <p>Quién puede entrar al panel. Cada persona tiene su propio acceso.</p>
        </div>
      </div>
      <UsuariosEditor yo={admin.user.email} />
    </>
  );
}
