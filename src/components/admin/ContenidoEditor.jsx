'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2, FileText, ChevronUp, ChevronDown, Film } from 'lucide-react';
import ImageField from './ImageField';
import RichTextField from './RichTextField';
import { uploadDoc } from '../../lib/upload';

// Campo de subida de PDF (se abre en el navegador, no se descarga).
function PdfField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  async function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadDoc(f);
      onChange(url);
      toast.success('PDF subido');
    } catch {
      toast.error('No se pudo subir el PDF');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }
  return (
    <div className="ad-field">
      <label>PDF (opcional) — se abre en el navegador</label>
      {value ? (
        <div className="ad-pdfrow">
          <a href={value} target="_blank" rel="noopener noreferrer">
            <FileText size={14} /> Ver PDF actual
          </a>
          <button type="button" className="ad-btn ad-btn--danger" onClick={() => onChange('')}>
            Quitar
          </button>
        </div>
      ) : (
        <label className="ad-upload">
          <FileText size={18} />
          {busy ? 'Subiendo…' : 'Subir PDF'}
          <input type="file" accept="application/pdf,.pdf" hidden onChange={onFile} disabled={busy} />
        </label>
      )}
    </div>
  );
}

// Campo para subir un video. Se sube tal cual a Storage.
function VideoField({ value, onChange, label = 'Video (mp4, opcional)', hint }) {
  const [busy, setBusy] = useState(false);
  async function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadDoc(f);
      onChange(url);
      toast.success('Video subido');
    } catch {
      toast.error('No se pudo subir el video');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }
  return (
    <div className="ad-field">
      <label>{label}</label>
      {value ? (
        <div className="ad-pdfrow">
          <video src={value} controls style={{ width: 220, maxHeight: 140, borderRadius: 6 }} />
          <button type="button" className="ad-btn ad-btn--danger" onClick={() => onChange('')}>
            Quitar
          </button>
        </div>
      ) : (
        <label className="ad-upload">
          <Film size={18} />
          {busy ? 'Subiendo…' : 'Subir video'}
          <input type="file" accept="video/*" hidden onChange={onFile} disabled={busy} />
        </label>
      )}
      {hint && <p className="ad-hint">{hint}</p>}
    </div>
  );
}

// Editor de lista de {titulo, descripcion} (pilares, pasos, servicios…).
function TituloDescList({ titulo, hint, items, setItems, addLabel = 'Agregar' }) {
  const set = (i, patch) => setItems(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="ad-card">
      <h2 className="ad-card__title">{titulo}</h2>
      {hint && (
        <p className="ad-hint" style={{ marginBottom: 12 }}>
          {hint}
        </p>
      )}
      {items.map((it, i) => (
        <div className="ad-proy" key={i}>
          <input
            className="ad-input"
            value={it.titulo}
            placeholder="Título"
            onChange={(e) => set(i, { titulo: e.target.value })}
          />
          <input
            className="ad-input"
            value={it.descripcion}
            placeholder="Descripción"
            onChange={(e) => set(i, { descripcion: e.target.value })}
          />
          <button
            type="button"
            className="ad-btn ad-btn--danger"
            onClick={() => setItems(items.filter((_, idx) => idx !== i))}
            title="Quitar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="ad-btn ad-btn--ghost"
        onClick={() => setItems([...items, { titulo: '', descripcion: '' }])}
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  );
}

const TEXT_KEYS = [
  // Inicio
  'inicio_hero_imagen',
  'inicio_hero_eyebrow',
  'inicio_hero_titulo',
  'inicio_hero_descripcion',
  'inicio_manifiesto',
  'inicio_hero_video',
  'inicio_cta_imagen',
  'inicio_cta_titulo',
  'inicio_cta_descripcion',
  // Sobre mí
  'nosotros_hero_titulo',
  'nosotros_hero_lead',
  'nosotros_intro_imagen',
  'nosotros_intro_titulo',
  'nosotros_intro_lead',
  'nosotros_intro_texto',
  'nosotros_historia',
  'nosotros_cita',
  'nosotros_transicion',
  'nosotros_estudio_titulo',
  'nosotros_estudio_texto',
  'nosotros_retrato_imagen',
  'nosotros_cta_imagen',
  // Sobre mí — rediseño 2026
  'nosotros_hero_nombre',
  'nosotros_hero_subtitulo',
  'nosotros_hero_bajada',
  'nosotros_hero_stat_n',
  'nosotros_hero_stat_l',
  'nosotros_cita_apertura',
  'nosotros_exp_periodo',
  'nosotros_exp_titulo',
  'nosotros_exp_texto',
  'nosotros_exp_nota',
  'nosotros_cierre_frase',
  'nosotros_cierre_invit',
  // Proyectos
  'proyectos_hero_imagen',
  'proyectos_hero_titulo',
  'proyectos_hero_lead',
  // Servicios
  'servicios_hero_imagen',
  'servicios_hero_titulo',
  'servicios_hero_lead',
];

const EM_HINT =
  'Seleccioná una palabra y usá los botones de arriba para Resaltar, Negrita o cambiar el tamaño.';
const LINE_HINT = 'Cada salto de línea es una línea del título. ' + EM_HINT;

export default function ContenidoEditor({ inicial = {}, proyectos = [] }) {
  const router = useRouter();
  const [tab, setTab] = useState('inicio');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => {
    const f = {};
    for (const k of TEXT_KEYS) f[k] = inicial[k] ?? '';
    return f;
  });
  const [trayectoria, setTrayectoria] = useState(() =>
    Array.isArray(inicial.trayectoria) ? inicial.trayectoria : []
  );
  const [stats, setStats] = useState(() => (Array.isArray(inicial.stats) ? inicial.stats : []));
  const [showcase, setShowcase] = useState(() =>
    Array.isArray(inicial.showcase) ? inicial.showcase : []
  );
  const [pilares, setPilares] = useState(() =>
    Array.isArray(inicial.pilares) ? inicial.pilares : []
  );
  const [collage, setCollage] = useState(() =>
    (Array.isArray(inicial.carrusel) ? inicial.carrusel : []).map((x) => ({
      imagen: x.imagen || x.src || x.url || '',
      alt: x.alt || '',
    }))
  );
  const [prensa, setPrensa] = useState(() => (Array.isArray(inicial.prensa) ? inicial.prensa : []));
  const [etapas, setEtapas] = useState(() => (Array.isArray(inicial.etapas) ? inicial.etapas : []));
  const [serviciosPasos, setServiciosPasos] = useState(() =>
    Array.isArray(inicial.servicios_pasos) ? inicial.servicios_pasos : []
  );
  // Sobre mí — rediseño 2026
  const [timeline, setTimeline] = useState(() =>
    Array.isArray(inicial.timeline) ? inicial.timeline : []
  );
  const [expImgs, setExpImgs] = useState(() =>
    Array.isArray(inicial.exp_imagenes) ? inicial.exp_imagenes : []
  );
  const [relatos, setRelatos] = useState(() =>
    Array.isArray(inicial.relatos) ? inicial.relatos : []
  );
  const [smServ, setSmServ] = useState(() =>
    Array.isArray(inicial.sm_servicios) ? inicial.sm_servicios : []
  );

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  // helpers línea de tiempo
  const setTl = (i, patch) => setTimeline((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addTl = () => setTimeline((s) => [...s, { yr: '', label: '' }]);
  const delTl = (i) => setTimeline((s) => s.filter((_, idx) => idx !== i));
  // helpers imágenes de experiencia
  const setExpImg = (i, patch) => setExpImgs((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addExpImg = () => setExpImgs((s) => [...s, { imagen: '', alt: '', sub: '' }]);
  const delExpImg = (i) => setExpImgs((s) => s.filter((_, idx) => idx !== i));
  // helpers relatos
  const setRel = (i, patch) => setRelatos((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addRel = () =>
    setRelatos((s) => [...s, { n: String(s.length + 1).padStart(2, '0'), titulo: '', texto: '', imagen: '', slug: '' }]);
  const delRel = (i) => setRelatos((s) => s.filter((_, idx) => idx !== i));
  // helpers servicios (íconos)
  const setSv = (i, val) => setSmServ((s) => s.map((x, idx) => (idx === i ? val : x)));
  const addSv = () => setSmServ((s) => [...s, '']);
  const delSv = (i) => setSmServ((s) => s.filter((_, idx) => idx !== i));

  // helpers collage / prensa / etapas
  const setColl = (i, patch) =>
    setCollage((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const moveColl = (i, dir) =>
    setCollage((s) => {
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= s.length) return s;
      const n = [...s];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const setPr = (i, patch) => setPrensa((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  // imágenes múltiples por publicación (galería que se ve al desplegar)
  const prImgs = (p) => (Array.isArray(p.imagenes) ? p.imagenes : []);
  const addPrImg = (i) =>
    setPrensa((s) => s.map((x, idx) => (idx === i ? { ...x, imagenes: [...prImgs(x), { url: '' }] } : x)));
  const setPrImg = (i, k, v) =>
    setPrensa((s) =>
      s.map((x, idx) =>
        idx === i ? { ...x, imagenes: prImgs(x).map((im, kk) => (kk === k ? { url: v } : im)) } : x
      )
    );
  const delPrImg = (i, k) =>
    setPrensa((s) =>
      s.map((x, idx) => (idx === i ? { ...x, imagenes: prImgs(x).filter((_, kk) => kk !== k) } : x))
    );
  // enlaces múltiples por publicación (nota, redes, etc.)
  const prLinks = (p) => (Array.isArray(p.enlaces) ? p.enlaces : []);
  const addPrLink = (i) =>
    setPrensa((s) => s.map((x, idx) => (idx === i ? { ...x, enlaces: [...prLinks(x), { label: '', url: '' }] } : x)));
  const setPrLink = (i, k, patch) =>
    setPrensa((s) =>
      s.map((x, idx) =>
        idx === i ? { ...x, enlaces: prLinks(x).map((e, kk) => (kk === k ? { ...e, ...patch } : e)) } : x
      )
    );
  const delPrLink = (i, k) =>
    setPrensa((s) =>
      s.map((x, idx) => (idx === i ? { ...x, enlaces: prLinks(x).filter((_, kk) => kk !== k) } : x))
    );
  const setEt = (i, patch) => setEtapas((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  // --- helpers trayectoria ---
  const setEtapa = (i, patch) =>
    setTrayectoria((t) => t.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addEtapa = () =>
    setTrayectoria((t) => [...t, { yr: '', titulo: '', descripcion: '', imagenes: [], pilares: [] }]);
  const delEtapa = (i) => setTrayectoria((t) => t.filter((_, idx) => idx !== i));
  // imágenes por etapa
  const etImgs = (et) => (Array.isArray(et.imagenes) ? et.imagenes : []);
  const addEtImg = (ei) =>
    setEtapa(ei, { imagenes: [...etImgs(trayectoria[ei]), { imagen: '', alt: '' }] });
  const setEtImg = (ei, k, patch) =>
    setEtapa(ei, {
      imagenes: etImgs(trayectoria[ei]).map((im, kk) => (kk === k ? { ...im, ...patch } : im)),
    });
  const delEtImg = (ei, k) =>
    setEtapa(ei, { imagenes: etImgs(trayectoria[ei]).filter((_, kk) => kk !== k) });

  // --- helpers cifras (stats) ---
  const setStat = (i, patch) => setStats((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addStat = () => setStats((s) => [...s, { n: '', l: '' }]);
  const delStat = (i) => setStats((s) => s.filter((_, idx) => idx !== i));

  // --- helpers showcase (proyectos del inicio) ---
  const setShow = (i, patch) =>
    setShowcase((s) => s.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const addShow = () =>
    setShowcase((s) => [...s, { imagen: '', titulo: '', categoria: '', slug: '' }]);
  const delShow = (i) => setShowcase((s) => s.filter((_, idx) => idx !== i));

  async function save() {
    setSaving(true);
    try {
      const entries = {
        ...form,
        nosotros_trayectoria: JSON.stringify(trayectoria),
        inicio_stats: JSON.stringify(stats),
        inicio_showcase: JSON.stringify(showcase),
        nosotros_pilares: JSON.stringify(pilares),
        nosotros_carrusel: JSON.stringify(collage.filter((x) => x.imagen)),
        nosotros_prensa: JSON.stringify(prensa),
        proyectos_etapas: JSON.stringify(etapas),
        servicios_pasos: JSON.stringify(serviciosPasos),
        nosotros_timeline: JSON.stringify(timeline),
        nosotros_relatos: JSON.stringify(relatos),
        nosotros_servicios: JSON.stringify(smServ.map((x) => x.trim()).filter(Boolean)),
        nosotros_exp_imagenes: JSON.stringify(expImgs.filter((x) => x.imagen)),
      };
      const res = await fetch('/api/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || 'Error al guardar');
        return;
      }
      toast.success('Contenido guardado');
      router.refresh();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  const TABS = [
    ['inicio', 'Inicio'],
    ['nosotros', 'Sobre mí'],
    ['proyectos', 'Proyectos'],
    ['servicios', 'Servicios'],
  ];

  return (
    <div className="ad-form">
      <div className="ad-tabs">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            className={'ad-tab' + (tab === key ? ' on' : '')}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ===================== INICIO ===================== */}
      {tab === 'inicio' && (
        <>
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ImageField
              label="Foto del inicio (hero)"
              value={form.inicio_hero_imagen}
              onChange={(v) => set('inicio_hero_imagen', v)}
            />
            <VideoField
              label="Video del hero (opcional — reemplaza la foto)"
              hint="Si subís un video, el inicio se muestra como fondo de video (silenciado, en loop). La foto de arriba queda como portada mientras carga. Ideal un mp4 liviano y horizontal."
              value={form.inicio_hero_video}
              onChange={(v) => set('inicio_hero_video', v)}
            />
            <div className="ad-field">
              <label>Bajada del hero (eyebrow)</label>
              <input
                className="ad-input"
                value={form.inicio_hero_eyebrow}
                onChange={(e) => set('inicio_hero_eyebrow', e.target.value)}
              />
            </div>
            <RichTextField
              label="Título del hero"
              rows={2}
              value={form.inicio_hero_titulo}
              onChange={(v) => set('inicio_hero_titulo', v)}
              hint={LINE_HINT}
            />
            <RichTextField
              label="Descripción del hero"
              rows={3}
              value={form.inicio_hero_descripcion}
              onChange={(v) => set('inicio_hero_descripcion', v)}
              hint={EM_HINT}
            />
            <RichTextField
              label="Frase / manifiesto"
              rows={3}
              value={form.inicio_manifiesto}
              onChange={(v) => set('inicio_manifiesto', v)}
              hint={EM_HINT}
            />
          </div>

          {/* Showcase de proyectos del inicio */}
          <div className="ad-card">
            <h2 className="ad-card__title">Proyectos del inicio</h2>
            <p className="ad-hint" style={{ marginBottom: 14 }}>
              Los bloques a pantalla completa del inicio. Elegí la foto, el texto y a qué proyecto
              enlaza cada uno.
            </p>
            {showcase.map((s, i) => (
              <div className="ad-etapa" key={i}>
                <div className="ad-field">
                  <label>Proyecto</label>
                  <select
                    className="ad-input"
                    value={s.slug || ''}
                    onChange={(e) => {
                      const p = proyectos.find((x) => x.slug === e.target.value);
                      setShow(
                        i,
                        p
                          ? {
                              slug: p.slug,
                              titulo: p.name,
                              categoria: p.catLabel,
                              imagen: s.imagen || p.cover,
                            }
                          : { slug: '' }
                      );
                    }}
                  >
                    <option value="">— Elegí un proyecto de la lista —</option>
                    {proyectos.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="ad-hint">
                    Se completan solos el título, la categoría y la foto. Podés ajustarlos abajo si
                    querés.
                  </p>
                </div>
                <ImageField
                  label={`Foto del bloque ${i + 1}`}
                  value={s.imagen}
                  onChange={(v) => setShow(i, { imagen: v })}
                />
                <div className="ad-row-2">
                  <div className="ad-field">
                    <label>Título</label>
                    <input
                      className="ad-input"
                      value={s.titulo}
                      onChange={(e) => setShow(i, { titulo: e.target.value })}
                    />
                  </div>
                  <div className="ad-field">
                    <label>Categoría</label>
                    <input
                      className="ad-input"
                      value={s.categoria}
                      placeholder="Arquitectura · Barrio cerrado"
                      onChange={(e) => setShow(i, { categoria: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-etapa__actions">
                  <button
                    type="button"
                    className="ad-btn ad-btn--danger"
                    onClick={() => delShow(i)}
                  >
                    <Trash2 size={14} /> Eliminar bloque
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addShow}>
              <Plus size={15} /> Agregar bloque
            </button>
          </div>

          {/* Cierre / CTA */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Cierre (llamado a la acción)</h2>
            <ImageField
              label="Foto del cierre (CTA)"
              value={form.inicio_cta_imagen}
              onChange={(v) => set('inicio_cta_imagen', v)}
            />
            <RichTextField
              label="Título del cierre"
              value={form.inicio_cta_titulo}
              onChange={(v) => set('inicio_cta_titulo', v)}
              hint={EM_HINT}
            />
            <RichTextField
              label="Texto del cierre"
              rows={3}
              value={form.inicio_cta_descripcion}
              onChange={(v) => set('inicio_cta_descripcion', v)}
              hint={EM_HINT}
            />
          </div>
        </>
      )}

      {/* ===================== SOBRE MÍ ===================== */}
      {tab === 'nosotros' && (
        <>
          {/* Hero de Sobre mí */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Encabezado (hero)</h2>
            <ImageField
              label="Foto de Lorena"
              value={form.nosotros_retrato_imagen}
              onChange={(v) => set('nosotros_retrato_imagen', v)}
            />
            <div className="ad-row-2">
              <div className="ad-field">
                <label>Nombre</label>
                <input
                  className="ad-input"
                  value={form.nosotros_hero_nombre}
                  onChange={(e) => set('nosotros_hero_nombre', e.target.value)}
                />
              </div>
              <div className="ad-field">
                <label>Subtítulo</label>
                <input
                  className="ad-input"
                  value={form.nosotros_hero_subtitulo}
                  onChange={(e) => set('nosotros_hero_subtitulo', e.target.value)}
                />
              </div>
            </div>
            <div className="ad-field">
              <label>Bajada (párrafo de presentación)</label>
              <textarea
                className="ad-textarea"
                rows={3}
                value={form.nosotros_hero_bajada}
                onChange={(e) => set('nosotros_hero_bajada', e.target.value)}
              />
            </div>
            <div className="ad-row-2">
              <div className="ad-field">
                <label>Dato · número</label>
                <input
                  className="ad-input"
                  value={form.nosotros_hero_stat_n}
                  placeholder="+25"
                  onChange={(e) => set('nosotros_hero_stat_n', e.target.value)}
                />
              </div>
              <div className="ad-field">
                <label>Dato · etiqueta</label>
                <input
                  className="ad-input"
                  value={form.nosotros_hero_stat_l}
                  placeholder="Años de trayectoria"
                  onChange={(e) => set('nosotros_hero_stat_l', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Cita + línea de tiempo */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Cita + línea de tiempo</h2>
            <div className="ad-field">
              <label>Cita de apertura</label>
              <textarea
                className="ad-textarea"
                rows={2}
                value={form.nosotros_cita_apertura}
                onChange={(e) => set('nosotros_cita_apertura', e.target.value)}
              />
            </div>
            <p className="ad-hint" style={{ margin: 0 }}>
              Línea de tiempo (año + descripción corta):
            </p>
            {timeline.map((h, i) => (
              <div className="ad-proy" key={i}>
                <input
                  className="ad-input"
                  style={{ flex: '0 0 22%' }}
                  value={h.yr}
                  placeholder="2001"
                  onChange={(e) => setTl(i, { yr: e.target.value })}
                />
                <input
                  className="ad-input"
                  value={h.label}
                  placeholder="Inicio de mi trayectoria profesional"
                  onChange={(e) => setTl(i, { label: e.target.value })}
                />
                <button type="button" className="ad-btn ad-btn--danger" onClick={() => delTl(i)} title="Quitar">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addTl}>
              <Plus size={14} /> Agregar hito
            </button>
          </div>

          {/* Experiencia 2001–2019 */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Experiencia profesional (2001–2019)</h2>
            <div className="ad-row-2">
              <div className="ad-field">
                <label>Período</label>
                <input
                  className="ad-input"
                  value={form.nosotros_exp_periodo}
                  placeholder="2001 — 2019"
                  onChange={(e) => set('nosotros_exp_periodo', e.target.value)}
                />
              </div>
              <div className="ad-field">
                <label>Título</label>
                <input
                  className="ad-input"
                  value={form.nosotros_exp_titulo}
                  onChange={(e) => set('nosotros_exp_titulo', e.target.value)}
                />
              </div>
            </div>
            <div className="ad-field">
              <label>Texto (cada línea en blanco = un párrafo)</label>
              <textarea
                className="ad-textarea"
                rows={6}
                value={form.nosotros_exp_texto}
                onChange={(e) => set('nosotros_exp_texto', e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Nota al pie (opcional)</label>
              <input
                className="ad-input"
                value={form.nosotros_exp_nota}
                onChange={(e) => set('nosotros_exp_nota', e.target.value)}
              />
            </div>
            <p className="ad-hint" style={{ margin: 0 }}>
              Fotos de esta etapa (con nombre y detalle):
            </p>
            {expImgs.map((im, i) => (
              <div className="ad-etapa-img" key={i} style={{ marginBottom: 10 }}>
                <ImageField
                  label={`Foto ${i + 1}`}
                  value={im.imagen || ''}
                  onChange={(v) => setExpImg(i, { imagen: v })}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="ad-input"
                    value={im.alt || ''}
                    placeholder="Nombre (ej. Torres residenciales)"
                    onChange={(e) => setExpImg(i, { alt: e.target.value })}
                  />
                  <input
                    className="ad-input"
                    value={im.sub || ''}
                    placeholder="Detalle (ej. 12 a 30 niveles)"
                    onChange={(e) => setExpImg(i, { sub: e.target.value })}
                  />
                  <button type="button" className="ad-btn ad-btn--danger" onClick={() => delExpImg(i)} title="Quitar">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addExpImg}>
              <Plus size={14} /> Agregar foto
            </button>
          </div>

          {/* Estudio 2019–Hoy · relatos */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Estudio Lorena Macías (2019–Hoy) · relatos</h2>
            <p className="ad-hint" style={{ margin: 0 }}>
              Cada relato: número, título, texto, una foto y (opcional) el slug de la obra para el
              botón “Ver proyecto”.
            </p>
            {relatos.map((r, i) => (
              <div className="ad-etapa" key={i}>
                <div className="ad-row-2">
                  <div className="ad-field">
                    <label>Número</label>
                    <input
                      className="ad-input"
                      value={r.n || ''}
                      placeholder="01"
                      onChange={(e) => setRel(i, { n: e.target.value })}
                    />
                  </div>
                  <div className="ad-field">
                    <label>Título</label>
                    <input
                      className="ad-input"
                      value={r.titulo || ''}
                      onChange={(e) => setRel(i, { titulo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-field">
                  <label>Texto</label>
                  <textarea
                    className="ad-textarea"
                    rows={5}
                    value={r.texto || ''}
                    onChange={(e) => setRel(i, { texto: e.target.value })}
                  />
                </div>
                <ImageField
                  label="Foto del relato"
                  value={r.imagen || ''}
                  onChange={(v) => setRel(i, { imagen: v })}
                />
                <div className="ad-field">
                  <label>Slug de la obra (para “Ver proyecto”)</label>
                  <input
                    className="ad-input"
                    value={r.slug || ''}
                    placeholder="barrio-pirarenda-amenities"
                    onChange={(e) => setRel(i, { slug: e.target.value })}
                  />
                </div>
                <div className="ad-etapa__actions">
                  <button type="button" className="ad-btn ad-btn--danger" onClick={() => delRel(i)}>
                    <Trash2 size={14} /> Eliminar relato
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addRel}>
              <Plus size={15} /> Agregar relato
            </button>
          </div>

          {/* Servicios (fila de íconos) */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 className="ad-card__title">Servicios (fila de íconos)</h2>
            <p className="ad-hint" style={{ margin: 0 }}>
              Nombres exactos: Arquitectura, Interiorismo, Dirección de Obras, Obras y Reformas,
              Paisajismo, Diseño Náutico, Project Management (así toman su ícono).
            </p>
            {smServ.map((s, i) => (
              <div className="ad-proy" key={i}>
                <input
                  className="ad-input"
                  value={s}
                  onChange={(e) => setSv(i, e.target.value)}
                />
                <button type="button" className="ad-btn ad-btn--danger" onClick={() => delSv(i)} title="Quitar">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addSv}>
              <Plus size={14} /> Agregar servicio
            </button>
          </div>

          {/* Cierre + CTA */}
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Cierre</h2>
            <div className="ad-field">
              <label>Frase de cierre</label>
              <textarea
                className="ad-textarea"
                rows={3}
                value={form.nosotros_cierre_frase}
                onChange={(e) => set('nosotros_cierre_frase', e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Invitación (antes del botón)</label>
              <textarea
                className="ad-textarea"
                rows={2}
                value={form.nosotros_cierre_invit}
                onChange={(e) => set('nosotros_cierre_invit', e.target.value)}
              />
            </div>
            <ImageField
              label="Foto del cierre (CTA “¿Empezamos tu proyecto?”)"
              value={form.nosotros_cta_imagen}
              onChange={(v) => set('nosotros_cta_imagen', v)}
            />
          </div>

          {/* Prensa */}
          <div className="ad-card">
            <h2 className="ad-card__title">Prensa</h2>
            <p className="ad-hint" style={{ marginBottom: 12 }}>
              Publicaciones y apariciones. En el sitio se ven como una lista limpia; al hacer click,
              cada una se despliega y muestra el PDF, el enlace y las imágenes que cargues.
            </p>
            {prensa.map((p, i) => (
              <div className="ad-etapa" key={i}>
                <div className="ad-row-2">
                  <div className="ad-field">
                    <label>Medio</label>
                    <input
                      className="ad-input"
                      value={p.medio || ''}
                      placeholder="Revista / Sitio / Canal"
                      onChange={(e) => setPr(i, { medio: e.target.value })}
                    />
                  </div>
                  <div className="ad-field">
                    <label>Detalle (opcional)</label>
                    <input
                      className="ad-input"
                      value={p.fecha || ''}
                      placeholder="Brasil · 2026 / ediciones #4 y #23"
                      onChange={(e) => setPr(i, { fecha: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-field">
                  <label>Título</label>
                  <input
                    className="ad-input"
                    value={p.titulo || ''}
                    onChange={(e) => setPr(i, { titulo: e.target.value })}
                  />
                </div>
                <div className="ad-field">
                  <label>Descripción</label>
                  <textarea
                    className="ad-textarea"
                    value={p.descripcion || ''}
                    onChange={(e) => setPr(i, { descripcion: e.target.value })}
                  />
                </div>
                <div className="ad-field">
                  <label>Enlaces (nota, Instagram, reel, etc.)</label>
                  <p className="ad-hint" style={{ marginTop: -4, marginBottom: 8 }}>
                    {
                      'Poné todos los enlaces de esta misma nota. El nombre es cómo se ve el botón (ej. "Ver nota", "Instagram", "Reel").'
                    }
                  </p>
                  {prLinks(p).map((e, k) => (
                    <div className="ad-row-2" key={k} style={{ alignItems: 'end', marginBottom: 8 }}>
                      <input
                        className="ad-input"
                        value={e.label || ''}
                        placeholder="Nombre del botón (ej. Ver nota)"
                        onChange={(ev) => setPrLink(i, k, { label: ev.target.value })}
                      />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          className="ad-input"
                          value={e.url || ''}
                          placeholder="https://…"
                          onChange={(ev) => setPrLink(i, k, { url: ev.target.value })}
                        />
                        <button
                          type="button"
                          className="ad-btn ad-btn--danger"
                          onClick={() => delPrLink(i, k)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" className="ad-btn ad-btn--ghost" onClick={() => addPrLink(i)}>
                    <Plus size={14} /> Agregar enlace
                  </button>
                </div>
                <PdfField value={p.pdf} onChange={(v) => setPr(i, { pdf: v })} />
                <div className="ad-field">
                  <label>Imágenes (portada de revista, fotos)</label>
                  <p className="ad-hint" style={{ marginTop: -4, marginBottom: 8 }}>
                    En el sitio la publicación se ve limpia; estas imágenes aparecen al hacer click
                    para desplegarla.
                  </p>
                  {prImgs(p).map((im, k) => (
                    <div className="ad-prensa-img" key={k}>
                      <ImageField
                        label={`Imagen ${k + 1}`}
                        value={im.url || ''}
                        onChange={(v) => setPrImg(i, k, v)}
                      />
                      <button
                        type="button"
                        className="ad-btn ad-btn--danger"
                        onClick={() => delPrImg(i, k)}
                      >
                        <Trash2 size={14} /> Quitar
                      </button>
                    </div>
                  ))}
                  <button type="button" className="ad-btn ad-btn--ghost" onClick={() => addPrImg(i)}>
                    <Plus size={14} /> Agregar imagen
                  </button>
                </div>
                <div className="ad-etapa__actions">
                  <button
                    type="button"
                    className="ad-btn ad-btn--danger"
                    onClick={() => setPrensa(prensa.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 size={14} /> Eliminar publicación
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="ad-btn ad-btn--ghost"
              onClick={() =>
                setPrensa([
                  ...prensa,
                  { medio: '', titulo: '', descripcion: '', fecha: '', url: '', pdf: '', imagenes: [] },
                ])
              }
            >
              <Plus size={15} /> Agregar publicación
            </button>
          </div>

        </>
      )}

      {/* ===================== PROYECTOS ===================== */}
      {tab === 'proyectos' && (
        <>
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Encabezado de Proyectos</h2>
            <ImageField
              label="Foto del hero"
              value={form.proyectos_hero_imagen}
              onChange={(v) => set('proyectos_hero_imagen', v)}
            />
            <RichTextField
              label="Título del hero"
              rows={2}
              value={form.proyectos_hero_titulo}
              onChange={(v) => set('proyectos_hero_titulo', v)}
              hint={LINE_HINT}
            />
            <RichTextField
              label="Bajada del hero"
              rows={3}
              value={form.proyectos_hero_lead}
              onChange={(v) => set('proyectos_hero_lead', v)}
              hint={EM_HINT}
            />
          </div>

          <div className="ad-card">
            <h2 className="ad-card__title">Etapas (selector)</h2>
            <p className="ad-hint" style={{ marginBottom: 12 }}>
              Los textos de las dos etapas. El <b>identificador</b> conecta cada proyecto con su
              etapa: no lo cambies salvo que sepas lo que hacés.
            </p>
            {etapas.map((et, i) => (
              <div className="ad-etapa" key={i}>
                <div className="ad-row-2">
                  <div className="ad-field">
                    <label>Nombre</label>
                    <input
                      className="ad-input"
                      value={et.label}
                      onChange={(e) => setEt(i, { label: e.target.value })}
                    />
                  </div>
                  <div className="ad-field">
                    <label>Período</label>
                    <input
                      className="ad-input"
                      value={et.period}
                      onChange={(e) => setEt(i, { period: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-field">
                  <label>Descripción</label>
                  <textarea
                    className="ad-textarea"
                    value={et.blurb}
                    onChange={(e) => setEt(i, { blurb: e.target.value })}
                  />
                </div>
                <div className="ad-field">
                  <label>Nota (opcional, ej. colaboración)</label>
                  <input
                    className="ad-input"
                    value={et.note || ''}
                    onChange={(e) => setEt(i, { note: e.target.value })}
                  />
                </div>
                <div className="ad-field">
                  <label>Identificador</label>
                  <input
                    className="ad-input"
                    value={et.key}
                    onChange={(e) => setEt(i, { key: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===================== SERVICIOS ===================== */}
      {tab === 'servicios' && (
        <>
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="ad-card__title">Encabezado de Servicios</h2>
            <p className="ad-hint">
              El detalle de cada servicio se edita en la sección <b>Servicios</b> del panel.
            </p>
            <ImageField
              label="Foto del hero"
              value={form.servicios_hero_imagen}
              onChange={(v) => set('servicios_hero_imagen', v)}
            />
            <RichTextField
              label="Título del hero"
              rows={2}
              value={form.servicios_hero_titulo}
              onChange={(v) => set('servicios_hero_titulo', v)}
              hint={LINE_HINT}
            />
            <RichTextField
              label="Bajada del hero"
              rows={3}
              value={form.servicios_hero_lead}
              onChange={(v) => set('servicios_hero_lead', v)}
              hint={EM_HINT}
            />
          </div>

          <TituloDescList
            titulo="El proceso (pasos)"
            items={serviciosPasos}
            setItems={setServiciosPasos}
            addLabel="Agregar paso"
          />
        </>
      )}

      <div className="ad-actions">
        <button className="ad-btn" type="button" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar contenido'}
        </button>
      </div>
    </div>
  );
}
