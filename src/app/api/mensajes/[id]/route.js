import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdmin, esDuena } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';

// Marcar leído / no leído
export async function PATCH(req, { params }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const sb = createAdminClient();
  const { error } = await sb.from('mensajes').update({ leido: !!body.leido }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath('/admin');
  revalidatePath('/admin/mensajes');
  return NextResponse.json({ ok: true });
}

// Eliminar mensaje
export async function DELETE(_req, { params }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!esDuena(admin)) {
    return NextResponse.json({ error: 'Sólo la dueña puede eliminar mensajes' }, { status: 403 });
  }

  const sb = createAdminClient();
  const { error } = await sb.from('mensajes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath('/admin');
  revalidatePath('/admin/mensajes');
  return NextResponse.json({ ok: true });
}
