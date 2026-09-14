'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';
import { useT } from '../context/LocaleContext';

export default function AgendaModal() {
  const { isOpen, close } = useAgenda();
  const { contacto_tel, logo_claro } = useSiteConfig();
  const t = useT();
  // Los valores enviados quedan en español (para el mail), la etiqueta se traduce.
  const SLOTS = [
    { value: 'Mañana', label: t('modal.slotManana') },
    { value: 'Tarde', label: t('modal.slotTarde') },
    { value: 'Indistinto', label: t('modal.slotIndistinto') },
  ];
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
        setError(d.error || t('ct.errEnviar'));
        return;
      }
      setSent(true);
    } catch {
      setError(t('ct.errConexion'));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={'modal' + (isOpen ? ' open' : '')}>
      <div className="modal__bg" onClick={handleClose}></div>
      <div className="modal__card">
        <button className="modal__close" aria-label={t('nav.cerrar')} onClick={handleClose}>
          ×
        </button>
        <aside className="modal__aside modal__aside--center">
          <div>
            <img src={logo_claro || '/assets/logo-cream.png'} alt="" />
            <h3
              className="h-md"
              style={{ color: 'var(--cream)', marginBottom: 14 }}
              dangerouslySetInnerHTML={{ __html: t('modal.asideTitle') }}
            />
            <p style={{ color: 'var(--sage-soft)', fontSize: 15, lineHeight: 1.6 }}>
              {t('modal.asideText')}
            </p>
          </div>
          <div style={{ fontSize: 13, color: 'var(--sage-soft)', letterSpacing: '.04em' }}>
            <p style={{ margin: 0 }}>{contacto_tel}</p>
          </div>
        </aside>
        <div className="modal__body">
          <p className="eyebrow" style={{ marginBottom: 14 }}>
            {t('cta.solicitarUna')}
          </p>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>{t('ct.formNombre')}</label>
                <input required name="nombre" placeholder={t('ct.formNombrePh')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>{t('ct.formWhatsapp')}</label>
                  <input required name="tel" placeholder="+595..." />
                </div>
                <div className="field">
                  <label>{t('ct.formTipo')}</label>
                  <select name="tipo">
                    <option>{t('modal.tipoArq')}</option>
                    <option>{t('modal.tipoEdificio')}</option>
                    <option>{t('modal.tipoIntResid')}</option>
                    <option>{t('modal.tipoIntComerc')}</option>
                    <option>{t('modal.tipoNautico')}</option>
                    <option>{t('modal.tipoReforma')}</option>
                    <option>{t('ct.tipoPaisajismo')}</option>
                    <option>{t('ct.tipoOtro')}</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>{t('modal.horario')}</label>
                <div className="slots slots--3">
                  {SLOTS.map((s) => (
                    <div
                      key={s.value}
                      className={'slot' + (selectedSlot === s.value ? ' sel' : '')}
                      onClick={() => setSelectedSlot(s.value)}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>{t('modal.idea')}</label>
                <textarea name="msg" rows="3" placeholder={t('modal.ideaPh')}></textarea>
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
                {sending ? t('ct.enviando') : t('cta.solicitar')} <span className="arr">→</span>
              </button>
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
                {t('ct.gracias')}
              </div>
              <p style={{ color: 'var(--ink-soft)' }}>{t('modal.graciasText')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
