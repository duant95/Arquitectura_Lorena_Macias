import { useEffect, useState } from 'react';
import { TEL } from '../data/site';
import { useAgenda } from '../context/AgendaContext';

const SLOTS = ['Lun 10:00', 'Mar 15:00', 'Mié 11:00', 'Jue 16:00', 'Vie 09:00', 'Vie 17:00'];

export default function AgendaModal() {
  const { isOpen, close } = useAgenda();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sent, setSent] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  // Resetear el formulario cada vez que se vuelve a abrir
  useEffect(() => {
    if (isOpen) { setSent(false); setSelectedSlot(null); }
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className={'modal' + (isOpen ? ' open' : '')}>
      <div className="modal__bg" onClick={close}></div>
      <div className="modal__card">
        <button className="modal__close" aria-label="Cerrar" onClick={close}>×</button>
        <aside className="modal__aside">
          <div>
            <img src="/assets/logo-cream.png" alt="" />
            <h3 className="h-md" style={{ color: 'var(--cream)', marginBottom: 14 }}>
              Agendemos una<br />conversación
            </h3>
            <p style={{ color: 'var(--sage-soft)', fontSize: 15, lineHeight: 1.6 }}>
              Conversemos sobre tu proyecto, terreno o reforma. Sin compromiso — una primera
              reunión para entender tu visión.
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sage-soft)', letterSpacing: '.04em' }}>
            <p style={{ margin: '0 0 6px' }}>{TEL}</p>
            <p style={{ margin: 0 }}>Luque · Paraguay</p>
          </div>
        </aside>
        <div className="modal__body">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Agenda de reuniones</p>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Nombre y apellido</label>
                <input required name="nombre" placeholder="Tu nombre" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>WhatsApp</label>
                  <input required name="tel" placeholder="+595..." />
                </div>
                <div className="field">
                  <label>Tipo de proyecto</label>
                  <select name="tipo">
                    <option>Vivienda nueva</option>
                    <option>Reforma / ampliación</option>
                    <option>Diseño de interiores</option>
                    <option>Paisajismo</option>
                    <option>Proyecto arquitectónico</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Horario preferido</label>
                <div className="slots">
                  {SLOTS.map((s) => (
                    <div
                      key={s}
                      className={'slot' + (selectedSlot === s ? ' sel' : '')}
                      onClick={() => setSelectedSlot(s)}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Contanos brevemente tu idea</label>
                <textarea name="msg" rows="3" placeholder="Ubicación, metros, estilo deseado…"></textarea>
              </div>
              <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                Solicitar reunión <span className="arr">→</span>
              </button>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)', textAlign: 'center', margin: '14px 0 0' }}>
                Te confirmaremos por WhatsApp en menos de 24 h.
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 30, color: 'var(--olive)', marginBottom: 10 }}>
                ¡Gracias!
              </div>
              <p style={{ color: 'var(--ink-soft)' }}>
                Recibimos tu solicitud. Te escribimos pronto por WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
