import { createSupabaseBrowser } from './supabase';
import { optimizeForUpload } from './imageResize';

// Sube un archivo al bucket público de Storage y devuelve su URL.
// Optimiza la imagen en el navegador antes de subir (peso liviano).
export async function uploadFile(input) {
  const sb = createSupabaseBrowser();
  const file = await optimizeForUpload(input);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from('proyectos').upload(name, file, { upsert: false });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = sb.storage.from('proyectos').getPublicUrl(name);
  return publicUrl;
}

// Sube un documento (PDF, etc.) tal cual, sin optimizar, y devuelve su URL.
// Se abre en el navegador (no se descarga) al enlazarlo.
export async function uploadDoc(input) {
  const sb = createSupabaseBrowser();
  const ext = (input.name.split('.').pop() || 'pdf').toLowerCase();
  const name = `docs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage
    .from('proyectos')
    .upload(name, input, { upsert: false, contentType: input.type || 'application/pdf' });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = sb.storage.from('proyectos').getPublicUrl(name);
  return publicUrl;
}
