// Content-Security-Policy: limita de qué orígenes puede el navegador cargar
// scripts, estilos, imágenes y hacer conexiones. Es defensa en profundidad
// contra inyección de scripts (XSS). Sólo se permite lo que el sitio usa:
//   - Supabase (datos + imágenes del storage)
//   - Google Analytics 4 / Tag Manager
//   - Fuentes y estilos propios (self)
// Nota: se mantiene 'unsafe-inline'/'unsafe-eval' en scripts porque Next.js
// inyecta scripts de hidratación en línea y GA usa un script inline; aun así el
// CSP sigue bloqueando scripts de cualquier origen externo no listado. Un CSP
// más estricto (nonces) sería un paso futuro si se quiere endurecer más.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "frame-src 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*.supabase.co https://www.googletagmanager.com",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que el router cache del cliente sirva datos viejos en páginas dinámicas
  experimental: {
    staleTimes: { dynamic: 0 },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Headers de seguridad HTTP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
