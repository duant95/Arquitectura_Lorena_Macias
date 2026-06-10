import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { pickProjectFields } from '@/lib/projectFields';

// Editar un proyecto
export async function PUT(req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });

  const sb = createAdminClient();
  const { error } = await sb.from('proyectos').update(pickProjectFields(body)).eq('id', params.id);

  if (error) {
    const msg = error.code === '23505' ? 'Ya existe un proyecto con ese slug' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// Eliminar un proyecto
export async function DELETE(_req, { params }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const sb = createAdminClient();
  const { error } = await sb.from('proyectos').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
