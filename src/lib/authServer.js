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

// Devuelve la sesión leyendo el token de la cookie (SIN revalidarlo contra el
// servidor de auth). No usar para proteger datos: solo para contexto no sensible.
export async function getSession() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Devuelve el usuario revalidando el token contra Supabase (getUser hace la
// verificación en el servidor de auth). Es el chequeo seguro para las rutas de
// API y cualquier acción que modifique datos. Null si no hay sesión válida.
export async function getVerifiedUser() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function getSessionUser() {
  // Usa la verificación fuerte también acá (defensa en profundidad).
  return getVerifiedUser();
}
