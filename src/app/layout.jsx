import '../styles/global.css';
import '../styles/home.css';
import '../styles/nosotros.css';
import '../styles/proyectos.css';
import '../styles/proyecto.css';
import '../styles/servicios.css';
import '../styles/contacto.css';

const description =
  'Estudio de arquitectura y diseño de interiores en Luque, Paraguay. Espacios que conectan naturaleza, materialidad y función.';

export const metadata = {
  metadataBase: new URL('https://lorenamacias.com'),
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
    </html>
  );
}
