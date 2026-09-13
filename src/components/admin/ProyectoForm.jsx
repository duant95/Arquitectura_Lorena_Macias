'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createSupabaseBrowser } from '@/lib/supabase';
import { Upload, X, ChevronUp, ChevronDown, Plus, Trash2, Star, Play } from 'lucide-react';
import { isVideo, inferEtapa, normalizeFicha } from '@/lib/projectShape';
import { optimizeForUpload } from '@/lib/imageResize';

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
  for (const original of Array.from(files)) {
    const file = await optimizeForUpload(original);
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

// Lista de imágenes con subida, orden, borrado y (opcional) selección de portada
function ImageList({
  label,
  hint,
  items,
  onChange,
  cover,
  onCover,
  withFase = false,
  withSeccion = false,
}) {
  const [busy, setBusy] = useState(false);
  const setFase = (i, val) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, fase: val } : it)));
  const setSeccion = (i, val) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, seccion: val } : it)));

  async function onUpload(e) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(true);
    const urls = await uploadFiles(files);
    const added = urls.map((url) => ({ url, alt: '' }));
    onChange([...items, ...added]);
    // si todavía no hay portada elegida, la primera imagen (no video) pasa a serlo
    const firstImg = added.find((a) => !isVideo(a.url));
    if (onCover && !cover && firstImg) onCover(firstImg.url);
    setBusy(false);
    e.target.value = '';
  }
  function remove(i) {
    const removed = items[i];
    const next = items.filter((_, idx) => idx !== i);
    onChange(next);
    if (onCover && removed?.url === cover) onCover(next[0]?.url || '');
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
        {busy ? 'Subiendo…' : 'Clic para subir imágenes o videos (varios a la vez)'}
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={onUpload}
          disabled={busy}
        />
      </label>
      {items.length > 0 && (
        <div className="ad-imgs">
          {items.map((it, i) => (
            <div className="ad-img" key={i}>
              <div
                className="ad-img__thumb"
                onClick={() => !isVideo(it.url) && window.open(it.url, '_blank', 'noopener')}
                title={isVideo(it.url) ? '' : 'Clic para ver la imagen completa'}
              >
                {isVideo(it.url) ? (
                  <video src={it.url} muted playsInline preload="metadata" />
                ) : (
                  <img src={it.url} alt="" />
                )}
                {isVideo(it.url) && (
                  <span className="ad-img__play">
                    <Play size={14} />
                  </span>
                )}
                {onCover && it.url === cover && !isVideo(it.url) && (
                  <span className="ad-img__cover">Portada</span>
                )}
                <div className="ad-img__bar" onClick={(e) => e.stopPropagation()}>
                  {onCover && !isVideo(it.url) && (
                    <button
                      type="button"
                      className="ad-img__btn"
                      onClick={() => onCover(it.url)}
                      title="Usar como portada"
                    >
                      <Star size={14} className={it.url === cover ? 'is-cover' : ''} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="ad-img__btn"
                    onClick={() => move(i, 'up')}
                    title="Subir"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    className="ad-img__btn"
                    onClick={() => move(i, 'down')}
                    title="Bajar"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    className="ad-img__btn"
                    onClick={() => remove(i)}
                    title="Quitar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              {(withFase || withSeccion) && !isVideo(it.url) && (
                <div className="ad-img__meta">
                  {withFase && (
                    <select
                      className="ad-img__fase"
                      value={it.fase || 'finalizado'}
                      onChange={(e) => setFase(i, e.target.value)}
                      title="Etapa de obra"
                    >
                      <option value="antes">Antes</option>
                      <option value="durante">Durante</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  )}
                  {withSeccion && (
                    <input
                      className="ad-img__seccion"
                      type="text"
                      value={it.seccion || ''}
                      onChange={(e) => setSeccion(i, e.target.value)}
                      placeholder="Sección (opcional)"
                      title="Sección / área (ej. Recepción)"
                    />
                  )}
                </div>
              )}
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
  const [slugAbierto, setSlugAbierto] = useState(false);
  const [saving, setSaving] = useState(false);

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
    etapa: proyecto?.etapa ?? (proyecto?.anio ? inferEtapa(proyecto.anio) : 'propio'),
    estado: proyecto?.estado === 'proceso' ? 'proceso' : 'finalizado',
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
  const [ficha, setFichaState] = useState(() => {
    const f = normalizeFicha(proyecto?.ficha);
    return {
      tipologia: f.tipologia,
      superficie_terreno: f.superficie_terreno,
      superficie_construida: f.superficie_construida,
      alcance: f.alcance,
      sistema: f.sistema,
      claves: f.claves.length ? f.claves : [''],
      creditos: f.creditos.length ? f.creditos : [{ rol: '', nombre: '' }],
    };
  });
  const setFicha = (field, value) => setFichaState((f) => ({ ...f, [field]: value }));
  const setClave = (i, val) =>
    setFichaState((f) => ({ ...f, claves: f.claves.map((c, j) => (j === i ? val : c)) }));
  const addClave = () => setFichaState((f) => ({ ...f, claves: [...f.claves, ''] }));
  const delClave = (i) =>
    setFichaState((f) => ({ ...f, claves: f.claves.filter((_, j) => j !== i) }));
  const setCredito = (i, field, val) =>
    setFichaState((f) => ({
      ...f,
      creditos: f.creditos.map((c, j) => (j === i ? { ...c, [field]: val } : c)),
    }));
  const addCredito = () =>
    setFichaState((f) => ({ ...f, creditos: [...f.creditos, { rol: '', nombre: '' }] }));
  const delCredito = (i) =>
    setFichaState((f) => ({ ...f, creditos: f.creditos.filter((_, j) => j !== i) }));

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function onTitulo(value) {
    set('titulo', value);
    if (!slugEdited) set('slug', slugify(value));
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
      ficha: {
        tipologia: ficha.tipologia.trim(),
        superficie_terreno: ficha.superficie_terreno.trim(),
        superficie_construida: ficha.superficie_construida.trim(),
        alcance: ficha.alcance.trim(),
        sistema: ficha.sistema.trim(),
        claves: ficha.claves.map((c) => c.trim()).filter(Boolean),
        creditos: ficha.creditos
          .map((c) => ({ rol: c.rol.trim(), nombre: c.nombre.trim() }))
          .filter((c) => c.rol || c.nombre),
      },
    };
    const url = isEditing ? `/api/proyectos/${proyecto.id}` : '/api/proyectos';
    try {
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || `Error al guardar (${res.status})`);
        return;
      }
      toast.success(isEditing ? 'Proyecto actualizado' : 'Proyecto creado');
      router.push('/admin/proyectos');
      router.refresh();
    } catch {
      toast.error('Error de conexión al guardar');
    } finally {
      setSaving(false);
    }
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
          <label>Dirección de la página</label>
          {!slugAbierto ? (
            <p className="ad-hint" style={{ margin: 0 }}>
              Se arma sola del título:{' '}
              <b>/proyecto/{form.slug || 'titulo-de-la-obra'}</b>{' '}
              <button
                type="button"
                onClick={() => setSlugAbierto(true)}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'var(--admin-accent, #6f7d5d)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  font: 'inherit',
                }}
              >
                editar
              </button>
            </p>
          ) : (
            <>
              <input
                className="ad-input"
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set('slug', slugify(e.target.value));
                }}
                placeholder="casa-del-bosque"
              />
              <p className="ad-hint">La obra vivirá en /proyecto/{form.slug || 'slug'}</p>
            </>
          )}
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
              placeholder="Asunción, PY"
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
            <label>Etapa</label>
            <select
              className="ad-input"
              value={form.etapa}
              onChange={(e) => set('etapa', e.target.value)}
            >
              <option value="propio">Estudio propio (2019 – presente)</option>
              <option value="gustafson">Gustafson y Asociados (2001 – 2019)</option>
            </select>
          </div>
          <div className="ad-field">
            <label>Estado de la obra</label>
            <select
              className="ad-input"
              value={form.estado}
              onChange={(e) => set('estado', e.target.value)}
            >
              <option value="finalizado">Finalizado</option>
              <option value="proceso">En proceso</option>
            </select>
          </div>
        </div>
        <p className="ad-hint">
          La etapa Gustafson agrupa las obras desarrolladas durante esa trayectoria profesional. El
          estado se muestra como indicador sutil en la galería.
        </p>
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

      {/* Ficha técnica */}
      <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="ad-field">
          <label>Ficha técnica (datos rápidos)</label>
          <p className="ad-hint">
            Todo es opcional: solo se muestra en la obra lo que completes. Ideal para dar escala y
            demostrar el alcance real del trabajo.
          </p>
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Tipología</label>
            <input
              className="ad-input"
              value={ficha.tipologia}
              onChange={(e) => setFicha('tipologia', e.target.value)}
              placeholder="Vivienda unifamiliar"
            />
          </div>
          <div className="ad-field">
            <label>Alcance del estudio</label>
            <input
              className="ad-input"
              value={ficha.alcance}
              onChange={(e) => setFicha('alcance', e.target.value)}
              placeholder="Arquitectura · Interiorismo · Dirección"
            />
          </div>
        </div>
        <div className="ad-row-2">
          <div className="ad-field">
            <label>Superficie del terreno</label>
            <input
              className="ad-input"
              value={ficha.superficie_terreno}
              onChange={(e) => setFicha('superficie_terreno', e.target.value)}
              placeholder="800 m²"
            />
          </div>
          <div className="ad-field">
            <label>Superficie construida</label>
            <input
              className="ad-input"
              value={ficha.superficie_construida}
              onChange={(e) => setFicha('superficie_construida', e.target.value)}
              placeholder="420 m²"
            />
          </div>
        </div>
        <div className="ad-field">
          <label>Sistema estructural / constructivo</label>
          <input
            className="ad-input"
            value={ficha.sistema}
            onChange={(e) => setFicha('sistema', e.target.value)}
            placeholder="Hormigón armado · pilotes · estructura metálica"
          />
        </div>

        <div className="ad-field">
          <label>Claves del proyecto (3 a 5 detalles a destacar)</label>
          <p className="ad-hint">
            Decisiones o desafíos que diferencian la obra (implantación, estructura, materialidad,
            logística…). Un ítem por línea.
          </p>
          {ficha.claves.map((c, i) => (
            <div className="ad-pal-row" key={i}>
              <input
                className="ad-input"
                value={c}
                onChange={(e) => setClave(i, e.target.value)}
                placeholder="Ej. Fundaciones profundas: 32 pilotes anclados al terreno."
              />
              <button
                type="button"
                className="ad-img__btn"
                onClick={() => delClave(i)}
                title="Quitar"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="ad-btn ad-btn--ghost" onClick={addClave}>
            <Plus size={14} /> Agregar clave
          </button>
        </div>

        <div className="ad-field">
          <label>Créditos y colaboradores</label>
          <p className="ad-hint">
            Empresas, especialistas y proveedores relevantes. Rol (ej. Cálculo estructural) + nombre.
          </p>
          {ficha.creditos.map((c, i) => (
            <div className="ad-pal-row" key={i}>
              <input
                className="ad-input"
                value={c.rol}
                onChange={(e) => setCredito(i, 'rol', e.target.value)}
                placeholder="Rol (ej. Paisajismo)"
              />
              <input
                className="ad-input"
                value={c.nombre}
                onChange={(e) => setCredito(i, 'nombre', e.target.value)}
                placeholder="Nombre / empresa"
              />
              <button
                type="button"
                className="ad-img__btn"
                onClick={() => delCredito(i)}
                title="Quitar"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button type="button" className="ad-btn ad-btn--ghost" onClick={addCredito}>
            <Plus size={14} /> Agregar crédito
          </button>
        </div>
      </div>

      {/* Galerías */}
      <div className="ad-card">
        <ImageList
          label="Galería"
          hint="Marcá una con ⭐ para la portada. Podés clasificar cada foto por etapa (Antes / Durante / Finalizado) o, si el proyecto tiene áreas, escribir el nombre de la sección (ej. Recepción, Conferencias). Si usás secciones, la obra se agrupa por esas; si no, por etapas."
          items={galeria}
          onChange={setGaleria}
          cover={portada}
          onCover={setPortada}
          withFase
          withSeccion
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
