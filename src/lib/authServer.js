import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Cliente Supabase del lado del servidor que lee la sesión desde las cookies.
// Se usa en layouts del admin y en las API routes para verificar autenticación.
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

// Devuelve la sesión leyendo el token de la cookie (no requiere persistir refresh,
// así funciona dentro de las route handlers donde las cookies son de solo lectura).
export async function getSession() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Compatibilidad: devuelve el usuario de la sesión o null.
export async function getSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}
