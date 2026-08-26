'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../context/LocaleContext';

/**
 * Prensa: grilla fina de tarjetas (medio + detalle). Al hacer click en una nota,
 * se abre con TODO su contenido: descripción, imágenes, y todos sus enlaces
 * (nota, redes, PDF). Una sola nota = todo adentro.
 */
export default function PrensaList({ items = [] }) {
  const t = useT();
  const [open, setOpen] = useState(null);
  const [lb, setLb] = useState(null);

  const linksOf = (p) => {
    const out = [];
    (Array.isArray(p.enlaces) ? p.enlaces : []).forEach((e) => {
      if (e && e.url) out.push({ label: e.label || t('sobre.verNota'), url: e.url });
    });
    if (p.url) out.push({ label: t('sobre.verNota'), url: p.url });
    if (p.pdf) out.push({ label: t('sobre.verPdf'), url: p.pdf });
    return out;
  };
  const imgsOf = (p) =>
    (Array.isArray(p.imagenes) ? p.imagenes : [])
      .map((x) => (typeof x === 'string' ? x : x?.url))
      .filter(Boolean);

  const note = open != null ? items[open] : null;
  const noteImgs = note ? imgsOf(note) : [];
  const noteLinks = note ? linksOf(note) : [];

  return (
    <>
      <div className="prensa__row">
        {items.map((p, i) => {
          const has = linksOf(p).length || imgsOf(p).length || p.descripcion || p.titulo;
          return (
            <button
              type="button"
              className={'prensa__item' + (has ? ' is-link' : '')}
              key={i}
              onClick={() => has && setOpen(i)}
              disabled={!has}
            >
              <span className="prensa__medio">{p.medio}</span>
              {p.fecha && <span className="prensa__det">{p.fecha}</span>}
            </button>
          );
        })}
      </div>

      {note &&
        createPortal(
          <div className="prensa-modal" onClick={() => setOpen(null)}>
          <div className="prensa-modal__card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="prensa-modal__close"
              aria-label="Cerrar"
              onClick={() => setOpen(null)}
            >
              ×
            </button>
            {note.fecha && <p className="prensa-modal__det">{note.fecha}</p>}
            <h3 className="prensa-modal__medio">{note.medio}</h3>
            {note.titulo && <p className="prensa-modal__t">{note.titulo}</p>}
            {note.descripcion && <p className="prensa-modal__d">{note.descripcion}</p>}

            {noteImgs.length > 0 && (
              <div className="prensa-modal__imgs">
                {noteImgs.map((src, k) => (
                  <button
                    type="button"
                    className="prensa2__thumb"
                    key={k}
                    onClick={() => setLb({ imgs: noteImgs, idx: k })}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            {noteLinks.length > 0 && (
              <div className="prensa-modal__links">
                {noteLinks.map((l, k) => (
                  <a
                    key={k}
                    className="link-arrow"
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} <span className="arr">→</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>,
          document.body
        )}

      {lb &&
        createPortal(
          <div className="lightbox" onClick={() => setLb(null)}>
            <button
              type="button"
              className="lightbox__btn lightbox__close"
              aria-label="Cerrar"
              onClick={() => setLb(null)}
            >
              ×
            </button>
            <img src={lb.imgs[lb.idx]} alt="" onClick={(e) => e.stopPropagation()} />
          </div>,
          document.body
        )}
    </>
  );
}
