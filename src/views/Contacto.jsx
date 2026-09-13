'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import { useSiteConfig } from '../context/ConfigContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';

export default function Contacto() {
  const { open } = useAgenda();
  const { contacto_email, contacto_ciudad, contacto_hero_imagen, tels, waUrl, igUrl, mailto } =
    useSiteConfig();
  const t = useT();
  const href = useHref();
  useReveals();

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = e.target;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origen: 'contacto',
          nombre: f.nombre.value,
          telefono: f.tel.value,
          email: f.email.value,
          tipo_proyecto: f.tipo.value,
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
  };

  return (
    <>
      <section className={'phero' + (contacto_hero_imagen ? ' phero--image' : ' phero--soft')}>
        {contacto_hero_imagen && (
          <Parallax className="phero__bg" src={contacto_hero_imagen} strength={8} priority />
        )}
        <div className="phero__in">
          <div className="crumb">
            <Link href={href('/')}>{t('nav.inicio')}</Link> / {t('nav.contacto')}
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: t('ct.heroTitulo') }} />
          <p className="phero__lead">{t('ct.heroLead')}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ct-grid">
            {/* INFO */}
            <div className="ct-info reveal">
              <p className="eyebrow" style={{ marginBottom: '20px' }}>
                {t('ct.datosContacto')}
              </p>
              <h2 className="h-lg">
                Lorena Macías
                <br />
                Arquitecta
              </h2>
              <p className="ct-rol">{t('ct.rol')}</p>
              <div className="ct-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" />
                  </svg>
                </div>
                <div>
                  <span className="micro">{t('ct.wa')}</span>
                  {tels.map((tel, i) => (
                    <b key={i} style={i > 0 ? { display: 'block', marginTop: 2 } : undefined}>
                      {i === 0 ? (
                        <a href={waUrl} target="_blank" rel="noopener noreferrer">
                          {tel}
                        </a>
                      ) : (
                        <a href={`tel:${tel.replace(/[^\d+]/g, '')}`}>{tel}</a>
                      )}
                    </b>
                  ))}
                </div>
              </div>
              <div className="ct-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L20 7H4zm0 2L4.2 8.8V18h15.6V8.8z" />
                  </svg>
                </div>
                <div>
                  <span className="micro">{t('ct.email')}</span>
                  <b>
                    <a href={mailto}>{contacto_email}</a>
                  </b>
                </div>
              </div>
              <div className="ct-row">
                <div className="ic">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </div>
                <div>
                  <span className="micro">{t('ct.estudio')}</span>
                  <b>{contacto_ciudad}</b>
                  <div style={{ color: 'var(--ink-soft)', fontSize: '15px', marginTop: '4px' }}>
                    {t('ct.mercados')}
                  </div>
                </div>
              </div>
              <p className="ct-horario">{t('ct.horarioAtencion')}</p>
              <div className="ct-social">
                <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 5.3A4.1 4.1 0 1 0 16.1 12 4.1 4.1 0 0 0 12 7.5m0 6.8A2.7 2.7 0 1 1 14.7 12 2.7 2.7 0 0 1 12 14.3m5.2-7a1 1 0 1 1-1-1 1 1 0 0 1 1 1z" />
                  </svg>
                </a>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg viewBox="0 0 24 24">
                    <path d="M.06 24l1.7-6.2a11.9 11.9 0 1 1 4.3 4.2zm6.6-3.8l.4.2a9.9 9.9 0 0 0 5 1.4 9.9 9.9 0 1 0-9.9-9.9 9.9 9.9 0 0 0 1.5 5.2l.3.4-1 3.7zm11.4-5.5c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.4.1-.6l.5-.5.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.3 5.3 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.2-.5-.3z" />
                  </svg>
                </a>
                <a href={mailto} aria-label="Email">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.5L20 7H4zm0 2L4.2 8.8V18h15.6V8.8z" />
                  </svg>
                </a>
              </div>
              <div style={{ marginTop: '34px' }}>
                <button className="btn" onClick={open}>
                  {t('cta.solicitarUna')} <span className="arr">→</span>
                </button>
              </div>
            </div>

            {/* FORM */}
            <div className="ct-form reveal d1">
              <p className="eyebrow" style={{ marginBottom: '18px' }}>
                {t('ct.escribinos')}
              </p>
              {!sent && (
                <form id="ctForm" onSubmit={handleSubmit}>
                  <div className="field">
                    <label>{t('ct.formNombre')}</label>
                    <input required name="nombre" placeholder={t('ct.formNombrePh')} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="field">
                      <label>{t('ct.formWhatsapp')}</label>
                      <input required name="tel" placeholder="+595..." />
                    </div>
                    <div className="field">
                      <label>{t('ct.formEmail')}</label>
                      <input type="email" name="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="field">
                    <label>{t('ct.formTipo')}</label>
                    <select name="tipo">
                      <option>{t('ct.tipoArq')}</option>
                      <option>{t('ct.tipoInteriores')}</option>
                      <option>{t('ct.tipoNautico')}</option>
                      <option>{t('ct.tipoDireccion')}</option>
                      <option>{t('ct.tipoPm')}</option>
                      <option>{t('ct.tipoReformas')}</option>
                      <option>{t('ct.tipoPaisajismo')}</option>
                      <option>{t('ct.tipoOtro')}</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>{t('ct.formMensaje')}</label>
                    <textarea name="msg" rows="4" placeholder={t('ct.formMensajePh')}></textarea>
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
                    <p style={{ color: '#b4453a', fontSize: '14px', margin: '0 0 12px' }}>
                      {error}
                    </p>
                  )}
                  <button
                    className="btn"
                    type="submit"
                    disabled={sending}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {sending ? t('ct.enviando') : t('ct.enviar')} <span className="arr">→</span>
                  </button>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--ink-soft)',
                      textAlign: 'center',
                      margin: '14px 0 0',
                    }}
                  >
                    {t('ct.disponible24')}
                  </p>
                </form>
              )}
              <div className="okmsg" id="ctOk" style={sent ? { display: 'block' } : undefined}>
                <div
                  style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '30px',
                    color: 'var(--olive)',
                    marginBottom: '10px',
                  }}
                >
                  {t('ct.gracias')}
                </div>
                <p style={{ color: 'var(--ink-soft)' }}>{t('ct.graciasTexto')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
