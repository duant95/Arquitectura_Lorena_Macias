'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Img from '../components/Img';
import useReveals from '../hooks/useReveals';
import { useT, useHref } from '../context/LocaleContext';
import { Parallax, EASE } from '../components/fx/Motion';
import { splitParagraphs, isVideo } from '../lib/projectShape';

// Galería ordenada y uniforme, con visor (lightbox) para ampliar las imágenes.
function Galeria({ items }) {
  const t = useT();
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
          <button className="lightbox__btn lightbox__close" aria-label={t('pj.ariaCerrar')} onClick={close}>
            <X size={26} />
          </button>
          {fotos.length > 1 && (
            <button
              className="lightbox__btn lightbox__prev"
              aria-label={t('pj.ariaAnterior')}
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
            <button className="lightbox__btn lightbox__next" aria-label={t('pj.ariaSiguiente')} onClick={next}>
              <ChevronRight size={30} />
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default function ProyectoView({ project, next }) {
  const t = useT();
  const href = useHref();
  useReveals([project.slug]);

  const procesoParrafos = splitParagraphs(project.proceso);

  return (
    <>
      {/* HERO */}
      <section className="pj-hero">
        {project.cover ? (
          <Parallax className="pj-hero__media" src={project.cover} alt={project.name} strength={10} priority />
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
            <Link href={href('/proyectos')} style={{ color: 'var(--sage)' }}>
              {t('nav.proyectos')}
            </Link>{' '}
            / {project.name}
          </div>
          <motion.div
            className="pj-hero__cat"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          >
            {project.catLabel}
          </motion.div>
          <h1 className="pj-hero__title">
            <span className="ln">
              <motion.span
                style={{ display: 'block' }}
                initial={{ y: '115%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.05, ease: EASE, delay: 0.25 }}
              >
                {project.name}
              </motion.span>
            </span>
          </h1>
        </div>
      </section>

      {/* META + INTRO */}
      <section className="section" style={{ paddingTop: 'clamp(50px,6vw,84px)' }}>
        <div className="wrap">
          <div className="pj-meta reveal">
            <div>
              <span className="micro">{t('pj.metaAno')}</span>
              <b>{project.year}</b>
            </div>
            <div>
              <span className="micro">{t('pj.metaSuperficie')}</span>
              <b>{project.area}</b>
            </div>
            <div>
              <span className="micro">{t('pj.metaUbicacion')}</span>
              <b>{project.location}</b>
            </div>
            <div>
              <span className="micro">{t('pj.metaServicios')}</span>
              <b>{project.services}</b>
            </div>
            {project.ficha.datos.map(([label, val]) => (
              <div key={label}>
                <span className="micro">{label}</span>
                <b>{val}</b>
              </div>
            ))}
          </div>
          {(() => {
            const hasTitle = project.heroTitle && project.heroTitle !== project.name;
            const desc = (
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
            );
            return hasTitle ? (
              <div className="split split--narrow" style={{ marginTop: 'clamp(40px,5vw,72px)' }}>
                <div className="reveal">
                  <h2
                    className="h-lg"
                    style={{ maxWidth: '14ch' }}
                    dangerouslySetInnerHTML={{ __html: project.heroTitle }}
                  />
                </div>
                {desc}
              </div>
            ) : (
              <div style={{ marginTop: 'clamp(28px,3.5vw,48px)', maxWidth: 760 }}>{desc}</div>
            );
          })()}
        </div>
      </section>

      {/* CLAVES DEL PROYECTO (detalles a destacar) */}
      {project.ficha.claves.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="pj-claves reveal">
              <p className="eyebrow" style={{ marginBottom: 'clamp(18px,2vw,28px)' }}>
                {t('pj.clavesTitulo')}
              </p>
              <ul className="pj-claves__list">
                {project.ficha.claves.map((c, i) => (
                  <li key={i} className="pj-claves__item">
                    <span className="pj-claves__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pj-claves__t">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* RECORRIDO POR ETAPA — Resultado final → Proceso de obra → Antes */}
      {(() => {
        // Si el proyecto está dividido en secciones/áreas con nombre, se muestran esas.
        const secciones = project.gallerySections;
        if (secciones && secciones.length) {
          return (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="wrap">
                {secciones.map((sec, i) => (
                  <div className="pj-fase" key={sec.nombre}>
                    <div className="pj-fase__head reveal">
                      {secciones.length > 1 && (
                        <span className="pj-fase__n">{String(i + 1).padStart(2, '0')}</span>
                      )}
                      <h2 className="pj-fase__label">{sec.nombre}</h2>
                    </div>
                    <Galeria items={sec.items} />
                  </div>
                ))}
              </div>
            </section>
          );
        }
        const g = project.galleryByFase || { antes: [], durante: [], finalizado: project.gallery };
        const FASES = [
          ['finalizado', t('pj.faseFinal')],
          ['durante', t('pj.faseDurante')],
          ['antes', t('pj.faseAntes')],
        ];
        const presentes = FASES.filter(([k]) => (g[k] || []).length > 0);
        if (presentes.length === 0) return null;
        // Con una sola etapa mostramos igual el rótulo (sin numerar), para
        // que quede en sintonía con los proyectos que sí tienen recorrido.
        if (presentes.length === 1) {
          const [key, label] = presentes[0];
          return (
            <section className="section" style={{ paddingTop: 0 }}>
              <div className="wrap">
                <div className="pj-fase">
                  <div className="pj-fase__head reveal">
                    <h2 className="pj-fase__label">{label}</h2>
                  </div>
                  <Galeria items={g[key]} />
                </div>
              </div>
            </section>
          );
        }
        return (
          <section className="section" style={{ paddingTop: 0 }}>
            <div className="wrap">
              {presentes.map(([key, label], i) => (
                <div className="pj-fase" key={key}>
                  <div className="pj-fase__head reveal">
                    <span className="pj-fase__n">{String(i + 1).padStart(2, '0')}</span>
                    <h2 className="pj-fase__label">{label}</h2>
                  </div>
                  <Galeria items={g[key]} />
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* PROCESO */}
      {procesoParrafos.length > 0 && (
        <section className="section" style={{ background: 'var(--paper-2)' }}>
          <div className="wrap">
            <div className="split split--narrow">
              <div className="reveal">
                <p className="eyebrow" style={{ marginBottom: '22px' }}>
                  {t('pj.procesoEyebrow')}
                </p>
                <h2
                  className="h-lg"
                  style={{ maxWidth: '14ch' }}
                  dangerouslySetInnerHTML={{ __html: t('pj.procesoTitulo') }}
                />
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
                <span className="eyebrow">{t('pj.docEyebrow')}</span>
                <h2 className="h-xl">{t('pj.docTitulo')}</h2>
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
                <span className="eyebrow">{t('pj.renderEyebrow')}</span>
                <h2 className="h-xl">{t('pj.renderTitulo')}</h2>
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
                  {t('pj.materialEyebrow')}
                </p>
                <h2
                  className="h-lg"
                  style={{ marginBottom: '24px' }}
                  dangerouslySetInnerHTML={{ __html: t('pj.materialTitulo') }}
                />
                <p style={{ color: 'var(--ink-soft)', maxWidth: '430px' }}>
                  {t('pj.materialTexto')}
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

      {/* CRÉDITOS / EMPRESAS / PROVEEDORES */}
      {project.ficha.creditos.length > 0 && (
        <section className="section" style={{ background: 'var(--paper-2)' }}>
          <div className="wrap">
            <p className="eyebrow reveal" style={{ marginBottom: 'clamp(20px,2.4vw,32px)' }}>
              {t('pj.creditosTitulo')}
            </p>
            <div className="pj-creditos reveal">
              {project.ficha.creditos.map((c, i) => (
                <div className="pj-credito" key={i}>
                  {c.rol && <span className="pj-credito__rol">{c.rol}</span>}
                  {c.nombre && <span className="pj-credito__nombre">{c.nombre}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRÓXIMO PROYECTO */}
      {next && (
        <>
          <div className="nextpj-lead">
            <p className="nextpj__kicker">{t('pj.nextEyebrow')}</p>
          </div>
          <Link className="nextpj" href={href(`/proyecto/${next.slug}`)}>
            {next.cover ? (
              <Parallax className="nextpj__media" src={next.cover} alt="" strength={10} />
            ) : (
              <div className="ph" data-ph={next.ph} style={{ position: 'absolute', inset: 0 }}></div>
            )}
            <div className="nextpj__c">
              <h2
                className="display"
                style={{ color: 'var(--cream)', fontSize: 'clamp(34px,5vw,76px)' }}
              >
                {next.name}
              </h2>
              <span className="link-arrow" style={{ color: 'var(--sage)', marginTop: '20px' }}>
                {t('cta.verProyecto')} <span className="arr">→</span>
              </span>
            </div>
          </Link>
        </>
      )}
    </>
  );
}
