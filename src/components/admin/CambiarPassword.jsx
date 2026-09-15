'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { createSupabaseBrowser } from '@/lib/supabase';

// Cambio de contraseña de la propia cuenta (la arqui puede hacerlo sola).
export default function CambiarPassword() {
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [saving, setSaving] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    if (pass.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres.');
    if (pass !== pass2) return toast.error('Las dos contraseñas no coinciden.');
    setSaving(true);
    try {
      const sb = createSupabaseBrowser();
      const { error } = await sb.auth.updateUser({ password: pass });
      if (error) {
        toast.error(error.message || 'No se pudo cambiar la contraseña.');
        return;
      }
      toast.success('Contraseña actualizada.');
      setPass('');
      setPass2('');
    } catch {
      toast.error('Error de conexión.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="ad-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KeyRound size={17} /> Cambiar contraseña
      </div>
      <p className="ad-hint" style={{ margin: 0 }}>
        Elegí una contraseña nueva (mínimo 8 caracteres). El cambio es inmediato; la próxima vez
        entrás con la nueva.
      </p>
      <form onSubmit={guardar} style={{ display: 'grid', gap: 14, maxWidth: 420 }}>
        <div className="ad-field">
          <label>Nueva contraseña</label>
          <input
            className="ad-input"
            type="password"
            autoComplete="new-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="ad-field">
          <label>Repetir contraseña</label>
          <input
            className="ad-input"
            type="password"
            autoComplete="new-password"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button className="ad-btn" type="submit" disabled={saving} style={{ justifySelf: 'start' }}>
          {saving ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}
