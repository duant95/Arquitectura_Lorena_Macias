'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase';
import { LayoutDashboard, FolderOpen, MessageSquare, LogOut } from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/admin/proyectos', label: 'Proyectos', icon: FolderOpen },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
];

export default function AdminSidebar({ email }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href));

  async function logout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="admin-side">
      <img className="admin-side__logo" src="/assets/logo-charcoal.png" alt="Lorena Macías" />
      <nav>
        {LINKS.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href} className={isActive(l) ? 'active' : ''}>
              <Icon size={17} />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-side__foot">
        {email && (
          <p className="ad-hint" style={{ margin: '0 0 10px', padding: '0 12px' }}>
            {email}
          </p>
        )}
        <button className="ad-btn ad-btn--ghost" style={{ width: '100%' }} onClick={logout}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
