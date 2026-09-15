// Qué claves de `configuracion` se traducen automáticamente y cómo.
// (Las imágenes, datos de contacto, colores y slugs quedan fuera.)

// Claves de TEXTO plano (admiten <em>/<br/> y \n).
export const TEXT_KEYS = [
  'inicio_hero_eyebrow',
  'inicio_hero_titulo',
  'inicio_hero_descripcion',
  'inicio_manifiesto',
  'inicio_cta_titulo',
  'inicio_cta_descripcion',
  'proyectos_hero_titulo',
  'proyectos_hero_lead',
  'servicios_hero_titulo',
  'servicios_hero_lead',
  'nosotros_hero_titulo',
  'nosotros_intro_titulo',
  'nosotros_estudio_titulo',
  'nosotros_estudio_texto',
  'nosotros_intro_lead',
  'nosotros_intro_texto',
  'nosotros_hero_lead',
  'nosotros_historia',
  'nosotros_cita',
  'nosotros_transicion',
];

// Claves cuyo valor es un JSON con textos anidados.
export const JSON_KEYS = [
  'servicios',
  'nosotros_trayectoria',
  'inicio_stats',
  'inicio_showcase',
  'nosotros_pilares',
  'proyectos_etapas',
  'servicios_pasos',
  'nosotros_prensa',
  'nosotros_historia_imagenes',
  'nosotros_carrusel',
  'nosotros_estudio_imagenes',
];

const TEXT = new Set(TEXT_KEYS);
const JSONS = new Set(JSON_KEYS);

// Devuelve 'text' | 'json' | null según se deba traducir la clave.
export function translatableKind(clave) {
  if (!clave || clave.includes('__')) return null; // ya es una traducción
  if (JSONS.has(clave)) return 'json';
  if (TEXT.has(clave)) return 'text';
  return null;
}
