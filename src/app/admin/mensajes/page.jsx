import { createAdminClient } from '@/lib/supabase';
import MensajeRow from '@/components/admin/MensajeRow';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mensajes' };

export default async function AdminMensajes() {
  const sb = createAdminClient();
  const { data: mensajes } = await sb
    .from('mensajes')
    .select('*')
    .order('created_at', { ascending: false });

  const sinLeer = (mensajes ?? []).filter((m) => !m.leido).length;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Mensajes</h1>
          <p>
            {mensajes?.length ?? 0} mensajes (contacto y agenda)
            {sinLeer > 0 ? ` · ${sinLeer} sin leer` : ''}.
          </p>
        </div>
      </div>

      {!mensajes || mensajes.length === 0 ? (
        <div className="ad-empty">Todavía no llegaron mensajes.</div>
      ) : (
        <div className="ad-list">
          {mensajes.map((m) => (
            <MensajeRow key={m.id} m={m} />
          ))}
        </div>
      )}
    </>
  );
}
