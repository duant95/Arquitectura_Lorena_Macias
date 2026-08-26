import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { PREFIXED_LOCALES } from './lib/i18n/config';

/**
 * i18n para el sitio público (sin tocar el español, que vive en la raíz):
 *  - '/proyectos'    -> se sirve tal cual (locale es, ruta intacta).
 *  - '/en/proyectos' -> se reescribe a '/proyectos' con header x-locale=en.
 *  - '/pt'           -> se reescribe a '/' con header x-locale=pt.
 * La URL del navegador conserva el prefijo; la app renderiza la misma ruta.
 */
function handleLocale(request) {
  const { pathname } = request.nextUrl;
  const seg = pathname.split('/')[1];
  if (!PREFIXED_LOCALES.includes(seg)) return null;

  const rest = pathname.slice(seg.length + 1) || '/';
  const url = request.nextUrl.clone();
  url.pathname = rest;

  const headers = new Headers(request.headers);
  headers.set('x-locale', seg);

  const res = NextResponse.rewrite(url, { request: { headers } });
  res.headers.set('x-locale', seg);
  return res;
}

// Protección del panel /admin (comportamiento original, sin cambios).
async function handleAdmin(request) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser revalida el token y refresca la sesión (persistida vía setAll).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Proteger /admin excepto el login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  // Si ya hay sesión y va al login, mandarlo al panel
  if (pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    return handleAdmin(request);
  }

  // Rutas con prefijo (/en, /pt): se reescriben a la ruta base con x-locale.
  const seg = pathname.split('/')[1];
  if (PREFIXED_LOCALES.includes(seg)) {
    return handleLocale(request);
  }

  // Ruta en español: si hay un idioma elegido guardado, redirige a esa versión.
  // Así la elección persiste en cada visita y "cura" cualquier link no traducido.
  const pref = request.cookies.get('NEXT_LOCALE')?.value;
  if (PREFIXED_LOCALES.includes(pref)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${pref}` : `/${pref}${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Corre en /admin (auth) y en el sitio público (i18n), excluyendo API y estáticos.
  matcher: ['/admin/:path*', '/((?!api|_next|assets|favicon.ico|robots.txt|sitemap.xml).*)'],
};
