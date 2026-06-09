import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import '../styles/servicios.css';

export default function Servicios() {
  const { open } = useAgenda();
  useReveals();

  return (
    <Layout navMode="light">
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link to="/">Inicio</Link> — Servicios
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
              <img src="/assets/img/dormitorio.jpg" alt="Diseño de interiores" />
            </div>
            <div>
              <div className="n">01</div>
              <h3>Diseño de interiores</h3>
              <p>
                Creamos ambientes a medida que reflejan tu identidad. Definimos materialidad,
                mobiliario, iluminación y vegetación para lograr espacios cálidos y funcionales.
              </p>
              <ul>
                <li>Layout &amp; ambientación</li>
                <li>Materialidad</li>
                <li>Mobiliario a medida</li>
                <li>Iluminación</li>
              </ul>
            </div>
          </article>

          <article className="svc-item rev reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/escalera.jpg" alt="Proyecto arquitectónico" />
            </div>
            <div>
              <div className="n">02</div>
              <h3>Proyecto arquitectónico</h3>
              <p>
                Del anteproyecto al proyecto ejecutivo en un solo proceso. Partimos de tu idea y tu
                terreno para llegar a la documentación técnica completa, lista para construir sin
                sorpresas.
              </p>
              <ul>
                <li>Estudio del terreno</li>
                <li>Partido &amp; volumetría</li>
                <li>Renders 3D</li>
                <li>Planos ejecutivos</li>
                <li>Detalles &amp; instalaciones</li>
                <li>Cómputo &amp; pliegos</li>
              </ul>
            </div>
          </article>

          <article className="svc-item reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/cocina.jpg" alt="Reformas y obras" />
            </div>
            <div>
              <div className="n">03</div>
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

          <article className="svc-item rev reveal">
            <div className="svc-item__img reveal-img">
              <img src="/assets/img/exterior.jpg" alt="Paisajismo" />
            </div>
            <div>
              <div className="n">04</div>
              <h3>Paisajismo</h3>
              <p>
                Diseñamos el exterior como una extensión natural del hogar: jardines, decks,
                piscinas y áreas verdes que conectan la casa con su entorno.
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
              Agendar reunión <span className="arr">→</span>
            </button>
            <Link className="btn btn--ghost" to="/contacto">
              Contacto
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
