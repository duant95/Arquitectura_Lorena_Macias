'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase';
import { ROL_DUENA, ROL_LABEL } from '@/lib/roles';
import {
  LayoutDashboard,
  FolderOpen,
  Wrench,
  FileText,
  MessageSquare,
  Settings,
  Users,
  LogOut,
  X,
} from 'lucide-react';

const LINKS = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { href: '/admin/proyectos', label: 'Proyectos', icon: FolderOpen },
  { href: '/admin/servicios', label: 'Servicios', icon: Wrench },
  { href: '/admin/contenido', label: 'Contenido', icon: FileText },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/sitio', label: 'Datos del sitio', icon: Settings },
];

// Sólo la dueña ve la gestión de usuarios.
const LINKS_DUENA = [{ href: '/admin/usuarios', label: 'Usuarios', icon: Users }];

export default function AdminSidebar({ email, rol, open = false, onClose = () => {} }) {
  const pathname = usePathname();
  const router = useRouter();

  const links = rol === ROL_DUENA ? [...LINKS, ...LINKS_DUENA] : LINKS;
  const isActive = (l) => (l.exact ? pathname === l.href : pathname.startsWith(l.href));

  async function logout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className={'admin-side' + (open ? ' open' : '')}>
      <button className="admin-side__close" aria-label="Cerrar menú" onClick={onClose}>
        <X size={20} />
      </button>
      <div className="admin-side__brand">
        <img src="/assets/mark-charcoal.png" alt="Lorena Macías" />
        <span>Lorena Macías</span>
      </div>
      <nav>
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l) ? 'active' : ''}
              onClick={onClose}
            >
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
            {ROL_LABEL[rol] && <> · {ROL_LABEL[rol]}</>}
          </p>
        )}
        <button className="ad-btn ad-btn--ghost" style={{ width: '100%' }} onClick={logout}>
          <LogOut size={15} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
