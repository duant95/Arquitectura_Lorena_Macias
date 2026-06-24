import { createSupabaseBrowser } from './supabase';

// Sube un archivo al bucket público de Storage y devuelve su URL.
export async function uploadFile(file) {
  const sb = createSupabaseBrowser();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from('proyectos').upload(name, file, { upsert: false });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = sb.storage.from('proyectos').getPublicUrl(name);
  return publicUrl;
}
