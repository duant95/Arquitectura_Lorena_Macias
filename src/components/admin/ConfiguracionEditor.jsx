'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CAMPOS = [
  { k: 'contacto_email', label: 'Email', ph: 'arquitectura@lorenamacias.com.py' },
  { k: 'contacto_tel', label: 'Teléfono (visible)', ph: '+595 981 109 295' },
  { k: 'contacto_whatsapp', label: 'WhatsApp (solo números, con código país)', ph: '595981109295' },
  { k: 'contacto_whatsapp_msg', label: 'Mensaje pre-cargado de WhatsApp', ph: 'Hola Lorena…' },
  { k: 'contacto_instagram', label: 'Instagram (usuario, sin @)', ph: 'lorenamacias_arq' },
  { k: 'contacto_ciudad', label: 'Ciudad', ph: 'Asunción, Paraguay' },
];

export default function ConfiguracionEditor({ inicial = {} }) {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    const f = {};
    for (const c of CAMPOS) f[c.k] = inicial[c.k] ?? '';
    return f;
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch('/api/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: form }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || 'Error al guardar');
        return;
      }
      toast.success('Datos guardados');
      router.refresh();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ad-form">
      <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CAMPOS.map((c) => (
          <div className="ad-field" key={c.k}>
            <label>{c.label}</label>
            <input
              className="ad-input"
              value={form[c.k]}
              placeholder={c.ph}
              onChange={(e) => setForm((f) => ({ ...f, [c.k]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <div className="ad-actions">
        <button className="ad-btn" type="button" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar datos'}
        </button>
      </div>
    </div>
  );
}
