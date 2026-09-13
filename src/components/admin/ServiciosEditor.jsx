'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Upload, X, Plus, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { uploadFiles } from '@/lib/uploadClient';

const VACIO = { titulo: '', descripcion: '', incluye: [], imagen: '', detalle: [], nota: '' };

export default function ServiciosEditor({ inicial = [] }) {
  const router = useRouter();
  const [items, setItems] = useState(inicial.length ? inicial : [{ ...VACIO }]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(-1);

  const update = (i, patch) =>
    setItems((arr) => arr.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const remove = (i) => setItems((arr) => arr.filter((_, j) => j !== i));
  const add = () => setItems((arr) => [...arr, { ...VACIO }]);
  const move = (i, dir) => {
    const j = dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= items.length) return;
    setItems((arr) => {
      const next = [...arr];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // "Conocer más": lista de pasos {titulo, texto} por servicio.
  const detalleOf = (s) => (Array.isArray(s.detalle) ? s.detalle : []);
  const addDetalle = (i) =>
    update(i, { detalle: [...detalleOf(items[i]), { titulo: '', texto: '' }] });
  const setDetalle = (i, j, field, val) =>
    update(i, {
      detalle: detalleOf(items[i]).map((d, k) => (k === j ? { ...d, [field]: val } : d)),
    });
  const delDetalle = (i, j) =>
    update(i, { detalle: detalleOf(items[i]).filter((_, k) => k !== j) });

  async function onImg(i, e) {
    const files = e.target.files;
    if (!files?.length) return;
    setBusy(i);
    const [url] = await uploadFiles(files);
    if (url) update(i, { imagen: url });
    setBusy(-1);
    e.target.value = '';
  }

  async function save() {
    setSaving(true);
    try {
      const limpio = items
        .filter((s) => s.titulo.trim())
        .map((s) => ({
          titulo: s.titulo.trim(),
          descripcion: s.descripcion?.trim() || '',
          incluye: (Array.isArray(s.incluye) ? s.incluye : String(s.incluye).split('\n'))
            .map((x) => x.trim())
            .filter(Boolean),
          imagen: s.imagen || '',
          detalle: (Array.isArray(s.detalle) ? s.detalle : [])
            .map((d) => ({ titulo: (d.titulo || '').trim(), texto: (d.texto || '').trim() }))
            .filter((d) => d.titulo || d.texto),
          nota: s.nota?.trim() || '',
        }));
      const res = await fetch('/api/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: 'servicios', valor: JSON.stringify(limpio) }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || 'Error al guardar');
        return;
      }
      toast.success('Servicios guardados');
      router.refresh();
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ad-form">
      {items.map((s, i) => (
        <div
          className="ad-card"
          key={i}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div className="ad-msg__head">
            <strong>Servicio {i + 1}</strong>
            <div className="ad-actions">
              <button
                className="ad-img__btn"
                type="button"
                onClick={() => move(i, 'up')}
                disabled={i === 0}
              >
                <ChevronUp size={14} />
              </button>
              <button
                className="ad-img__btn"
                type="button"
                onClick={() => move(i, 'down')}
                disabled={i === items.length - 1}
              >
                <ChevronDown size={14} />
              </button>
              <button className="ad-btn ad-btn--danger" type="button" onClick={() => remove(i)}>
                <Trash2 size={14} /> Quitar
              </button>
            </div>
          </div>

          <div className="ad-field">
            <label>Título</label>
            <input
              className="ad-input"
              value={s.titulo}
              onChange={(e) => update(i, { titulo: e.target.value })}
              placeholder="Ej: Diseño de interiores"
            />
          </div>
          <div className="ad-field">
            <label>Descripción</label>
            <textarea
              className="ad-textarea"
              value={s.descripcion}
              onChange={(e) => update(i, { descripcion: e.target.value })}
            />
          </div>
          <div className="ad-field">
            <label>Incluye (uno por línea)</label>
            <textarea
              className="ad-textarea"
              value={Array.isArray(s.incluye) ? s.incluye.join('\n') : s.incluye}
              onChange={(e) => update(i, { incluye: e.target.value.split('\n') })}
              placeholder={'Materialidad\nMobiliario a medida\nIluminación'}
            />
          </div>
          <div className="ad-field">
            <label>Conocer más (proceso / entregables)</label>
            <p className="ad-hint">
              {'Se muestra en un desplegable "Conocer más". Cada ítem: un título corto + una explicación breve. Opcional.'}
            </p>
            {detalleOf(s).map((d, j) => (
              <div
                key={j}
                style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}
              >
                <input
                  className="ad-input"
                  style={{ flex: '0 0 32%' }}
                  value={d.titulo || ''}
                  onChange={(e) => setDetalle(i, j, 'titulo', e.target.value)}
                  placeholder="Briefing"
                />
                <textarea
                  className="ad-textarea"
                  style={{ flex: 1, minHeight: 44 }}
                  rows={2}
                  value={d.texto || ''}
                  onChange={(e) => setDetalle(i, j, 'texto', e.target.value)}
                  placeholder="Interpretación de necesidades, estilo de vida, ubicación…"
                />
                <button
                  className="ad-img__btn"
                  type="button"
                  onClick={() => delDetalle(i, j)}
                  title="Quitar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button className="ad-btn ad-btn--ghost" type="button" onClick={() => addDetalle(i)}>
              <Plus size={14} /> Agregar ítem
            </button>
          </div>
          <div className="ad-field">
            <label>{'Nota (opcional, dentro de "Conocer más")'}</label>
            <input
              className="ad-input"
              value={s.nota || ''}
              onChange={(e) => update(i, { nota: e.target.value })}
              placeholder="Ej: Victory Yachts, primer hito de esta especialización."
            />
          </div>
          <div className="ad-field">
            <label>Imagen</label>
            {s.imagen && (
              <div className="ad-imgs" style={{ marginBottom: 8 }}>
                <div className="ad-img">
                  <img src={s.imagen} alt="" />
                  <div className="ad-img__bar">
                    <button
                      className="ad-img__btn"
                      type="button"
                      onClick={() => update(i, { imagen: '' })}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <label className="ad-upload">
              <Upload size={18} />
              {busy === i ? 'Subiendo…' : 'Subir imagen'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onImg(i, e)}
                disabled={busy === i}
              />
            </label>
          </div>
        </div>
      ))}

      <div className="ad-actions">
        <button className="ad-btn ad-btn--ghost" type="button" onClick={add}>
          <Plus size={15} /> Agregar servicio
        </button>
        <button className="ad-btn" type="button" onClick={save} disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar servicios'}
        </button>
      </div>
    </div>
  );
}
