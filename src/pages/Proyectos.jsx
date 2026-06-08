import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAgenda } from '../context/AgendaContext';
import useReveals from '../hooks/useReveals';
import '../styles/proyectos.css';

const FILTERS = [
  { f: 'all', label: 'Todos' },
  { f: 'vivienda', label: 'Viviendas' },
  { f: 'reforma', label: 'Reformas & ampliaciones' },
  { f: 'interior', label: 'Diseño de interiores' },
  { f: 'paisaje', label: 'Paisajismo' },
  { f: 'obra', label: 'Obras' },
];

const CARDS = [
  {
    cat: 'vivienda interior', span: 's7 h-med', delay: '', idx: '01',
    img: '/assets/img/living.jpg', alt: 'Casa del Bosque',
    catLabel: 'Vivienda · Interiores', name: 'Casa del Bosque', meta: ['Luque · 2023', '320 m²'],
  },
  {
    cat: 'reforma', span: 's5 h-med', delay: 'd1', idx: '02',
    img: '/assets/img/cocina.jpg', alt: 'Residencia MK',
    catLabel: 'Reforma · Ampliación', name: 'Residencia MK', meta: ['Asunción · 2022', '240 m²'],
  },
  {
    cat: 'interior', span: 's5 h-tall', delay: '', idx: '03',
    img: '/assets/img/dormitorio.jpg', alt: 'Suite Natural',
    catLabel: 'Diseño de interiores', name: 'Suite Natural', meta: ['Luque · 2023', '58 m²'],
  },
  {
    cat: 'vivienda paisaje', span: 's7 h-tall', delay: 'd1', idx: '04',
    img: '/assets/img/exterior.jpg', alt: 'Residencia Vera',
    catLabel: 'Arquitectura · Paisajismo', name: 'Residencia Vera', meta: ['Luque · 2024', '410 m²'],
  },
  {
    cat: 'interior vivienda', span: 's5 h-med', delay: '', idx: '05',
    img: '/assets/img/escalera.jpg', alt: 'Casa Atrio',
    catLabel: 'Vivienda · Interiores', name: 'Casa Atrio', meta: ['Luque · 2023', '280 m²'],
  },
  {
    cat: 'reforma interior', span: 's7 h-med', delay: 'd1', idx: '06',
    img: '/assets/img/terraza.jpg', alt: 'Quincho & Terraza',
    catLabel: 'Reforma · Exterior', name: 'Quincho & Terraza', meta: ['Asunción · 2022', '95 m²'],
  },
  {
    cat: 'paisaje obra', span: 's4 h-tall', delay: '', idx: '07',
    ph: 'Render de la clienta',
    catLabel: 'Paisajismo', name: 'Jardín del Lago', meta: ['Areguá · 2024'],
  },
  {
    cat: 'vivienda obra', span: 's4 h-tall', delay: 'd1', idx: '08',
    ph: 'Foto de obra',
    catLabel: 'Vivienda · Obra', name: 'Casa Ñu', meta: ['Luque · En obra'],
  },
  {
    cat: 'interior', span: 's4 h-tall', delay: 'd2', idx: '09',
    ph: 'Render de la clienta',
    catLabel: 'Diseño de interiores', name: 'Loft Materia', meta: ['Asunción · 2024'],
  },
];

export default function Proyectos() {
  const { open } = useAgenda();
  const [active, setActive] = useState('all');
  useReveals([active]);

  const isVisible = (card) => active === 'all' || card.cat.includes(active);
  const shown = CARDS.filter(isVisible).length;

  return (
    <Layout navMode="light">
      <section className="phero">
        <div className="phero__in">
          <div className="crumb"><Link to="/">Inicio</Link> — Proyectos</div>
          <h1>Portafolio</h1>
          <p className="phero__lead">Una selección de viviendas, reformas, interiores y paisajismo. Cada obra, una historia construida con intención.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'clamp(44px,5vw,68px)' }}>
        <div className="wrap">
          <div className="filters reveal">
            {FILTERS.map((flt) => (
              <button
                key={flt.f}
                className={`filter${active === flt.f ? ' on' : ''}`}
                data-f={flt.f}
                onClick={() => setActive(flt.f)}
              >
                {flt.label}
              </button>
            ))}
          </div>

          <div className="pgrid" id="pgrid">
            {CARDS.map((card) => (
              <Link
                key={card.idx}
                className={`pcard ${card.span} reveal${card.delay ? ' ' + card.delay : ''}${isVisible(card) ? '' : ' is-hidden'}`}
                data-cat={card.cat}
                to="/proyecto"
              >
                <div className="pcard__media">
                  <span className="pcard__idx">{card.idx}</span>
                  <div className="pcard__go">↗</div>
                  {card.img
                    ? <img src={card.img} alt={card.alt} />
                    : <div className="ph" data-ph={card.ph}></div>}
                </div>
                <div className="pcard__cap">
                  <div>
                    <div className="pcard__cat">{card.catLabel}</div>
                    <div className="pcard__name">{card.name}</div>
                  </div>
                  <div className="pcard__meta">
                    {card.meta.map((line, i) => (
                      <span key={i}>{i > 0 && <br />}{line}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div id="empty" style={{ display: shown ? 'none' : 'block', textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>No hay proyectos en esta categoría todavía.</div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--green-wash)', textAlign: 'center' }}>
        <div className="wrap">
          <p className="eyebrow reveal" style={{ marginBottom: 22 }}>¿Tu proyecto es el próximo?</p>
          <h2 className="h-xl reveal d1" style={{ marginBottom: 32 }}>Diseñemos algo <em>único</em>, juntos.</h2>
          <button className="btn reveal d2" onClick={open}>Agendar reunión <span className="arr">→</span></button>
        </div>
      </section>
    </Layout>
  );
}
