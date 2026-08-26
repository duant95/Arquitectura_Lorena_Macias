'use client';

import { AgendaProvider } from '../context/AgendaContext';
import { ConfigProvider } from '../context/ConfigContext';
import { LocaleProvider } from '../context/LocaleContext';
import Intro from './Intro';
import Nav from './Nav';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import AgendaModal from './AgendaModal';
import SmoothScroll from './fx/SmoothScroll';
import HtmlLang from './HtmlLang';

/**
 * Envoltura común a todas las páginas públicas: nav + contenido + footer,
 * más el botón flotante de WhatsApp, el modal de agenda y la intro.
 * El modo del nav (claro/oscuro) lo decide el propio Nav según la ruta.
 */
export default function SiteShell({ children, config, locale = 'es' }) {
  return (
    <LocaleProvider locale={locale}>
      <ConfigProvider value={config}>
        <AgendaProvider>
          <HtmlLang locale={locale} />
          <SmoothScroll />
          <Intro />
          <Nav />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <AgendaModal />
        </AgendaProvider>
      </ConfigProvider>
    </LocaleProvider>
  );
}
