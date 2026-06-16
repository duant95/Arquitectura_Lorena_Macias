'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function ServiciosView({ servicios = [] }) {
  const { open } = useAgenda();
  useReveals();

  return (
    <>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link> — Servicios
          </div>
          <h1>Servicios</h1>
          <p className="phero__lead">
            Acompañamiento integral, desde la primera idea hasta el último detalle de obra. Diseño a
            medida en cada etapa.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          {servicios.map((s, i) => (
            <article key={i} className={`svc-item reveal${i % 2 === 1 ? ' rev' : ''}`}>
              <div className="svc-item__img reveal-img">
                {s.imagen ? (
                  <img src={s.imagen} alt={s.titulo} />
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
            <div className="step">
              <div className="n">01</div>
              <h4>Escuchar</h4>
              <p>Entendemos tu idea, necesidades y presupuesto.</p>
            </div>
            <div className="step">
              <div className="n">02</div>
              <h4>Diseñar</h4>
              <p>Anteproyecto, materialidad y renders.</p>
            </div>
            <div className="step">
              <div className="n">03</div>
              <h4>Construir</h4>
              <p>Documentación y dirección de obra.</p>
            </div>
            <div className="step">
              <div className="n">04</div>
              <h4>Habitar</h4>
              <p>Un espacio listo para vivirse.</p>
            </div>
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
