import { NextResponse } from 'next/server';
import { getAdmin, esDuena } from '@/lib/authServer';
import { createAdminClient } from '@/lib/supabase';
import { ROL_EDITORA } from '@/lib/adminRoles';

// Gestión de quién accede al panel. Sólo la dueña.
// Desde acá sólo se crean/quitan EDITORAS: las cuentas de la dueña no se tocan.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASS = 8;

async function soloDuena() {
  const admin = await getAdmin();
  if (!admin) return [null, NextResponse.json({ error: 'No autorizado' }, { status: 401 })];
  if (!esDuena(admin)) {
    return [null, NextResponse.json({ error: 'Sólo la dueña gestiona usuarios' }, { status: 403 })];
  }
  return [admin, null];
}

async function findAuthUser(sb, email) {
  const { data } = await sb.auth.admin.listUsers({ perPage: 1000 });
  return data?.users?.find((u) => u.email?.toLowerCase() === email) ?? null;
}

async function getEditora(sb, email) {
  const { data } = await sb.from('admin_usuarios').select('rol').eq('email', email).maybeSingle();
  return data?.rol === ROL_EDITORA;
}

function emailDe(body) {
  return String(body?.email || '').trim().toLowerCase();
}

// Lista de usuarias con acceso (+ último ingreso).
export async function GET() {
  const [, err] = await soloDuena();
  if (err) return err;

  const sb = createAdminClient();
  const { data, error } = await sb
    .from('admin_usuarios')
    .select('email, rol, nombre, created_at')
    .order('created_at', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: auth } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const ultimo = new Map((auth?.users || []).map((u) => [u.email?.toLowerCase(), u.last_sign_in_at]));
  const usuarios = data.map((u) => ({ ...u, ultimo_ingreso: ultimo.get(u.email) ?? null }));
  return NextResponse.json({ usuarios });
}

// Agregar una editora con contraseña provisoria.
export async function POST(req) {
  const [, err] = await soloDuena();
  if (err) return err;

  const body = await req.json().catch(() => null);
  const email = emailDe(body);
  const nombre = String(body?.nombre || '').trim().slice(0, 80) || null;
  const password = String(body?.password || '');
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  if (password.length < MIN_PASS) {
    return NextResponse.json(
      { error: `La contraseña debe tener al menos ${MIN_PASS} caracteres` },
      { status: 400 }
    );
  }

  const sb = createAdminClient();
  const { data: ya } = await sb.from('admin_usuarios').select('email').eq('email', email).maybeSingle();
  if (ya) return NextResponse.json({ error: 'Ese email ya tiene acceso' }, { status: 400 });

  // Crea la cuenta (ya confirmada). Si existía de antes, le asigna la contraseña nueva.
  let creada = false;
  const { data: nuevo, error: eCrear } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: nombre ? { nombre } : undefined,
  });
  if (eCrear) {
    const existente = await findAuthUser(sb, email);
    if (!existente) return NextResponse.json({ error: eCrear.message }, { status: 400 });
    const { error: eUpd } = await sb.auth.admin.updateUserById(existente.id, {
      password,
      email_confirm: true,
    });
    if (eUpd) return NextResponse.json({ error: eUpd.message }, { status: 400 });
  } else {
    creada = true;
  }

  const { error: eIns } = await sb.from('admin_usuarios').insert({ email, rol: ROL_EDITORA, nombre });
  if (eIns) {
    if (creada && nuevo?.user) await sb.auth.admin.deleteUser(nuevo.user.id);
    return NextResponse.json({ error: eIns.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}

// Nueva contraseña provisoria para una editora (si se la olvidó).
export async function PATCH(req) {
  const [, err] = await soloDuena();
  if (err) return err;

  const body = await req.json().catch(() => null);
  const email = emailDe(body);
  const password = String(body?.password || '');
  if (password.length < MIN_PASS) {
    return NextResponse.json(
      { error: `La contraseña debe tener al menos ${MIN_PASS} caracteres` },
      { status: 400 }
    );
  }

  const sb = createAdminClient();
  if (!(await getEditora(sb, email))) {
    return NextResponse.json({ error: 'Sólo se puede cambiar la de una editora' }, { status: 400 });
  }
  const u = await findAuthUser(sb, email);
  if (!u) return NextResponse.json({ error: 'No se encontró la cuenta' }, { status: 404 });
  const { error } = await sb.auth.admin.updateUserById(u.id, { password });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// Quitar el acceso a una editora (borra su cuenta: no puede volver a entrar).
export async function DELETE(req) {
  const [admin, err] = await soloDuena();
  if (err) return err;

  const body = await req.json().catch(() => null);
  const email = emailDe(body);
  if (email === admin.user.email?.toLowerCase()) {
    return NextResponse.json({ error: 'No podés quitarte el acceso a vos misma' }, { status: 400 });
  }

  const sb = createAdminClient();
  if (!(await getEditora(sb, email))) {
    return NextResponse.json({ error: 'Sólo se puede quitar a una editora' }, { status: 400 });
  }
  // Primero la lista (corta el acceso al instante), después la cuenta.
  const { error } = await sb.from('admin_usuarios').delete().eq('email', email);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const u = await findAuthUser(sb, email);
  if (u) await sb.auth.admin.deleteUser(u.id);
  return NextResponse.json({ ok: true });
}
