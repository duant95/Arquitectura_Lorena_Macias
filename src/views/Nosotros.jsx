'use client';

import Link from 'next/link';
import Img from '../components/Img';
import Trayectoria from '../components/Trayectoria';
import CarruselLinea from '../components/CarruselLinea';
import PrensaList from '../components/PrensaList';
import { useAgenda } from '../context/AgendaContext';
import { useT, useHref } from '../context/LocaleContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
  const t = useT();
  const href = useHref();
  useReveals();

  const historia = splitParagraphs(content.nosotros_historia);
  const carrusel = content.carrusel || [];
  const prensa = (content.prensa || []).filter((p) => p && (p.medio || p.titulo));
  const estudioImgs = content.estudio_imagenes || [];

  return (
    <>
      {/* HERO */}
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href={href('/')}>{t('nav.inicio')}</Link> / {t('nav.sobre')}
          </div>
          <div className={'about-hero' + (content.nosotros_retrato_imagen ? '' : ' about-hero--solo')}>
            <div className="reveal">
              <h1 dangerouslySetInnerHTML={{ __html: content.nosotros_hero_titulo }} />
              <p
                className="phero__lead"
                dangerouslySetInnerHTML={{ __html: content.nosotros_hero_lead }}
              />
              <div className="about-stats">
                {(content.stats || []).map((s, i) => (
                  <div className="about-stat" key={i}>
                    <span className="about-stat__n">{s.n}</span>
                    <span className="about-stat__l">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            {content.nosotros_retrato_imagen && (
              <div className="imgblock about-portrait reveal-img reveal d1">
                <Img src={content.nosotros_retrato_imagen} alt="Lorena Macías" sizes="40vw" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EL ESTUDIO — texto a la izquierda + 2 imágenes */}
      <section className="section estudio-band">
        <div className="wrap estudio-grid">
          <div className="estudio reveal">
            <p className="kicker">{t('sobre.elEstudio')}</p>
            <h2
              className="estudio__title"
              dangerouslySetInnerHTML={{ __html: content.nosotros_estudio_titulo }}
            />
            <p
              className="estudio__text"
              dangerouslySetInnerHTML={{ __html: content.nosotros_estudio_texto }}
            />
            <div className="estudio__focos">
              <span>{t('sobre.focosResidencial')}</span>
              <span>{t('sobre.focosComercial')}</span>
              <span>{t('sobre.focosCorporativo')}</span>
            </div>
          </div>
          {estudioImgs.length > 0 && (
            <div className="estudio-imgs reveal d1">
              {estudioImgs.slice(0, 2).map((src, i) => (
                <div className="estudio-img" key={i}>
                  <Img src={src} alt="" sizes="(max-width:900px) 50vw, 30vw" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MI RECORRIDO — párrafo 1 → línea de tiempo → párrafo 2 (remate) */}
      <section className="section">
        <div className="wrap">
          <div className="quiensoy reveal">
            <p className="kicker">{t('sobre.miRecorrido')}</p>
            <h2 className="h-xl quiensoy__title">{t('sobre.recorridoTitulo')}</h2>
            {historia[0] && (
              <p className="quiensoy__p1" dangerouslySetInnerHTML={{ __html: historia[0] }} />
            )}
          </div>
        </div>
        {carrusel.length > 0 && (
          <div className="carr-wrap reveal d1">
            <CarruselLinea imagenes={carrusel} />
          </div>
        )}
        {historia.length > 1 && (
          <div className="wrap">
            {historia.slice(1).map((p, i, arr) => {
              const esCita = i === arr.length - 1 && arr.length > 1;
              return (
                <p
                  key={i}
                  className={(esCita ? 'quiensoy__cita' : 'quiensoy__body') + ' reveal'}
                  dangerouslySetInnerHTML={{ __html: p }}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* TRAYECTORIA — con subtítulo */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 'clamp(24px,3vw,42px)' }}>
            <p className="kicker">{t('sobre.trayectoria')}</p>
            <h2 className="h-xl" style={{ marginTop: 12 }}>
              {t('sobre.trayectoriaSub')}
            </h2>
          </div>
          <Trayectoria items={content.trayectoria || []} />
        </div>
      </section>

      {/* PRENSA / RECONOCIMIENTOS */}
      {prensa.length > 0 && (
        <section className="section prensa">
          <div className="wrap">
            <div className="reveal" style={{ marginBottom: 'clamp(28px,4vw,52px)' }}>
              <p className="kicker">{t('sobre.reconocimientos')}</p>
              <h2 className="h-xl" style={{ marginTop: 12 }}>
                {t('sobre.prensaTitulo')}
              </h2>
            </div>
            <div className="reveal d1">
              <PrensaList items={prensa} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section cta-final" style={{ textAlign: 'center' }}>
        <Img src={content.nosotros_cta_imagen} alt="" sizes="100vw" />
        <div className="wrap">
          <h2
            className="display reveal"
            style={{ color: 'var(--cream)', fontSize: 'clamp(28px,4vw,58px)', marginBottom: 30 }}
            dangerouslySetInnerHTML={{ __html: t('sobre.ctaTitulo') }}
          />
          <div
            className="reveal d1"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              {t('cta.solicitar')} <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href={href('/proyectos')}>
              {t('cta.verProyectos')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
