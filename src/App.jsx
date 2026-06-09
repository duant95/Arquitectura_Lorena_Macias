import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AgendaProvider } from './context/AgendaContext';
import Intro from './components/Intro';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Proyectos from './pages/Proyectos';
import Proyecto from './pages/Proyecto';
import Servicios from './pages/Servicios';
import Contacto from './pages/Contacto';
import Placeholder from './pages/Placeholder';

// Lleva el scroll al inicio al cambiar de ruta
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AgendaProvider>
      <Intro />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/proyecto/:slug" element={<Proyecto />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<Placeholder title="Página no encontrada" />} />
      </Routes>
    </AgendaProvider>
  );
}
