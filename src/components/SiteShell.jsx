'use client';

import { AgendaProvider } from '../context/AgendaContext';
import { ConfigProvider } from '../context/ConfigContext';
import Intro from './Intro';
import Nav from './Nav';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import AgendaModal from './AgendaModal';
import SmoothScroll from './fx/SmoothScroll';

/**
 * Envoltura común a todas las páginas públicas: nav + contenido + footer,
 * más el botón flotante de WhatsApp, el modal de agenda y la intro.
 * El modo del nav (claro/oscuro) lo decide el propio Nav según la ruta.
 */
export default function SiteShell({ children, config }) {
  return (
    <ConfigProvider value={config}>
      <AgendaProvider>
        <SmoothScroll />
        <Intro />
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <AgendaModal />
      </AgendaProvider>
    </ConfigProvider>
  );
}
