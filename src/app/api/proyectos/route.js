import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { pickProjectFields } from '@/lib/projectFields';
import { translateAndStoreProject } from '@/lib/i18n/projectI18n';

// Crear un proyecto
export async function POST(req) {
  const session = await getSession();
  if (!session) {
    console.warn('[api/proyectos POST] sin sesión → 401');
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.titulo) {
    return NextResponse.json({ error: 'Faltan título o slug' }, { status: 400 });
  }

  const sb = createAdminClient();
  const fields = pickProjectFields(body);
  let { data, error } = await sb.from('proyectos').insert([fields]).select('id').single();
  // Si la columna `ficha` todavía no fue creada en la DB, creamos igual sin ella.
  if (error && (error.code === '42703' || /ficha/.test(error.message || ''))) {
    const { ficha, ...rest } = fields;
    ({ data, error } = await sb.from('proyectos').insert([rest]).select('id').single());
    if (!error) console.warn('[api/proyectos POST] columna `ficha` ausente: creado sin ficha.');
  }

  if (error) {
    console.error('[api/proyectos POST] error de base:', error.message);
    const msg = error.code === '23505' ? 'Ya existe un proyecto con ese slug' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Traduce el proyecto a EN/PT (el español ya quedó guardado).
  await translateAndStoreProject(sb, body);

  revalidatePath('/');
  revalidatePath('/proyectos');
  revalidatePath('/admin/proyectos');
  if (body.slug) revalidatePath(`/proyecto/${body.slug}`);

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
