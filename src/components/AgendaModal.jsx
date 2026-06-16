'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';

const SLOTS = ['Mañana', 'Tarde', 'Indistinto'];

export default function AgendaModal() {
  const { isOpen, close } = useAgenda();
  const { contacto_tel } = useSiteConfig();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Cierra el modal y deja el formulario listo para la próxima apertura.
  const handleClose = useCallback(() => {
    close();
    setSent(false);
    setSelectedSlot(null);
    setError('');
  }, [close]);

  // Cerrar con Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handleClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = e.target;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: 'agenda',
          nombre: f.nombre.value,
          telefono: f.tel.value,
          tipo_proyecto: f.tipo.value,
          horario: selectedSlot || '',
          mensaje: f.msg.value,
          _gotcha: f._gotcha.value,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'No se pudo enviar. Probá de nuevo.');
        return;
      }
      setSent(true);
    } catch {
      setError('Error de conexión. Probá de nuevo.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={'modal' + (isOpen ? ' open' : '')}>
      <div className="modal__bg" onClick={handleClose}></div>
      <div className="modal__card">
        <button className="modal__close" aria-label="Cerrar" onClick={handleClose}>
          ×
        </button>
        <aside className="modal__aside modal__aside--center">
          <div>
            <img src="/assets/logo-cream.png" alt="" />
            <h3 className="h-md" style={{ color: 'var(--cream)', marginBottom: 14 }}>
              Conversemos sobre
              <br />
              tu proyecto
            </h3>
            <p style={{ color: 'var(--sage-soft)', fontSize: 15, lineHeight: 1.6 }}>
              Sin compromiso — una primera charla para entender tu visión y cómo podemos ayudarte.
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sage-soft)', letterSpacing: '.04em' }}>
            <p style={{ margin: 0 }}>{contacto_tel}</p>
          </div>
        </aside>
        <div className="modal__body">
          <p className="eyebrow" style={{ marginBottom: 14 }}>
            Solicitar una reunión
          </p>
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
                    <option>Proyecto arquitectónico</option>
                    <option>Edificio / Barrio cerrado</option>
                    <option>Diseño de interiores residencial</option>
                    <option>Diseño de interiores comercial</option>
                    <option>Interiorismo náutico</option>
                    <option>Reforma / obra</option>
                    <option>Paisajismo</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>¿Qué horario te queda mejor?</label>
                <div className="slots slots--3">
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
                <textarea
                  name="msg"
                  rows="3"
                  placeholder="Ubicación, metros, estilo deseado…"
                ></textarea>
              </div>
              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: 'absolute', left: '-9999px' }}
                aria-hidden="true"
              />
              {error && (
                <p style={{ color: '#b4453a', fontSize: 14, margin: '0 0 12px' }}>{error}</p>
              )}
              <button
                className="btn"
                type="submit"
                disabled={sending}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {sending ? 'Enviando…' : 'Solicitar reunión'} <span className="arr">→</span>
              </button>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  textAlign: 'center',
                  margin: '14px 0 0',
                }}
              >
                Te confirmaremos por WhatsApp en menos de 24 h.
              </p>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 30,
                  color: 'var(--olive)',
                  marginBottom: 10,
                }}
              >
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
