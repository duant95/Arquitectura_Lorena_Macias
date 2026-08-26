'use client';

import { useEffect, useRef } from 'react';

/**
 * Editor visual (WYSIWYG) para textos/títulos. La arqui NO ve código: selecciona
 * una palabra y aprieta Resaltar / Negrita / A+ / A− y la ve formateada. Por
 * detrás se guardan las etiquetas que el sitio entiende (<em>, <strong>,
 * <span class="t-lg/t-sm">) y los saltos de línea como \n.
 */

// value guardado (con \n y tags) -> HTML para el editor
function toEditorHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\r/g, '')
    .replace(/\n/g, '<br>');
}

// HTML del editor -> value guardado (solo tags permitidos, saltos como \n)
function fromEditorHtml(root) {
  let out = '';
  const walk = (node) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        out += n.nodeValue.replace(/ /g, ' ');
        return;
      }
      if (n.nodeType !== 1) return;
      const tag = n.tagName;
      if (tag === 'BR') {
        out += '\n';
      } else if (tag === 'DIV' || tag === 'P') {
        if (out && !/\n$/.test(out)) out += '\n';
        walk(n);
      } else if (tag === 'EM' || tag === 'I') {
        out += '<em>';
        walk(n);
        out += '</em>';
      } else if (tag === 'STRONG' || tag === 'B') {
        out += '<strong>';
        walk(n);
        out += '</strong>';
      } else if (tag === 'SPAN' && (n.classList.contains('t-lg') || n.classList.contains('t-sm'))) {
        const cls = n.classList.contains('t-lg') ? 't-lg' : 't-sm';
        out += `<span class="${cls}">`;
        walk(n);
        out += '</span>';
      } else {
        walk(n);
      }
    });
  };
  walk(root);
  return out
    .replace(/<em>\s*<\/em>|<strong>\s*<\/strong>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/^\n+|\n+$/g, '');
}

export default function RichTextField({ label, value = '', onChange, rows = 2, hint, size = true }) {
  const ref = useRef(null);

  // sincroniza el contenido externo solo si cambió y no se está editando (evita saltos del cursor)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desired = toEditorHtml(value);
    if (el.innerHTML !== desired && document.activeElement !== el) {
      el.innerHTML = desired;
    }
  }, [value]);

  function emit() {
    if (ref.current) onChange(fromEditorHtml(ref.current));
  }

  function findWrapper(range, tag, className) {
    let node = range.commonAncestorContainer;
    if (node && node.nodeType === 3) node = node.parentNode;
    while (node && node !== ref.current) {
      if (
        node.tagName === tag.toUpperCase() &&
        (!className || (node.classList && node.classList.contains(className)))
      ) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  function unwrap(el) {
    const parent = el.parentNode;
    while (el.firstChild) parent.insertBefore(el.firstChild, el);
    parent.removeChild(el);
  }

  function format(tag, className) {
    const el = ref.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) return;

    const existing = findWrapper(range, tag, className);
    if (existing) {
      unwrap(existing);
    } else {
      const wrap = document.createElement(tag);
      if (className) wrap.className = className;
      try {
        range.surroundContents(wrap);
      } catch {
        wrap.appendChild(range.extractContents());
        range.insertNode(wrap);
      }
    }
    sel.removeAllRanges();
    emit();
  }

  return (
    <div className="ad-field">
      {label && <label>{label}</label>}
      <div className="ad-toolbar" role="toolbar">
        <button
          type="button"
          className="ad-tool"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format('em')}
          title="Resaltar con el color de acento"
        >
          <span className="ad-tool__hl">Resaltar</span>
        </button>
        <button
          type="button"
          className="ad-tool"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => format('strong')}
          title="Negrita"
        >
          <b>Negrita</b>
        </button>
        {size && (
          <>
            <span className="ad-tool__sep" aria-hidden="true" />
            <button
              type="button"
              className="ad-tool"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => format('span', 't-lg')}
              title="Más grande"
            >
              A+
            </button>
            <button
              type="button"
              className="ad-tool"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => format('span', 't-sm')}
              title="Más chico"
            >
              A−
            </button>
          </>
        )}
      </div>
      <div
        ref={ref}
        className="rich-editor"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        style={{ minHeight: `${Math.max(rows, 1) * 1.7 + 1.4}em` }}
        onInput={emit}
        onBlur={emit}
      />
      {hint && <p className="ad-hint">{hint}</p>}
    </div>
  );
}
