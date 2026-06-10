'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function DeleteProyectoButton({ id, titulo }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`¿Eliminar “${titulo}”? Esta acción no se puede deshacer.`)) return;
    setBusy(true);
    const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Proyecto eliminado');
      router.refresh();
    } else {
      toast.error('No se pudo eliminar');
    }
    setBusy(false);
  }

  return (
    <button className="ad-btn ad-btn--danger" onClick={onDelete} disabled={busy}>
      <Trash2 size={14} /> {busy ? '…' : 'Eliminar'}
    </button>
  );
}
