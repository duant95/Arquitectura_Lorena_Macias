'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        if (authError.message.includes('Invalid login')) {
          setError('Email o contraseña incorrectos.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Confirmá tu email antes de ingresar.');
        } else {
          setError(authError.message);
        }
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Error de conexión. Revisá tu internet e intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <img src="/assets/mark-charcoal.png" alt="Lorena Macías" />
          <h2>Lorena Macías</h2>
          <p>Panel de administración</p>
        </div>
        <form className="ad-form" onSubmit={handleLogin}>
          <div className="ad-field">
            <label>Email</label>
            <input
              className="ad-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="lorena@estudio.com"
            />
          </div>
          <div className="ad-field">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="ad-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b6457',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="ad-error">{error}</p>}
          <button
            className="ad-btn"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
