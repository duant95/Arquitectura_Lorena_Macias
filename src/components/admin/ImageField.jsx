'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFile } from '@/lib/upload';

// Campo para una sola imagen (subir / cambiar / quitar).
export default function ImageField({ label, hint, value, onChange }) {
  const [busy, setBusy] = useState(false);

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch {
      toast.error('No se pudo subir la imagen');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div className="ad-field">
      <label>{label}</label>
      {hint && <p className="ad-hint">{hint}</p>}
      {value && (
        <div className="ad-imgs" style={{ marginBottom: 8 }}>
          <div className="ad-img">
            <img src={value} alt="" />
            <div className="ad-img__bar">
              <button
                type="button"
                className="ad-img__btn"
                onClick={() => onChange('')}
                title="Quitar"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
      <label className="ad-upload">
        <Upload size={20} />
        {busy ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
        <input type="file" accept="image/*" hidden onChange={onPick} disabled={busy} />
      </label>
    </div>
  );
}
