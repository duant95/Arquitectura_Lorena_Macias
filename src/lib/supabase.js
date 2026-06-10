import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ¿Está configurado Supabase? (permite que el sitio funcione con datos locales
// mientras no haya keys, sin romper el build).
export const supabaseEnabled = Boolean(url && anonKey);

// Cliente para lecturas públicas (server components).
export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;

// Cliente para el navegador — guarda la sesión en cookies (necesario para el
// middleware que protege /admin).
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Cliente con service role para operaciones del CMS (SOLO server-side).
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
