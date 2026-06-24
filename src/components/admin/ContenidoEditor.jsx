'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';
import ImageField from './ImageField';

const TEXT_KEYS = [
  // Inicio
  'inicio_hero_imagen',
  'inicio_hero_eyebrow',
  'inicio_hero_titulo',
  'inicio_hero_descripcion',
  'inicio_manifiesto',
  'inicio_cta_imagen',
  'inicio_cta_titulo',
  'inicio_cta_descripcion',
  // Sobre mí
  'nosotros_hero_titulo',
  'nosotros_hero_lead',
  'nosotros_historia',
  'nosotros_cita',
  'nosotros_retrato_imagen',
  'nosotros_proceso_imagen',
  'nosotros_cta_imagen',
  // Proyectos
  'proyectos_hero_imagen',
  'proyectos_hero_titulo',
  'proyectos_hero_lead',
  // Servicios
  'servicios_hero_imagen',
  'servicios_hero_titulo',
  'servicios_hero_lead',
];

const EM_HINT = 'Podés usar <em>palabra</em> para resaltar en itálica.';
const LINE_HINT = 'Cada salto de línea es una línea del título. ' + EM_HINT;

export default function ContenidoEditor({ inicial = {} }) {
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

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // --- helpers trayectoria ---
  const setEtapa = (i, patch) =>
    setTrayectoria((t) => t.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addEtapa = () =>
    setTrayectoria((t) => [...t, { yr: '', titulo: '', descripcion: '', proyectos: [] }]);
  const delEtapa = (i) => setTrayectoria((t) => t.filter((_, idx) => idx !== i));
  const setProy = (ei, pi, patch) =>
    setEtapa(ei, {
      proyectos: trayectoria[ei].proyectos.map((p, idx) => (idx === pi ? { ...p, ...patch } : p)),
    });
  const addProy = (ei) =>
    setEtapa(ei, {
      proyectos: [...(trayectoria[ei].proyectos || []), { titulo: '', descripcion: '' }],
    });
  const delProy = (ei, pi) =>
    setEtapa(ei, { proyectos: trayectoria[ei].proyectos.filter((_, idx) => idx !== pi) });

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
            <div className="ad-field">
              <label>Bajada del hero (eyebrow)</label>
              <input
                className="ad-input"
                value={form.inicio_hero_eyebrow}
                onChange={(e) => set('inicio_hero_eyebrow', e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Título del hero</label>
              <textarea
                className="ad-textarea"
                rows={2}
                value={form.inicio_hero_titulo}
                onChange={(e) => set('inicio_hero_titulo', e.target.value)}
              />
              <p className="ad-hint">{LINE_HINT}</p>
            </div>
            <div className="ad-field">
              <label>Descripción del hero</label>
              <textarea
                className="ad-textarea"
                value={form.inicio_hero_descripcion}
                onChange={(e) => set('inicio_hero_descripcion', e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Frase / manifiesto</label>
              <textarea
                className="ad-textarea"
                value={form.inicio_manifiesto}
                onChange={(e) => set('inicio_manifiesto', e.target.value)}
              />
              <p className="ad-hint">{EM_HINT}</p>
            </div>
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
                <div className="ad-field">
                  <label>Enlace al proyecto (slug)</label>
                  <input
                    className="ad-input"
                    value={s.slug}
                    placeholder="barrio-pirarenda-viviendas"
                    onChange={(e) => setShow(i, { slug: e.target.value })}
                  />
                  <p className="ad-hint">
                    El slug que aparece en la URL del proyecto (/proyecto/<b>slug</b>). Si lo dejás
                    vacío, enlaza a la lista de proyectos.
                  </p>
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

          {/* Cifras */}
          <div className="ad-card">
            <h2 className="ad-card__title">Cifras</h2>
            <p className="ad-hint" style={{ marginBottom: 14 }}>
              Los números destacados del inicio (ej. +200 · proyectos realizados).
            </p>
            {stats.map((s, i) => (
              <div className="ad-proy" key={i}>
                <input
                  className="ad-input"
                  value={s.n}
                  placeholder="+200"
                  onChange={(e) => setStat(i, { n: e.target.value })}
                />
                <input
                  className="ad-input"
                  value={s.l}
                  placeholder="proyectos realizados"
                  onChange={(e) => setStat(i, { l: e.target.value })}
                />
                <button
                  type="button"
                  className="ad-btn ad-btn--danger"
                  onClick={() => delStat(i)}
                  title="Quitar"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addStat}>
              <Plus size={14} /> Agregar cifra
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
            <div className="ad-field">
              <label>Título del cierre</label>
              <input
                className="ad-input"
                value={form.inicio_cta_titulo}
                onChange={(e) => set('inicio_cta_titulo', e.target.value)}
              />
              <p className="ad-hint">{EM_HINT}</p>
            </div>
            <div className="ad-field">
              <label>Texto del cierre</label>
              <textarea
                className="ad-textarea"
                value={form.inicio_cta_descripcion}
                onChange={(e) => set('inicio_cta_descripcion', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* ===================== SOBRE MÍ ===================== */}
      {tab === 'nosotros' && (
        <>
          <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ad-field">
              <label>Título del hero</label>
              <input
                className="ad-input"
                value={form.nosotros_hero_titulo}
                onChange={(e) => set('nosotros_hero_titulo', e.target.value)}
              />
              <p className="ad-hint">
                Usá &lt;br /&gt; para cortar la línea y {EM_HINT.toLowerCase()}
              </p>
            </div>
            <div className="ad-field">
              <label>Texto del hero</label>
              <textarea
                className="ad-textarea"
                value={form.nosotros_hero_lead}
                onChange={(e) => set('nosotros_hero_lead', e.target.value)}
              />
            </div>
            <div className="ad-field">
              <label>Mi historia</label>
              <textarea
                className="ad-textarea"
                rows={8}
                value={form.nosotros_historia}
                onChange={(e) => set('nosotros_historia', e.target.value)}
              />
              <p className="ad-hint">
                Cada línea en blanco separa un párrafo. El primero se resalta.
              </p>
            </div>
            <ImageField
              label="Retrato de Lorena"
              value={form.nosotros_retrato_imagen}
              onChange={(v) => set('nosotros_retrato_imagen', v)}
            />
            <ImageField
              label="Imagen intermedia (proceso)"
              value={form.nosotros_proceso_imagen}
              onChange={(v) => set('nosotros_proceso_imagen', v)}
            />
            <ImageField
              label="Foto del cierre (CTA)"
              value={form.nosotros_cta_imagen}
              onChange={(v) => set('nosotros_cta_imagen', v)}
            />
            <div className="ad-field">
              <label>Frase destacada (cita)</label>
              <textarea
                className="ad-textarea"
                value={form.nosotros_cita}
                onChange={(e) => set('nosotros_cita', e.target.value)}
              />
            </div>
          </div>

          {/* Línea de tiempo */}
          <div className="ad-card">
            <h2 className="ad-card__title">Línea de tiempo (Trayectoria)</h2>
            <p className="ad-hint" style={{ marginBottom: 14 }}>
              Cada etapa se despliega en el sitio mostrando sus proyectos.
            </p>
            {trayectoria.map((et, ei) => (
              <div className="ad-etapa" key={ei}>
                <div className="ad-row-2">
                  <div className="ad-field">
                    <label>Período</label>
                    <input
                      className="ad-input"
                      value={et.yr}
                      placeholder="2001–2019"
                      onChange={(e) => setEtapa(ei, { yr: e.target.value })}
                    />
                  </div>
                  <div className="ad-field">
                    <label>Título</label>
                    <input
                      className="ad-input"
                      value={et.titulo}
                      onChange={(e) => setEtapa(ei, { titulo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ad-field">
                  <label>Descripción</label>
                  <textarea
                    className="ad-textarea"
                    value={et.descripcion}
                    onChange={(e) => setEtapa(ei, { descripcion: e.target.value })}
                  />
                </div>

                <p className="ad-hint" style={{ margin: '4px 0 8px' }}>
                  Proyectos de esta etapa
                </p>
                {(et.proyectos || []).map((p, pi) => (
                  <div className="ad-proy" key={pi}>
                    <input
                      className="ad-input"
                      value={p.titulo}
                      placeholder="Título del proyecto"
                      onChange={(e) => setProy(ei, pi, { titulo: e.target.value })}
                    />
                    <input
                      className="ad-input"
                      value={p.descripcion}
                      placeholder="Descripción breve"
                      onChange={(e) => setProy(ei, pi, { descripcion: e.target.value })}
                    />
                    <button
                      type="button"
                      className="ad-btn ad-btn--danger"
                      onClick={() => delProy(ei, pi)}
                      title="Quitar proyecto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <div className="ad-etapa__actions">
                  <button
                    type="button"
                    className="ad-btn ad-btn--ghost"
                    onClick={() => addProy(ei)}
                  >
                    <Plus size={14} /> Proyecto
                  </button>
                  <button
                    type="button"
                    className="ad-btn ad-btn--danger"
                    onClick={() => delEtapa(ei)}
                  >
                    <Trash2 size={14} /> Eliminar etapa
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="ad-btn ad-btn--ghost" onClick={addEtapa}>
              <Plus size={15} /> Agregar etapa
            </button>
          </div>
        </>
      )}

      {/* ===================== PROYECTOS ===================== */}
      {tab === 'proyectos' && (
        <div className="ad-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 className="ad-card__title">Encabezado de Proyectos</h2>
          <ImageField
            label="Foto del hero"
            value={form.proyectos_hero_imagen}
            onChange={(v) => set('proyectos_hero_imagen', v)}
          />
          <div className="ad-field">
            <label>Título del hero</label>
            <textarea
              className="ad-textarea"
              rows={2}
              value={form.proyectos_hero_titulo}
              onChange={(e) => set('proyectos_hero_titulo', e.target.value)}
            />
            <p className="ad-hint">{LINE_HINT}</p>
          </div>
          <div className="ad-field">
            <label>Bajada del hero</label>
            <textarea
              className="ad-textarea"
              value={form.proyectos_hero_lead}
              onChange={(e) => set('proyectos_hero_lead', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ===================== SERVICIOS ===================== */}
      {tab === 'servicios' && (
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
          <div className="ad-field">
            <label>Título del hero</label>
            <textarea
              className="ad-textarea"
              rows={2}
              value={form.servicios_hero_titulo}
              onChange={(e) => set('servicios_hero_titulo', e.target.value)}
            />
            <p className="ad-hint">{LINE_HINT}</p>
          </div>
          <div className="ad-field">
            <label>Bajada del hero</label>
            <textarea
              className="ad-textarea"
              value={form.servicios_hero_lead}
              onChange={(e) => set('servicios_hero_lead', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="ad-actions">
        <button className="ad-btn" type="button" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar contenido'}
        </button>
      </div>
    </div>
  );
}
