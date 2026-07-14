// Optimiza una imagen en el navegador ANTES de subirla: la redimensiona a
// `maxPx` (lado mayor) y la recomprime a JPEG. Así, suba lo que suba la
// clienta, las fotos quedan livianas y el sitio no se pone lento.
// Videos y formatos que el navegador no puede decodificar pasan sin tocar.
export async function optimizeForUpload(file, maxPx = 2000, quality = 0.82) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxPx / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);
    if (bitmap.close) bitmap.close();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file; // si no mejora, dejamos el original
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return file; // HEIC u otros: se sube el original
  }
}
