import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { pickProjectFields } from '@/lib/projectFields';

function revalidate(slug) {
  revalidatePath('/');
  revalidatePath('/proyectos');
  revalidatePath('/admin/proyectos');
  if (slug) revalidatePath(`/proyecto/${slug}`);
}

// Editar un proyecto
export async function PUT(req, { params }) {
  const session = await getSession();
  if (!session) {
    console.warn('[api/proyectos PUT] sin sesión → 401');
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });

  const sb = createAdminClient();
  const { error } = await sb.from('proyectos').update(pickProjectFields(body)).eq('id', params.id);

  if (error) {
    console.error('[api/proyectos PUT] error de base:', error.message);
    const msg = error.code === '23505' ? 'Ya existe un proyecto con ese slug' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  revalidate(body.slug);
  return NextResponse.json({ ok: true });
}

// Eliminar un proyecto
export async function DELETE(_req, { params }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const sb = createAdminClient();
  const { error } = await sb.from('proyectos').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidate();
  return NextResponse.json({ ok: true });
}
