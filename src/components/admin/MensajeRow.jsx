'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Mail, Trash2 } from 'lucide-react';

function fecha(s) {
  try {
    return new Date(s).toLocaleString('es-PY', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export default function MensajeRow({ m }) {
  const router = useRouter();
  const [leido, setLeido] = useState(m.leido);
  const [busy, setBusy] = useState(false);

  async function toggleLeido() {
    setBusy(true);
    const next = !leido;
    await fetch(`/api/mensajes/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leido: next }),
    });
    setLeido(next);
    setBusy(false);
    router.refresh();
  }

  async function borrar() {
    if (!confirm('¿Eliminar este mensaje?')) return;
    setBusy(true);
    await fetch(`/api/mensajes/${m.id}`, { method: 'DELETE' });
    setBusy(false);
    router.refresh();
  }

  const datos = [m.telefono, m.email, m.tipo_proyecto, m.horario].filter(Boolean).join(' · ');

  return (
    <div className={`ad-card ad-msg${leido ? '' : ' ad-msg--unread'}`}>
      <div className="ad-msg__head">
        <strong>
          {!leido && <span className="ad-msg__dot" aria-label="sin leer" />}
          {m.nombre}
        </strong>
        <span className="ad-hint">
          {m.origen === 'agenda' ? 'Agenda' : 'Contacto'} · {fecha(m.created_at)}
        </span>
      </div>
      {datos && (
        <p className="ad-hint" style={{ margin: '6px 0' }}>
          {datos}
        </p>
      )}
      {m.mensaje && <p style={{ margin: '0 0 12px' }}>{m.mensaje}</p>}
      <div className="ad-actions">
        <button className="ad-btn ad-btn--ghost" onClick={toggleLeido} disabled={busy}>
          {leido ? <Mail size={14} /> : <Check size={14} />}
          {leido ? 'Marcar no leído' : 'Marcar leído'}
        </button>
        <button className="ad-btn ad-btn--danger" onClick={borrar} disabled={busy}>
          <Trash2 size={14} /> Eliminar
        </button>
      </div>
    </div>
  );
}
