import { createSupabaseBrowser } from './supabase';

// Sube archivos al bucket `proyectos` y devuelve sus URLs públicas.
export async function uploadFiles(files) {
  const sb = createSupabaseBrowser();
  const urls = [];
  for (const file of Array.from(files)) {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sb.storage.from('proyectos').upload(name, file, { upsert: false });
    if (error) continue;
    const {
      data: { publicUrl },
    } = sb.storage.from('proyectos').getPublicUrl(name);
    urls.push(publicUrl);
  }
  return urls;
}
