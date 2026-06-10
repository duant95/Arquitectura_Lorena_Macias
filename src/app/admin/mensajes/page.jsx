import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mensajes' };

function fecha(s) {
  try {
    return new Date(s).toLocaleString('es-PY', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export default async function AdminMensajes() {
  const sb = createAdminClient();
  const { data: mensajes } = await sb
    .from('mensajes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Mensajes</h1>
          <p>{mensajes?.length ?? 0} mensajes desde el sitio (contacto y agenda).</p>
        </div>
      </div>

      {!mensajes || mensajes.length === 0 ? (
        <div className="ad-empty">Todavía no llegaron mensajes.</div>
      ) : (
        <div className="ad-list">
          {mensajes.map((m) => (
            <div className="ad-card" key={m.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <strong>{m.nombre}</strong>
                <span className="ad-hint">
                  {m.origen === 'agenda' ? 'Agenda' : 'Contacto'} · {fecha(m.created_at)}
                </span>
              </div>
              <p className="ad-hint" style={{ margin: '6px 0' }}>
                {[m.telefono, m.email, m.tipo_proyecto, m.horario].filter(Boolean).join(' · ')}
              </p>
              {m.mensaje && <p style={{ margin: 0 }}>{m.mensaje}</p>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
