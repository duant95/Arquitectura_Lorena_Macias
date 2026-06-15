'use client';

import Link from 'next/link';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';

export default function Servicios() {
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
          <article className="svc-item reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/exterior.jpg" alt="Proyecto arquitectónico" />
            </div>
            <div>
              <div className="n">01</div>
              <h3>Proyecto arquitectónico & Project Management</h3>
              <p>
                Edificios, barrios cerrados y proyectos de gran envergadura. Llevamos tu proyecto
                del anteproyecto a la dirección de obra, con una mirada integral en cada etapa.
              </p>
              <ul>
                <li>Anteproyecto &amp; proyecto ejecutivo</li>
                <li>Edificios &amp; barrios cerrados</li>
                <li>Renders 3D</li>
                <li>Dirección de obra</li>
                <li>Project management</li>
              </ul>
            </div>
          </article>

          <article className="svc-item rev reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/living.jpg" alt="Diseño de interiores" />
            </div>
            <div>
              <div className="n">02</div>
              <h3>Diseño de interiores</h3>
              <p>
                Interiores residenciales y comerciales a medida. Definimos materialidad, mobiliario
                e iluminación para lograr espacios cálidos, sofisticados y funcionales.
              </p>
              <ul>
                <li>Residencial &amp; comercial</li>
                <li>Materialidad</li>
                <li>Mobiliario a medida</li>
                <li>Iluminación</li>
              </ul>
            </div>
          </article>

          <article className="svc-item reveal">
            <div className="svc-item__img reveal-img">
              <div className="ph" data-ph="Proyecto náutico"></div>
            </div>
            <div>
              <div className="n">03</div>
              <h3>Interiorismo náutico</h3>
              <p>
                Diseño de interiores náuticos: espacios funcionales y elegantes, pensados al detalle
                para la vida a bordo y el aprovechamiento de cada centímetro.
              </p>
              <ul>
                <li>Aprovechamiento del espacio</li>
                <li>Materialidad marina</li>
                <li>Mobiliario a medida</li>
                <li>Iluminación</li>
              </ul>
            </div>
          </article>

          <article className="svc-item rev reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/cocina.jpg" alt="Reformas y obras" />
            </div>
            <div>
              <div className="n">04</div>
              <h3>Reformas y obras</h3>
              <p>
                Renovamos y ampliamos espacios con visión integral. Dirigimos y ejecutamos la obra
                con estándares de calidad y atención al detalle.
              </p>
              <ul>
                <li>Reformas integrales</li>
                <li>Ampliaciones</li>
                <li>Dirección de obra</li>
                <li>Ejecución</li>
              </ul>
            </div>
          </article>

          <article className="svc-item reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/terraza.jpg" alt="Paisajismo" />
            </div>
            <div>
              <div className="n">05</div>
              <h3>Paisajismo</h3>
              <p>
                Diseñamos el exterior como una extensión natural de tu ambiente: jardines, decks,
                piscinas y áreas verdes que conectan el espacio con su entorno.
              </p>
              <ul>
                <li>Diseño de jardines</li>
                <li>Decks &amp; exteriores</li>
                <li>Vegetación</li>
                <li>Áreas de relax</li>
              </ul>
            </div>
          </article>
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
