import { createClient } from '@supabase/supabase-js';
import { ROL_DUENA } from './roles';

// Sólo servidor (usa la service role). Las constantes de rol viven en ./roles.
export { ROL_DUENA, ROL_EDITORA, ROL_LABEL } from './roles';

// Cliente service role mínimo (funciona también en el middleware/edge).
function adminDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (input, init = {}) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

// Tabla todavía no creada (migración sin correr).
function tablaAusente(error) {
  return error?.code === 'PGRST205' || error?.code === '42P01';
}

// Devuelve el rol del email ('duena' | 'editora') o null si no tiene acceso.
// Transición: si la tabla admin_usuarios todavía no existe, mantiene el
// comportamiento anterior (toda cuenta logueada es dueña) para no dejar a
// nadie afuera antes de correr el SQL.
export async function getRolForEmail(email) {
  if (!email) return null;
  const { data, error } = await adminDb()
    .from('admin_usuarios')
    .select('rol')
    .eq('email', email.toLowerCase())
    .maybeSingle();
  if (error) {
    if (tablaAusente(error)) {
      console.warn('[adminRoles] falta correr scripts/migracion-admins.sql — modo anterior');
      return ROL_DUENA;
    }
    console.error('[adminRoles]', error.message);
    return null;
  }
  return data?.rol ?? null;
}
