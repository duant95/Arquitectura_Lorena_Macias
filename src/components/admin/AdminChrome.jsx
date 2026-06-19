'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

// Chrome del panel: header con hamburguesa (móvil) + sidebar como drawer.
// En desktop el sidebar es fijo; en móvil se abre sobre un fondo oscuro.
export default function AdminChrome({ email }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="admin-mobile">
        <div className="admin-mobile__brand">
          <img src="/assets/mark-charcoal.png" alt="Lorena Macías" />
          <span>Lorena Macías</span>
        </div>
        <button aria-label="Abrir menú" onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </header>
      <div
        className={'admin-backdrop' + (open ? ' open' : '')}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <AdminSidebar email={email} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
