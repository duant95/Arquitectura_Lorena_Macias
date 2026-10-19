'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound, Shuffle, Trash2, UserPlus } from 'lucide-react';
import { ROL_EDITORA, ROL_LABEL } from '@/lib/roles';

const MIN_PASS = 8;

// Contraseña provisoria legible (sin caracteres que se confunden: 0/O, 1/l/I).
function generarPassword(n = 12) {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  const r = new Uint32Array(n);
  crypto.getRandomValues(r);
  return Array.from(r, (x) => abc[x % abc.length]).join('');
}

function fecha(s) {
  if (!s) return 'Nunca ingresó';
  try {
    return 'Último ingreso: ' + new Date(s).toLocaleString('es-PY', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

async function api(method, body) {
  const res = await fetch('/api/usuarios', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo completar.');
  return data;
}

function UsuarioRow({ u, yo, onChange }) {
  const [resetOpen, setResetOpen] = useState(false);
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const esEditora = u.rol === ROL_EDITORA;
  const soyYo = u.email === yo?.toLowerCase();

  async function nuevaPassword(e) {
    e.preventDefault();
    if (pass.length < MIN_PASS) return toast.error(`Mínimo ${MIN_PASS} caracteres.`);
    setBusy(true);
    try {
      await api('PATCH', { email: u.email, password: pass });
      toast.success('Contraseña actualizada. Pasásela en persona.');
      setResetOpen(false);
      setPass('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function quitar() {
    if (!confirm(`¿Quitarle el acceso a ${u.nombre || u.email}? No va a poder volver a entrar.`)) return;
    setBusy(true);
    try {
      await api('DELETE', { email: u.email });
      toast.success('Acceso quitado.');
      onChange();
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="ad-card" style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <strong>{u.nombre || u.email}</strong>
          {soyYo && <span className="ad-hint"> (vos)</span>}
          <p className="ad-hint" style={{ margin: '2px 0 0', overflowWrap: 'anywhere' }}>
            {u.nombre ? `${u.email} · ` : ''}
            {fecha(u.ultimo_ingreso)}
          </p>
        </div>
        <span className="ad-badge">{ROL_LABEL[u.rol] || u.rol}</span>
        {esEditora && (
          <div className="ad-actions">
            <button
              type="button"
              className="ad-btn ad-btn--ghost"
              onClick={() => {
                setResetOpen((o) => !o);
                setPass(generarPassword());
              }}
              disabled={busy}
            >
              <KeyRound size={14} /> Nueva contraseña
            </button>
            <button type="button" className="ad-btn ad-btn--danger" onClick={quitar} disabled={busy}>
              <Trash2 size={14} /> Quitar acceso
            </button>
          </div>
        )}
      </div>
      {resetOpen && (
        <form onSubmit={nuevaPassword} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'end' }}>
          <div className="ad-field" style={{ flex: '1 1 220px', margin: 0 }}>
            <label>Contraseña provisoria</label>
            <input className="ad-input" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button className="ad-btn" type="submit" disabled={busy}>
            {busy ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function UsuariosEditor({ yo }) {
  const [usuarios, setUsuarios] = useState(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [saving, setSaving] = useState(false);
  const [creada, setCreada] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const { usuarios } = await api('GET');
      setUsuarios(usuarios);
    } catch (err) {
      toast.error(err.message);
      setUsuarios([]);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function agregar(e) {
    e.preventDefault();
    if (pass.length < MIN_PASS) return toast.error(`La contraseña debe tener al menos ${MIN_PASS} caracteres.`);
    setSaving(true);
    try {
      await api('POST', { nombre, email, password: pass });
      toast.success('Editora agregada.');
      setCreada({ email: email.trim().toLowerCase(), pass });
      setNombre('');
      setEmail('');
      setPass('');
      cargar();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gap: 12 }}>
        <h2 className="ad-card__title" style={{ margin: 0 }}>Quién tiene acceso</h2>
        {usuarios === null ? (
          <p className="ad-hint">Cargando…</p>
        ) : (
          usuarios.map((u) => <UsuarioRow key={u.email} u={u} yo={yo} onChange={cargar} />)
        )}
      </div>

      <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="ad-card__title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={17} /> Agregar editora
        </div>
        <p className="ad-hint" style={{ margin: 0 }}>
          Una editora puede crear y editar proyectos, textos y fotos. No puede eliminar proyectos ni
          mensajes, ni gestionar usuarios. Después de crearla, pasale el email y la contraseña en
          persona; ella la cambia en <strong>Datos del sitio → Cambiar contraseña</strong>.
        </p>
        <form onSubmit={agregar} style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
          <div className="ad-field">
            <label>Nombre</label>
            <input
              className="ad-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Arq. María Pérez"
            />
          </div>
          <div className="ad-field">
            <label>Email</label>
            <input
              className="ad-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@estudio.com"
            />
          </div>
          <div className="ad-field">
            <label>Contraseña provisoria</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="ad-input"
                required
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder={`Mínimo ${MIN_PASS} caracteres`}
              />
              <button
                type="button"
                className="ad-btn ad-btn--ghost"
                onClick={() => setPass(generarPassword())}
                title="Generar una contraseña segura"
              >
                <Shuffle size={14} /> Generar
              </button>
            </div>
          </div>
          <button className="ad-btn" type="submit" disabled={saving} style={{ justifySelf: 'start' }}>
            {saving ? 'Creando…' : 'Agregar editora'}
          </button>
        </form>
        {creada && (
          <div className="ad-hint" style={{ background: 'rgba(0,0,0,.04)', padding: 12, borderRadius: 8 }}>
            Datos para pasarle: <strong>{creada.email}</strong> · contraseña{' '}
            <strong>{creada.pass}</strong>. Entra en <strong>lorenamacias.com.py/admin</strong>.
          </div>
        )}
      </div>
    </div>
  );
}
