'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Cantidad de columnas según el ancho (mantiene el ritmo desordenado, pero prolijo).
function colsForWidth(w) {
  if (w <= 620) return 1;
  if (w <= 980) return 2;
  return 3;
}

// Reparto round-robin (para el primer render, sin medir).
function roundRobin(count, cols) {
  const columns = Array.from({ length: cols }, () => []);
  for (let i = 0; i < count; i++) columns[i % cols].push(i);
  return columns;
}

// Reparto "columna más corta primero" usando alturas reales (empieza y termina parejo).
function balanced(count, cols, heights) {
  const columns = Array.from({ length: cols }, () => []);
  const colH = new Array(cols).fill(0);
  for (let i = 0; i < count; i++) {
    let m = 0;
    for (let c = 1; c < cols; c++) if (colH[c] < colH[m]) m = c;
    columns[m].push(i);
    colH[m] += heights[i] || 1;
  }
  return columns;
}

function sameCols(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].length !== b[i].length) return false;
    for (let j = 0; j < a[i].length; j++) if (a[i][j] !== b[i][j]) return false;
  }
  return true;
}

/**
 * Masonry balanceado: reparte los items en columnas dejándolos lo más parejos
 * posible (empieza y termina casi al mismo nivel), midiendo la altura real de
 * cada uno. Conserva las orientaciones naturales de las imágenes (sin recortar).
 */
export default function PMasonry({ items = [], renderItem, keyOf, className = '' }) {
  const wrapRef = useRef(null);
  const [layout, setLayout] = useState(() => ({
    columns: 3,
    assign: roundRobin(items.length, 3),
  }));

  const relayout = useCallback(() => {
    const columns = colsForWidth(window.innerWidth);
    const el = wrapRef.current;
    let assign = null;
    if (el) {
      const cells = el.querySelectorAll('[data-pm]');
      if (cells.length === items.length && items.length > 0) {
        const heights = {};
        cells.forEach((c) => {
          heights[c.dataset.pm] = c.offsetHeight || 0;
        });
        assign = balanced(items.length, columns, heights);
      }
    }
    if (!assign) assign = roundRobin(items.length, columns);
    setLayout((prev) =>
      prev.columns === columns && sameCols(prev.assign, assign) ? prev : { columns, assign }
    );
  }, [items.length]);

  useEffect(() => {
    relayout();
    const el = wrapRef.current;
    if (el) {
      el.querySelectorAll('img').forEach((img) => {
        if (!img.complete) img.addEventListener('load', relayout, { once: true });
      });
    }
    window.addEventListener('resize', relayout);
    return () => window.removeEventListener('resize', relayout);
  }, [relayout]);

  return (
    <div className={'pmasonry ' + className} ref={wrapRef} data-cols={layout.columns}>
      {layout.assign.map((idxs, c) => (
        <div className="pm-col" key={c}>
          {idxs.map((i) => (
            <div className="pm-cell" data-pm={i} key={keyOf ? keyOf(items[i], i) : i}>
              {renderItem(items[i], i)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
