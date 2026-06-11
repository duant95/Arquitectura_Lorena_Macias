import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

// Recibe los formularios públicos (Contacto y Agenda) y los guarda en `mensajes`.
export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!rateLimit(ip, { limit: 5, windowMs: 10 * 60 * 1000 }).allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá unos minutos.' },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });

  // Honeypot anti-spam: si el campo oculto trae datos, es un bot. Respondemos OK
  // para no darle pistas, pero no guardamos.
  if (body._gotcha) return NextResponse.json({ ok: true });

  const nombre = (body.nombre || '').trim();
  if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 });
  if (nombre.length > 120 || (body.mensaje || '').length > 3000) {
    return NextResponse.json({ error: 'Contenido demasiado largo' }, { status: 400 });
  }

  const row = {
    origen: body.origen === 'agenda' ? 'agenda' : 'contacto',
    nombre,
    email: body.email?.trim() || null,
    telefono: body.telefono?.trim() || null,
    tipo_proyecto: body.tipo_proyecto?.trim() || null,
    horario: body.horario?.trim() || null,
    mensaje: body.mensaje?.trim() || null,
    leido: false,
  };

  const sb = createAdminClient();
  const { error } = await sb.from('mensajes').insert([row]);
  if (error) {
    console.error('[api/contacto] error de base:', error.message);
    return NextResponse.json({ error: 'No se pudo enviar. Probá de nuevo.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
