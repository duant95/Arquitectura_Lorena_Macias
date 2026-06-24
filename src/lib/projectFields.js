// Campos permitidos al crear/editar un proyecto (whitelist anti-inyección).
const FIELDS = [
  'slug',
  'titulo',
  'categoria_label',
  'categorias',
  'resumen',
  'descripcion',
  'proceso',
  'anio',
  'superficie',
  'ubicacion',
  'servicios',
  'etapa',
  'imagen_portada',
  'galeria',
  'planos',
  'renders',
  'paleta',
  'destacado',
  'orden',
];

export function pickProjectFields(body) {
  const out = {};
  for (const k of FIELDS) {
    if (k in body) out[k] = body[k];
  }
  return out;
}
