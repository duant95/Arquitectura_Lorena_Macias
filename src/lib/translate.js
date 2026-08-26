// Traducción automática con DeepL (ES -> EN / PT-BR).
// Respeta el HTML inline (<em>, <br />) y los saltos de línea (\n) de párrafos.
// Si no hay DEEPL_API_KEY configurada, las funciones devuelven el texto original.

const KEY = process.env.DEEPL_API_KEY;
const ENDPOINT =
  KEY && KEY.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

const TARGET = { en: 'EN-US', pt: 'PT-BR' };

// Claves cuyo valor NO se traduce (rutas, imágenes, slugs, colores, códigos, números).
const BLOCK_KEYS = new Set([
  'imagen',
  'imagenes',
  'img',
  'image',
  'url',
  'pdf',
  'href',
  'src',
  'slug',
  'key',
  'bg',
  'fg',
  'n',
]);

export function deeplEnabled() {
  return !!KEY;
}

function skipString(s) {
  if (!s || !s.trim()) return true;
  if (/^(https?:|mailto:|tel:|\/)/i.test(s)) return true; // URLs / rutas
  if (/^#[0-9a-f]{3,8}$/i.test(s)) return true; // colores hex
  if (/\.(jpe?g|png|webp|gif|svg|pdf|mp4|mov|webm)$/i.test(s)) return true; // archivos
  return false;
}

/**
 * Traduce un texto (con posible HTML inline y \n) al locale destino.
 * Divide por líneas para preservar los párrafos y usa tag_handling=html
 * para no romper <em>/<br />.
 */
export async function translateText(text, locale) {
  if (!KEY || !TARGET[locale]) return text;
  if (typeof text !== 'string' || skipString(text)) return text;

  const lines = text.split('\n');
  const idx = [];
  const payload = [];
  lines.forEach((ln, i) => {
    if (ln.trim() !== '') {
      idx.push(i);
      payload.push(ln);
    }
  });
  if (payload.length === 0) return text;

  const params = new URLSearchParams();
  params.append('source_lang', 'ES');
  params.append('target_lang', TARGET[locale]);
  params.append('tag_handling', 'html');
  payload.forEach((t) => params.append('text', t));

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let res;
  for (let attempt = 0; attempt < 5; attempt++) {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `DeepL-Auth-Key ${KEY}`,
      },
      body: params,
    });
    if (res.status !== 429) break;
    await sleep(1200 * (attempt + 1)); // backoff ante rate limit del plan free
  }
  if (!res.ok) {
    throw new Error(`DeepL ${res.status}: ${await res.text().catch(() => '')}`);
  }
  const data = await res.json();
  const out = [...lines];
  (data.translations || []).forEach((tr, k) => {
    out[idx[k]] = tr.text;
  });
  return out.join('\n');
}

/**
 * Traduce recursivamente todos los textos de un valor (string, array u objeto),
 * respetando la estructura y sin tocar rutas/imágenes/slugs/colores/números.
 */
export async function translateDeep(value, locale, keyName = '') {
  if (typeof value === 'string') {
    if (BLOCK_KEYS.has(keyName) || skipString(value)) return value;
    return translateText(value, locale);
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await translateDeep(item, locale, keyName));
    return out;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await translateDeep(v, locale, k);
    return out;
  }
  return value;
}

/**
 * Traduce el VALOR de una clave de configuración (string o JSON string).
 * Devuelve un string listo para guardar en la columna `valor`.
 */
export async function translateConfigValue(value, locale, { json = false } = {}) {
  if (!KEY || !TARGET[locale] || value == null || value === '') return value;
  if (json) {
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch {
      return value;
    }
    const translated = await translateDeep(parsed, locale);
    return JSON.stringify(translated);
  }
  return translateText(value, locale);
}

export const TRANSLATE_LOCALES = Object.keys(TARGET);
