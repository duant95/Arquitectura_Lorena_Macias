'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createSupabaseBrowser } from '@/lib/supabase';
import { Upload, X, ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadFiles(files) {
  const sb = createSupabaseBrowser();
  const urls = [];
  for (const file of Array.from(files)) {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await sb.storage.from('proyectos').upload(name, file, { upsert: false });
    if (error) {
      toast.error(`Error subiendo ${file.name}`);
      continue;
    }
    const {
      data: { publicUrl },
    } = sb.storage.from('proyectos').getPublicUrl(name);
    urls.push(publicUrl);
  }
  return urls;
}

// Lista de imágenes con subida, orden y borrado
function ImageList({ label, hint, items, onChange }) {
  const [busy, setBusy] = useState(false);

  async function onUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    const urls = await uploadFiles(files);
    onChange([...items, ...urls.map((url) => ({ url, alt: '' }))]);
    setBusy(false);
    e.target.value = '';
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function move(i, dir) {
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="ad-field">
      <label>{label}</label>
      {hint && <p className="ad-hint">{hint}</p>}
      <label className="ad-upload">
        <Upload size={20} />
        {busy ? 'Subiendo…' : 'Clic para subir imágenes (varias a la vez)'}
        <input type="file" accept="image/*" multiple hidden onChange={onUpload} disabled={busy} />
      </label>
      {items.length > 0 && (
        <div className="ad-imgs">
          {items.map((it, i) => (
            <div className="ad-img" key={i}>
              <img src={it.url} alt="" />
              <div className="ad-img__bar">
                <button
                  type="button"
                  className="ad-img__btn"
                  onClick={() => move(i, 'up')}
                  title="Subir"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  className="ad-img__btn"
                  onClick={() => move(i, 'down')}
                  title="Bajar"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  className="ad-img__btn"
                  onClick={() => remove(i)}
                  title="Quitar"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProyectoForm({ proyecto, isEditing = false }) {
  const router = useRouter();
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [portadaBusy, setPortadaBusy] = useState(false);

  const [form, setForm] = useState({
    titulo: proyecto?.titulo ?? '',
    slug: proyecto?.slug ?? '',
    categoria_label: proyecto?.categoria_label ?? '',
    categorias: proyecto?.categorias ?? '',
    resumen: proyecto?.resumen ?? '',
    descripcion: proyecto?.descripcion ?? '',
    proceso: proyecto?.proceso ?? '',
    anio: proyecto?.anio ?? '',
    superficie: proyecto?.superficie ?? '',
    ubicacion: proyecto?.ubicacion ?? '',
    servicios: proyecto?.servicios ?? '',
    destacado: proyecto?.destacado ?? false,
    orden: proyecto?.orden ?? 99,
  });
  const [portada, setPortada] = useState(proyecto?.imagen_portada ?? '');
  const [galeria, setGaleria] = useState(proyecto?.galeria ?? []);
  const [planos, setPlanos] = useState(proyecto?.planos ?? []);
  const [renders, setRenders] = useState(proyecto?.renders ?? []);
  const [paleta, setPaleta] = useState(
    proyecto?.paleta?.length ? proyecto.paleta : [{ name: '', hex: '#8a5d33' }]
  );

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function onTitulo(value) {
    set('titulo', value);
    if (!slugEdited) set('slug', slugify(value));
  }

  async function onPortada(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setPortadaBusy(true);
    const [url] = await uploadFiles(files);
    if (url) setPortada(url);
    setPortadaBusy(false);
    e.target.value = '';
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.titulo.trim()) return toast.error('El título es obligatorio');
    if (!form.slug.trim()) return toast.error('Falta el slug (URL)');
    setSaving(true);
    const body = {
      ...form,
      slug: slugify(form.slug),
      orden: Number(form.orden) || 99,
      imagen_portada: portada || galeria[0]?.url || null,
      galeria,
      planos,
      renders,
      paleta: paleta.filter((c) => c.name?.trim()),
    };
    const url = isEditing ? `/api/proyectos/${proyecto.id}` : '/api/proyectos';
    const res = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return toast.error(data.error || 'Error al guardar');
    }
    toast.success(isEditing ? 'Proyecto actualizado' : 'Proyecto creado');
    router.push('/admin/proyectos');
    router.refresh();
  }

  return (
    <form className="ad-form" onSubmit={onSubmit}>
      {/* Datos */}
      <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ad-field">
          <label>Título *</label>
          <input
            className="ad-input"
            value={form.titulo}
            onChange={(e) => onTitulo(e.target.value)}
            placeholder="Casa del Bosque"
          />
        </div>
        <div className="ad-field">
          <label>URL (slug)</label>
          <input
            className="ad-input"
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true);
              set('slug', e.target.value);
            }}
            placeholder="casa-del-bosque"
          />
          <p className="ad-hint">La obra vivirá en /proyecto/{form.slug || 'slug'}</p>
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Categoría (visible)</label>
            <input
              className="ad-input"
              value={form.categoria_label}
              onChange={(e) => set('categoria_label', e.target.value)}
              placeholder="Vivienda · Diseño de interiores"
            />
          </div>
          <div className="ad-field">
            <label>Categorías (para filtros)</label>
            <input
              className="ad-input"
              value={form.categorias}
              onChange={(e) => set('categorias', e.target.value)}
              placeholder="vivienda interior"
            />
            <p className="ad-hint">
              Palabras separadas por espacio: vivienda, reforma, interior, paisaje, obra.
            </p>
          </div>
        </div>
        <div className="ad-field">
          <label>Frase destacada (hero de la obra)</label>
          <input
            className="ad-input"
            value={form.resumen}
            onChange={(e) => set('resumen', e.target.value)}
            placeholder="Una casa que se abre al <em>verde</em>."
          />
          <p className="ad-hint">
            Podés usar &lt;em&gt;palabra&lt;/em&gt; para resaltar en itálica.
          </p>
        </div>
        <div className="ad-field">
          <label>Descripción</label>
          <textarea
            className="ad-textarea"
            rows={5}
            value={form.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            placeholder="Primer párrafo (destacado)…&#10;&#10;Segundo párrafo…"
          />
          <p className="ad-hint">
            El primer párrafo se muestra resaltado. Cada línea en blanco separa un párrafo.
          </p>
        </div>
        <div className="ad-field">
          <label>El proceso (opcional)</label>
          <textarea
            className="ad-textarea"
            rows={4}
            value={form.proceso}
            onChange={(e) => set('proceso', e.target.value)}
            placeholder="Historia del proceso de diseño y obra…"
          />
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Año</label>
            <input
              className="ad-input"
              value={form.anio}
              onChange={(e) => set('anio', e.target.value)}
              placeholder="2024"
            />
          </div>
          <div className="ad-field">
            <label>Superficie</label>
            <input
              className="ad-input"
              value={form.superficie}
              onChange={(e) => set('superficie', e.target.value)}
              placeholder="320 m²"
            />
          </div>
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Ubicación</label>
            <input
              className="ad-input"
              value={form.ubicacion}
              onChange={(e) => set('ubicacion', e.target.value)}
              placeholder="Luque, PY"
            />
          </div>
          <div className="ad-field">
            <label>Servicios</label>
            <input
              className="ad-input"
              value={form.servicios}
              onChange={(e) => set('servicios', e.target.value)}
              placeholder="Arq. + Interiores"
            />
          </div>
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Orden (menor = primero)</label>
            <input
              className="ad-input"
              type="number"
              value={form.orden}
              onChange={(e) => set('orden', e.target.value)}
            />
          </div>
          <label className="ad-check" style={{ alignSelf: 'end', paddingBottom: 10 }}>
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) => set('destacado', e.target.checked)}
            />
            Mostrar en el inicio (destacado)
          </label>
        </div>
      </div>

      {/* Portada */}
      <div className="ad-card">
        <div className="ad-field">
          <label>Imagen de portada</label>
          {portada && (
            <div className="ad-imgs" style={{ marginBottom: 10 }}>
              <div className="ad-img">
                <img src={portada} alt="" />
                <span className="ad-img__cover">Portada</span>
                <div className="ad-img__bar">
                  <button
                    type="button"
                    className="ad-img__btn"
                    onClick={() => setPortada('')}
                    title="Quitar"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
          <label className="ad-upload">
            <Upload size={20} />
            {portadaBusy ? 'Subiendo…' : 'Subir imagen de portada'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onPortada}
              disabled={portadaBusy}
            />
          </label>
        </div>
      </div>

      {/* Galerías */}
      <div className="ad-card">
        <ImageList
          label="Galería"
          hint="Fotos de la obra terminada."
          items={galeria}
          onChange={setGaleria}
        />
      </div>
      <div className="ad-card">
        <ImageList
          label="Planos 2D"
          hint="Plantas, cortes y vistas."
          items={planos}
          onChange={setPlanos}
        />
      </div>
      <div className="ad-card">
        <ImageList
          label="Renders 3D"
          hint="Imágenes del anteproyecto."
          items={renders}
          onChange={setRenders}
        />
      </div>

      {/* Paleta */}
      <div className="ad-card">
        <div className="ad-field">
          <label>Paleta de materiales</label>
          <p className="ad-hint">Nombre + color de cada material (madera, piedra, etc.).</p>
        </div>
        {paleta.map((c, i) => (
          <div className="ad-pal-row" key={i}>
            <input
              type="color"
              value={c.hex || '#888888'}
              onChange={(e) =>
                setPaleta(paleta.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))
              }
            />
            <input
              className="ad-input"
              placeholder="Nombre (ej. Madera)"
              value={c.name}
              onChange={(e) =>
                setPaleta(paleta.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
              }
            />
            <button
              type="button"
              className="ad-img__btn"
              onClick={() => setPaleta(paleta.filter((_, j) => j !== i))}
              title="Quitar"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="ad-btn ad-btn--ghost"
          onClick={() => setPaleta([...paleta, { name: '', hex: '#8a5d33' }])}
        >
          <Plus size={14} /> Agregar material
        </button>
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="ad-btn" type="submit" disabled={saving}>
          {saving ? 'Guardando…' : isEditing ? 'Actualizar proyecto' : 'Publicar proyecto'}
        </button>
        <button type="button" className="ad-btn ad-btn--ghost" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
