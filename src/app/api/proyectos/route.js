import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { pickProjectFields } from '@/lib/projectFields';

// Crear un proyecto
export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.titulo) {
    return NextResponse.json({ error: 'Faltan título o slug' }, { status: 400 });
  }

  const sb = createAdminClient();
  const { data, error } = await sb
    .from('proyectos')
    .insert([pickProjectFields(body)])
    .select('id')
    .single();

  if (error) {
    const msg = error.code === '23505' ? 'Ya existe un proyecto con ese slug' : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
