'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Img from '../components/Img';
import useReveals from '../hooks/useReveals';
import { splitParagraphs, isVideo } from '../lib/projectShape';

// Galería ordenada y uniforme, con visor (lightbox) para ampliar las imágenes.
function Galeria({ items }) {
  const fotos = items.filter((g) => g.img);
  const [open, setOpen] = useState(null); // índice dentro de `fotos`

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((i) => (i > 0 ? i - 1 : fotos.length - 1)),
    [fotos.length]
  );
  const next = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setOpen((i) => (i < fotos.length - 1 ? i + 1 : 0));
    },
    [fotos.length]
  );

  useEffect(() => {
    if (open === null) return;
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [open, close, next, prev]);

  let fotoIdx = -1;
  return (
    <>
      <div className="pj-gal">
        {items.map((g, i) => {
          if (!g.img) {
            return (
              <div className="pj-gal__item" key={i}>
                <div className="ph" data-ph={g.ph} style={{ position: 'absolute', inset: 0 }}></div>
              </div>
            );
          }
          fotoIdx += 1;
          const idx = fotoIdx;
          return (
            <button type="button" className="pj-gal__item" key={i} onClick={() => setOpen(idx)}>
              {isVideo(g.img) ? (
                <>
                  <video src={g.img} muted loop playsInline preload="metadata" />
                  <span className="pj-gal__play">
                    <Play size={20} />
                  </span>
                </>
              ) : (
                <Img src={g.img} alt={g.alt} sizes="(max-width: 760px) 50vw, 33vw" />
              )}
            </button>
          );
        })}
      </div>

      {open !== null && fotos[open] && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox__btn lightbox__close" aria-label="Cerrar" onClick={close}>
            <X size={26} />
          </button>
          {fotos.length > 1 && (
            <button
              className="lightbox__btn lightbox__prev"
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              <ChevronLeft size={30} />
            </button>
          )}
          {isVideo(fotos[open].img) ? (
            <video
              src={fotos[open].img}
              controls
              autoPlay
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img src={fotos[open].img} alt={fotos[open].alt} onClick={(e) => e.stopPropagation()} />
          )}
          {fotos.length > 1 && (
            <button className="lightbox__btn lightbox__next" aria-label="Siguiente" onClick={next}>
              <ChevronRight size={30} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default function ProyectoView({ project, next }) {
  useReveals([project.slug]);

  const procesoParrafos = splitParagraphs(project.proceso);

  return (
    <>
      {/* HERO */}
      <section className="pj-hero">
        {project.cover ? (
          <Img src={project.cover} alt={project.name} priority sizes="100vw" />
        ) : (
          <div className="ph" data-ph={project.ph} style={{ position: 'absolute', inset: 0 }}></div>
        )}
        <div className="pj-hero__in">
          <div
            className="crumb"
            style={{
              color: 'var(--sage)',
              fontSize: '11px',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Link href="/proyectos" style={{ color: 'var(--sage)' }}>
              Proyectos
            </Link>{' '}
            — {project.name}
          </div>
          <div className="pj-hero__cat">{project.catLabel}</div>
          <h1>{project.name}</h1>
        </div>
      </section>

      {/* META + INTRO */}
      <section className="section" style={{ paddingTop: 'clamp(50px,6vw,84px)' }}>
        <div className="wrap">
          <div className="pj-meta reveal">
            <div>
              <span className="micro">Año</span>
              <b>{project.year}</b>
            </div>
            <div>
              <span className="micro">Superficie</span>
              <b>{project.area}</b>
            </div>
            <div>
              <span className="micro">Ubicación</span>
              <b>{project.location}</b>
            </div>
            <div>
              <span className="micro">Servicios</span>
              <b>{project.services}</b>
            </div>
          </div>
          <div className="split split--narrow" style={{ marginTop: 'clamp(50px,6vw,84px)' }}>
            <div className="reveal">
              <h2
                className="h-lg"
                style={{ maxWidth: '14ch' }}
                dangerouslySetInnerHTML={{ __html: project.heroTitle }}
              />
            </div>
            <div className="reveal d1">
              {project.leadParagraph && (
                <p
                  className="lead-serif"
                  style={{ marginBottom: '24px' }}
                  dangerouslySetInnerHTML={{ __html: project.leadParagraph }}
                />
              )}
              {project.bodyParagraphs.map((p, i) => (
                <p key={i} style={{ color: 'var(--ink-soft)' }}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      {project.gallery.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <Galeria items={project.gallery} />
          </div>
        </section>
      )}

      {/* PROCESO */}
      {procesoParrafos.length > 0 && (
        <section className="section" style={{ background: 'var(--paper-2)' }}>
          <div className="wrap">
            <div className="split split--narrow">
              <div className="reveal">
                <p className="eyebrow" style={{ marginBottom: '22px' }}>
                  El proceso
                </p>
                <h2 className="h-lg" style={{ maxWidth: '14ch' }}>
                  De la idea a la <em>obra</em>
                </h2>
              </div>
              <div className="reveal d1">
                {procesoParrafos.map((p, i) => (
                  <p key={i} style={{ color: 'var(--ink-soft)' }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PLANOS 2D */}
      {project.planos.length > 0 && (
        <section className="section" style={{ paddingTop: procesoParrafos.length ? undefined : 0 }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="sec-head__l">
                <span className="eyebrow">Documentación</span>
                <h2 className="h-xl">Planos 2D</h2>
              </div>
            </div>
            <Galeria items={project.planos} />
          </div>
        </section>
      )}

      {/* RENDERS 3D */}
      {project.renders.length > 0 && (
        <section className="section" style={{ background: 'var(--sand)' }}>
          <div className="wrap">
            <div className="sec-head reveal">
              <div className="sec-head__l">
                <span className="eyebrow">Anteproyecto</span>
                <h2 className="h-xl">Renders 3D</h2>
              </div>
            </div>
            <Galeria items={project.renders} />
          </div>
        </section>
      )}

      {/* MATERIALES / PALETA */}
      {project.palette.length > 0 && (
        <section className="section" style={{ background: 'var(--sand)' }}>
          <div className="wrap">
            <div className="split">
              <div className="reveal">
                <p className="eyebrow" style={{ marginBottom: '22px' }}>
                  Materialidad
                </p>
                <h2 className="h-lg" style={{ marginBottom: '24px' }}>
                  Una paleta <em>natural</em>
                </h2>
                <p style={{ color: 'var(--ink-soft)', maxWidth: '430px' }}>
                  Materiales nobles y honestos que componen una atmósfera que envejece con belleza y
                  dialoga con el entorno.
                </p>
              </div>
              <div className="reveal d1">
                <div className="paleta" style={{ marginBottom: '18px' }}>
                  {project.palette.map((c) => (
                    <div key={c.name} style={{ background: c.bg, color: c.fg }}>
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRÓXIMO PROYECTO */}
      {next && (
        <Link className="nextpj" href={`/proyecto/${next.slug}`}>
          {next.cover ? (
            <Img src={next.cover} alt="" sizes="100vw" />
          ) : (
            <div className="ph" data-ph={next.ph} style={{ position: 'absolute', inset: 0 }}></div>
          )}
          <div className="nextpj__c">
            <p className="eyebrow light" style={{ marginBottom: '18px' }}>
              Seguí explorando
            </p>
            <h2
              className="display"
              style={{ color: 'var(--cream)', fontSize: 'clamp(34px,5vw,76px)' }}
            >
              {next.name}
            </h2>
            <span className="link-arrow" style={{ color: 'var(--sage)', marginTop: '20px' }}>
              Ver proyecto <span className="arr">→</span>
            </span>
          </div>
        </Link>
      )}
    </>
  );
}
