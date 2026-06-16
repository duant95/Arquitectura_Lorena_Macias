import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';

// Guarda un valor de configuración (clave/valor). Requiere sesión.
export async function POST(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.clave) return NextResponse.json({ error: 'Falta la clave' }, { status: 400 });

  const valor = typeof body.valor === 'string' ? body.valor : JSON.stringify(body.valor ?? '');

  const sb = createAdminClient();
  const { error } = await sb.from('configuracion').upsert({ clave: body.clave, valor });
  if (error) {
    console.error('[api/configuracion] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // refresca las páginas que dependen de la config
  revalidatePath('/');
  revalidatePath('/servicios');
  revalidatePath('/admin/servicios');
  return NextResponse.json({ ok: true });
}
