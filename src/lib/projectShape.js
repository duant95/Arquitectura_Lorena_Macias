// Helpers para normalizar proyectos a la forma que esperan las vistas,
// vengan de Supabase o de los datos de ejemplo locales.

// ¿La URL es un video? (para galerías con foto + video)
export function isVideo(url) {
  return /\.(mp4|webm|mov|ogg|ogv|m4v)(\?|$)/i.test(url || '');
}

// Luminancia → color de texto legible sobre un color de fondo.
export function paletteFg(hex) {
  const h = (hex || '').replace('#', '');
  if (h.length < 6) return '#fff';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? '#5a5448' : '#fff';
}

// Patrón de maquetación para galerías cargadas desde el CMS (lista plana de
// imágenes). Reproduce el ritmo editorial del diseño original.
const GALLERY_PATTERN = [
  { span: 'span7', ratio: '16/10' },
  { span: 'span5', ratio: '4/5' },
  { span: 'full', ratio: null },
  { span: 'span5', ratio: '4/5' },
  { span: 'span7', ratio: '16/10' },
];

export function autoLayoutGallery(items) {
  const list = Array.isArray(items) ? items : [];
  return list
    .filter((it) => it && (it.url || it.img))
    .map((it, i) => {
      const pat = GALLERY_PATTERN[i % GALLERY_PATTERN.length];
      return { img: it.url || it.img, alt: it.alt || '', span: pat.span, ratio: pat.ratio };
    });
}

// Año para ordenar cronológicamente (recientes primero). Toma el mayor año del
// texto `anio`; si el proyecto está "en presente/en obra", lo trata como vigente
// (queda arriba de todo). Sin año → 0 (al final).
export function projectYear(anio) {
  if (!anio) return 0;
  const s = String(anio).toLowerCase();
  if (/presente|hoy|actual|en obra|activo|vigente/.test(s)) {
    return new Date().getFullYear() + 1;
  }
  const years = (s.match(/\d{4}/g) || []).map(Number);
  return years.length ? Math.max(...years) : 0;
}

// Etapa de carrera del proyecto. Si no está definida explícitamente, se infiere
// por el año: 2019 en adelante = estudio propio; antes = etapa Gustafson.
// 'gustafson' implica colaboración (la propiedad intelectual no es del estudio).
export function inferEtapa(anio, explicit) {
  const e = String(explicit || '').toLowerCase();
  if (e === 'propio' || e === 'gustafson') return e;
  return projectYear(anio) >= 2019 ? 'propio' : 'gustafson';
}

// Texto multilínea → array de párrafos (cada salto de línea = párrafo).
export function splitParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Patrón de spans para la grilla del portafolio.
const CARD_LAYOUT = [
  { span: 's7 h-med', delay: '' },
  { span: 's5 h-med', delay: 'd1' },
  { span: 's5 h-tall', delay: '' },
  { span: 's7 h-tall', delay: 'd1' },
  { span: 's5 h-med', delay: '' },
  { span: 's7 h-med', delay: 'd1' },
  { span: 's4 h-tall', delay: '' },
  { span: 's4 h-tall', delay: 'd1' },
  { span: 's4 h-tall', delay: 'd2' },
];

// Fila de Supabase → forma unificada que consumen las vistas.
export function normalizeRow(row, index = 0) {
  const layout = CARD_LAYOUT[index % CARD_LAYOUT.length];
  const paragraphs = splitParagraphs(row.descripcion);
  const meta = [];
  const ubicYanio = [row.ubicacion, row.anio].filter(Boolean).join(' · ');
  if (ubicYanio) meta.push(ubicYanio);
  if (row.superficie) meta.push(row.superficie);

  return {
    slug: row.slug,
    name: row.titulo,
    catLabel: row.categoria_label || '',
    cat: row.categorias || '',
    idx: String(index + 1).padStart(2, '0'),
    span: layout.span,
    delay: layout.delay,
    cover: row.imagen_portada || null,
    ph: row.imagen_portada ? null : 'Imagen pendiente',
    meta,
    year: row.anio || '—',
    area: row.superficie || '—',
    location: row.ubicacion || '—',
    services: row.servicios || '—',
    etapa: inferEtapa(row.anio, row.etapa),
    heroTitle: row.resumen || row.titulo,
    leadParagraph: paragraphs[0] || '',
    bodyParagraphs: paragraphs.slice(1),
    proceso: row.proceso || '',
    palette: (Array.isArray(row.paleta) ? row.paleta : []).map((p) => ({
      name: p.name,
      bg: p.hex || p.bg,
      fg: paletteFg(p.hex || p.bg),
    })),
    gallery: autoLayoutGallery(row.galeria),
    planos: autoLayoutGallery(row.planos),
    renders: autoLayoutGallery(row.renders),
    destacado: !!row.destacado,
    orden: row.orden ?? 99,
  };
}

// Proyecto local (src/data/projects.js) → misma forma unificada.
export function normalizeLocal(p) {
  return {
    slug: p.slug,
    name: p.name,
    catLabel: p.catLabel,
    cat: p.cat,
    idx: p.idx,
    span: p.span,
    delay: p.delay || '',
    cover: p.cover || null,
    ph: p.cover ? null : p.ph || 'Imagen pendiente',
    meta: p.meta || [],
    year: p.year,
    area: p.area,
    location: p.location,
    services: p.services,
    etapa: inferEtapa(p.year, p.etapa),
    heroTitle: p.heroTitle,
    leadParagraph: p.intro || '',
    bodyParagraphs: p.body ? [p.body] : [],
    proceso: p.proceso || '',
    palette: p.palette || [],
    gallery: (p.gallery || []).map((g) => ({
      img: g.img || null,
      ph: g.img ? null : g.ph,
      alt: g.alt || '',
      span: g.span,
      ratio: g.ratio || null,
    })),
    planos: [],
    renders: [],
    destacado: true,
    orden: 99,
  };
}
