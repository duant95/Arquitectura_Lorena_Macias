import '../styles/global.css';
import '../styles/home.css';
import '../styles/nosotros.css';
import '../styles/proyectos.css';
import '../styles/proyecto.css';
import '../styles/servicios.css';
import '../styles/contacto.css';
import Script from 'next/script';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lorenamacias.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const description =
  'Estudio de arquitectura e interiorismo en Asunción, Paraguay. Proyectos de alta complejidad: edificios, barrios cerrados, residencias, interiorismo y diseño náutico.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lorena Macías · Arquitecta — Estudio de arquitectura y diseño de interiores',
    template: '%s · Lorena Macías Arquitecta',
  },
  description,
  icons: {
    icon: '/assets/mark-charcoal.png',
    apple: '/assets/mark-charcoal.png',
  },
  openGraph: {
    type: 'website',
    title: 'Lorena Macías · Arquitecta',
    description,
    locale: 'es_PY',
    images: ['/assets/logo-charcoal.png'],
  },
};

export const viewport = {
  themeColor: '#3f3c36',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </html>
  );
}
