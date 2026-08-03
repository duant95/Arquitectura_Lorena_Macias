'use client';

import Link from 'next/link';
import Img from '../components/Img';
import Trayectoria from '../components/Trayectoria';
import CarruselLinea from '../components/CarruselLinea';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { splitParagraphs } from '../lib/projectShape';

export default function Nosotros({ content = {} }) {
  const { open } = useAgenda();
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
            <Link href="/">Inicio</Link> / Sobre mí
          </div>
          <div className={'about-hero' + (content.nosotros_retrato_imagen ? '' : ' about-hero--solo')}>
            <div className="reveal">
              <h1 dangerouslySetInnerHTML={{ __html: content.nosotros_hero_titulo }} />
              <p className="phero__lead">{content.nosotros_hero_lead}</p>
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
            <p className="kicker">El estudio</p>
            <h2
              className="estudio__title"
              dangerouslySetInnerHTML={{ __html: content.nosotros_estudio_titulo }}
            />
            <p className="estudio__text">{content.nosotros_estudio_texto}</p>
            <div className="estudio__focos">
              <span>Residencial</span>
              <span>Comercial</span>
              <span>Corporativo</span>
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
            <p className="kicker">Mi recorrido</p>
            <h2 className="h-xl quiensoy__title">Arquitectura que acompaña</h2>
            {historia[0] && <p className="quiensoy__p1">{historia[0]}</p>}
          </div>
        </div>
        {carrusel.length > 0 && (
          <div className="carr-wrap reveal d1">
            <CarruselLinea imagenes={carrusel} />
          </div>
        )}
        {historia[1] && (
          <div className="wrap">
            <p className="quiensoy__remate reveal">{historia[1]}</p>
          </div>
        )}
      </section>

      {/* TRAYECTORIA — con subtítulo */}
      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: 'clamp(24px,3vw,42px)' }}>
            <p className="kicker">Trayectoria</p>
            <h2 className="h-xl" style={{ marginTop: 12 }}>
              Dos etapas, una misma manera de trabajar.
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
              <p className="kicker">Reconocimientos</p>
              <h2 className="h-xl" style={{ marginTop: 12 }}>
                Prensa y notas
              </h2>
            </div>
            <div className="prensa__row reveal d1">
              {prensa.map((p, i) => {
                const href = p.pdf || p.url;
                const cls = 'prensa__item' + (href ? ' is-link' : '');
                const inner = (
                  <>
                    <span className="prensa__medio">{p.medio}</span>
                    {p.fecha && <span className="prensa__det">{p.fecha}</span>}
                  </>
                );
                return href ? (
                  <a className={cls} key={i} href={href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <div className={cls} key={i}>
                    {inner}
                  </div>
                );
              })}
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
          >
            ¿Empezamos tu <em>proyecto</em>?
          </h2>
          <div
            className="reveal d1"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <button className="btn btn--light" onClick={open}>
              Solicitar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost-light" href="/proyectos">
              Ver proyectos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
