'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import { Parallax } from '../components/fx/Motion';

export default function ServiciosView({ servicios = [], content = {} }) {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      <section className={'phero' + (content.servicios_hero_imagen ? ' phero--image' : '')}>
        {content.servicios_hero_imagen && (
          <Parallax className="phero__bg" src={content.servicios_hero_imagen} strength={8} priority />
        )}
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> / Servicios
          </div>
          <h1
            dangerouslySetInnerHTML={{
              __html: (content.servicios_hero_titulo || 'Servicios').replace(/\n/g, '<br />'),
            }}
          />
          <p className="phero__lead">{content.servicios_hero_lead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          {servicios.map((s, i) => (
            <article key={i} className={`svc-item reveal${i % 2 === 1 ? ' rev' : ''}`}>
              <div className="svc-item__img">
                {s.imagen ? (
                  <Parallax className="svc-item__media" src={s.imagen} alt={s.titulo} strength={8} />
                ) : (
                  <div className="ph" data-ph={s.titulo}></div>
                )}
              </div>
              <div>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <h3>{s.titulo}</h3>
                <p>{s.descripcion}</p>
                {s.incluye?.length > 0 && (
                  <ul>
                    {s.incluye.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="section proc">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-head__l">
              <span className="eyebrow">Metodología</span>
              <h2 className="h-xl">Un proceso claro</h2>
            </div>
            <p style={{ maxWidth: 360, color: 'var(--ink-soft)', margin: 0 }}>
              Cuatro etapas para acompañarte con tranquilidad, de la idea a la entrega.
            </p>
          </div>
          <div className="steps reveal d1">
            {(content.servicios_pasos || []).map((p, i) => (
              <div className="step" key={i}>
                <div className="n">{String(i + 1).padStart(2, '0')}</div>
                <h4>{p.titulo}</h4>
                <p>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="wrap">
          <p className="eyebrow reveal" style={{ marginBottom: 22 }}>
            ¿Hablamos?
          </p>
          <h2
            className="h-xl reveal d1"
            style={{ marginBottom: 18, maxWidth: '18ch', marginInline: 'auto' }}
          >
            Contanos qué necesitás y diseñamos juntos la mejor <em>solución</em>.
          </h2>
          <div
            className="reveal d2"
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 32,
            }}
          >
            <button className="btn" onClick={open}>
              Solicitar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost" href="/contacto">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
