import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';

// Guarda un valor de configuración (clave/valor). Requiere sesión.
export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });

  // Acepta un solo {clave, valor} o un lote {entries: {clave: valor, ...}}
  let rows;
  if (body.entries && typeof body.entries === 'object') {
    rows = Object.entries(body.entries).map(([clave, v]) => ({
      clave,
      valor: typeof v === 'string' ? v : JSON.stringify(v ?? ''),
    }));
  } else if (body.clave) {
    rows = [
      {
        clave: body.clave,
        valor: typeof body.valor === 'string' ? body.valor : JSON.stringify(body.valor ?? ''),
      },
    ];
  } else {
    return NextResponse.json({ error: 'Falta la clave' }, { status: 400 });
  }

  const sb = createAdminClient();
  const { error } = await sb.from('configuracion').upsert(rows);
  if (error) {
    console.error('[api/configuracion] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // refresca las páginas que dependen de la config
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
