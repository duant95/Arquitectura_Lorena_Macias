import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { deeplEnabled, translateConfigValue, TRANSLATE_LOCALES } from '@/lib/translate';
import { translatableKind } from '@/lib/i18n/translatable';

// Lee los valores previos (base + traducciones) de las claves traducibles,
// para traducir sólo lo que cambió o lo que aún no tiene traducción.
async function readPrevious(sb, rows) {
  const prev = new Map();
  if (!deeplEnabled()) return prev;
  const bases = rows.map((r) => r.clave).filter((c) => translatableKind(c));
  if (!bases.length) return prev;
  const wanted = [];
  for (const c of bases) {
    wanted.push(c);
    for (const l of TRANSLATE_LOCALES) wanted.push(`${c}__${l}`);
  }
  const { data } = await sb.from('configuracion').select('clave, valor').in('clave', wanted);
  if (data) for (const r of data) prev.set(r.clave, r.valor);
  return prev;
}

// Traduce (DeepL) a EN y PT lo que cambió y lo persiste como clave__en/__pt.
// El español queda intacto; si DeepL falla, el sitio cae al español (respaldo).
async function translateChanged(sb, rows, prev) {
  if (!deeplEnabled()) return;
  const trRows = [];
  for (const { clave, valor } of rows) {
    const kind = translatableKind(clave);
    if (!kind || valor == null || valor === '') continue;
    const changed = prev.get(clave) !== valor;
    for (const locale of TRANSLATE_LOCALES) {
      const existing = prev.get(`${clave}__${locale}`);
      const hasTranslation = existing != null && existing !== '';
      if (!changed && hasTranslation) continue; // sin cambios y ya traducido
      try {
        const v = await translateConfigValue(valor, locale, { json: kind === 'json' });
        trRows.push({ clave: `${clave}__${locale}`, valor: v });
      } catch (e) {
        console.error('[api/configuracion] traducción', clave, locale, e.message);
      }
    }
  }
  if (trRows.length) {
    const { error } = await sb.from('configuracion').upsert(trRows);
    if (error) console.error('[api/configuracion] guardar traducción:', error.message);
  }
}

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

  // Valores previos (para traducir sólo lo que cambió), antes de sobreescribir el español.
  const prev = await readPrevious(sb, rows);

  const { error } = await sb.from('configuracion').upsert(rows);
  if (error) {
    console.error('[api/configuracion] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Traduce a EN/PT lo que cambió (el guardado en español ya está hecho).
  await translateChanged(sb, rows, prev);

  // refresca las páginas que dependen de la config
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
