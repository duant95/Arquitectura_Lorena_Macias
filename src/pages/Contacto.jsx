import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import '../styles/contacto.css';

export default function Contacto() {
  const { open } = useAgenda();
  useReveals();

  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Layout navMode="light">
      <section className="phero phero--soft">
        <div className="phero__in">
          <div className="crumb"><Link to="/">Inicio</Link> — Contacto</div>
          <h1>Conversemos<br />tu <em>proyecto</em>.</h1>
          <p className="phero__lead">Estamos para escucharte. Escribinos por WhatsApp, completá el formulario o agendá una reunión sin compromiso.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ct-grid">
            {/* INFO */}
            <div className="ct-info reveal">
              <p className="eyebrow" style={{ marginBottom: '20px' }}>Datos de contacto</p>
              <h2 className="h-lg">Lorena Macías<br />Arquitecta</h2>
              <div className="ct-row">
                <div className="ic"><svg viewBox="0 0 24 24"><path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" /></svg></div>
                <div><span className="micro">WhatsApp / Teléfono</span><b><a href="https://wa.me/595981109295" target="_blank" rel="noopener">+595 981 109 295</a></b></div>
              </div>
              <div className="ct-row">
                <div className="ic"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L20 7H4zm0 2L4.2 8.8V18h15.6V8.8z" /></svg></div>
                <div><span className="micro">Email</span><b><a href="mailto:arqlmacias@gmail.com">arqlmacias@gmail.com</a></b></div>
              </div>
              <div className="ct-row">
                <div className="ic"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg></div>
                <div><span className="micro">Estudio</span><b>Calle Fortín Arce e/ Senador Flecha</b><div style={{ color: 'var(--ink-soft)', fontSize: '15px', marginTop: '4px' }}>Luque · Paraguay</div></div>
              </div>
              <div className="ct-social">
                <a href="https://www.instagram.com/lorenamacias_arq" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.3A4.1 4.1 0 1 0 16.1 12 4.1 4.1 0 0 0 12 7.5m0 6.8A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.3m5.2-7a1 1 0 1 1-1-1 1 1 0 0 1 1 1z" /></svg></a>
                <a href="https://wa.me/595981109295" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" /></svg></a>
                <a href="mailto:arqlmacias@gmail.com" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L20 7H4zm0 2L4.2 8.8V18h15.6V8.8z" /></svg></a>
              </div>
              <div style={{ marginTop: '34px' }}><button className="btn" onClick={open}>Agendar una reunión <span className="arr">→</span></button></div>
            </div>

            {/* FORM */}
            <div className="ct-form reveal d1">
              <p className="eyebrow" style={{ marginBottom: '18px' }}>Escribinos</p>
              {!sent && (
                <form id="ctForm" onSubmit={handleSubmit}>
                  <div className="field"><label>Nombre y apellido</label><input required name="nombre" placeholder="Tu nombre" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="field"><label>WhatsApp</label><input required name="tel" placeholder="+595..." /></div>
                    <div className="field"><label>Email</label><input type="email" name="email" placeholder="tu@email.com" /></div>
                  </div>
                  <div className="field"><label>Tipo de proyecto</label>
                    <select name="tipo"><option>Vivienda nueva</option><option>Reforma / ampliación</option><option>Diseño de interiores</option><option>Paisajismo</option><option>Proyecto arquitectónico</option><option>Otro</option></select>
                  </div>
                  <div className="field"><label>Tu mensaje</label><textarea name="msg" rows="4" placeholder="Contanos sobre tu proyecto, ubicación, metros y estilo deseado…"></textarea></div>
                  <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Enviar mensaje <span className="arr">→</span></button>
                  <p style={{ fontSize: '12px', color: 'var(--ink-soft)', textAlign: 'center', margin: '14px 0 0' }}>Respondemos por WhatsApp en menos de 24 h.</p>
                </form>
              )}
              <div className="okmsg" id="ctOk" style={sent ? { display: 'block' } : undefined}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '30px', color: 'var(--olive)', marginBottom: '10px' }}>¡Gracias!</div>
                <p style={{ color: 'var(--ink-soft)' }}>Recibimos tu mensaje. Te escribimos muy pronto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="mapwrap reveal">
        <iframe loading="lazy" title="Ubicación del estudio" src="https://www.openstreetmap.org/export/embed.html?bbox=-57.51%2C-25.30%2C-57.45%2C-25.24&layer=mapnik&marker=-25.27%2C-57.48"></iframe>
      </section>
    </Layout>
  );
}
