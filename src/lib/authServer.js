import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Cliente Supabase del lado del servidor que lee la sesión desde las cookies.
// Usa la API moderna getAll/setAll de @supabase/ssr (robusta con cookies "chunked").
// En route handlers las cookies son de solo lectura: setAll se envuelve en try/catch.
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // route handlers: cookies de solo lectura — se ignora
          }
        },
      },
    }
  );
}

// Devuelve la sesión leyendo el token de la cookie.
export async function getSession() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}
