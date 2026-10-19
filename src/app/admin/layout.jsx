import '../../styles/admin.css';
import { Toaster } from 'react-hot-toast';
import { getAdmin } from '@/lib/authServer';
import AdminChrome from '@/components/admin/AdminChrome';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel · Lorena Macías',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const admin = await getAdmin();

  // Sin acceso: solo el contenido (la página de login). El middleware bloquea el resto.
  if (!admin) {
    return (
      <div className="admin">
        {children}
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-shell">
        <AdminChrome email={admin.user.email} rol={admin.rol} />
        <main className="admin-main">{children}</main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: '#2f2c26', color: '#f6f2e9', fontSize: '14px' } }}
      />
    </div>
  );
}
