import Nav from './Nav';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import AgendaModal from './AgendaModal';

/**
 * Envoltura común a todas las páginas: nav + contenido + footer,
 * más el botón flotante de WhatsApp y el modal de agenda.
 * navMode lo define cada página ('dark' sobre hero / 'light' interiores).
 */
export default function Layout({ children, navMode = 'dark' }) {
  return (
    <>
      <Nav navMode={navMode} />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <AgendaModal />
    </>
  );
}
