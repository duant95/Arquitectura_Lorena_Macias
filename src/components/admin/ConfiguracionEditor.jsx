'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageField from './ImageField';

const LOGOS = [
  {
    k: 'logo_claro',
    label: 'Logo claro (para fondos oscuros)',
    hint: 'Se usa en el menú sobre el hero oscuro y en el modal.',
  },
  {
    k: 'logo_oscuro',
    label: 'Logo oscuro (para fondos claros)',
    hint: 'Se usa en el menú sólido y en la intro.',
  },
  { k: 'logo_horizontal', label: 'Logo horizontal (acostado)', hint: 'Se usa en el pie de página.' },
];

const CAMPOS = [
  { k: 'contacto_email', label: 'Email', ph: 'arquitectura@lorenamacias.com.py' },
  { k: 'contacto_tel', label: 'Teléfono principal (visible)', ph: '+595 981 109 295' },
  { k: 'contacto_tel2', label: 'Teléfono adicional (opcional)', ph: '+595 …' },
  { k: 'contacto_tel3', label: 'Otro teléfono (opcional)', ph: '+595 …' },
  { k: 'contacto_whatsapp', label: 'WhatsApp (solo números, con código país)', ph: '595981109295' },
  { k: 'contacto_whatsapp_msg', label: 'Mensaje pre-cargado de WhatsApp', ph: 'Hola Lorena…' },
  { k: 'contacto_instagram', label: 'Instagram (usuario, sin @)', ph: 'lorenamacias_arq' },
  { k: 'contacto_linkedin', label: 'LinkedIn (URL del perfil)', ph: 'https://www.linkedin.com/in/…' },
  { k: 'contacto_facebook', label: 'Facebook (URL del perfil)', ph: 'https://www.facebook.com/…' },
  { k: 'contacto_ciudad', label: 'Ciudad', ph: 'Asunción, Paraguay' },
];

export default function ConfiguracionEditor({ inicial = {} }) {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    const f = {};
    for (const c of CAMPOS) f[c.k] = inicial[c.k] ?? '';
    for (const l of LOGOS) f[l.k] = inicial[l.k] ?? '';
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

      <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 className="ad-card__title">Logo</h2>
        <p className="ad-hint" style={{ marginTop: -6 }}>
          Si dejás un logo vacío, se usa el actual. Subí el tuyo para reemplazarlo.
        </p>
        {LOGOS.map((l) => (
          <div key={l.k}>
            <ImageField
              label={l.label}
              value={form[l.k]}
              onChange={(v) => setForm((f) => ({ ...f, [l.k]: v }))}
            />
            <p className="ad-hint">{l.hint}</p>
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
