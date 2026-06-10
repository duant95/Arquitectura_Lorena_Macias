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

// Devuelve el usuario autenticado o null.
export async function getSessionUser() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
