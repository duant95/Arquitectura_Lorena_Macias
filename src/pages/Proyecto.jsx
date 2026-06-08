import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import useReveals from '../hooks/useReveals';
import '../styles/proyecto.css';

export default function Proyecto() {
  useReveals();

  return (
    <Layout navMode="dark">
      {/* HERO */}
      <section className="pj-hero">
        <img src="/assets/img/living.jpg" alt="Casa del Bosque" />
        <div className="pj-hero__in">
          <div className="crumb" style={{ color: 'var(--sage)', fontSize: '11px', letterSpacing: '.26em', textTransform: 'uppercase', marginBottom: '20px' }}><Link to="/proyectos" style={{ color: 'var(--sage)' }}>Proyectos</Link> — Casa del Bosque</div>
          <div className="pj-hero__cat">Vivienda · Diseño de interiores</div>
          <h1>Casa del Bosque</h1>
        </div>
      </section>

      {/* META + INTRO */}
      <section className="section" style={{ paddingTop: 'clamp(50px,6vw,84px)' }}>
        <div className="wrap">
          <div className="pj-meta reveal">
            <div><span className="micro">Año</span><b>2023</b></div>
            <div><span className="micro">Superficie</span><b>320 m²</b></div>
            <div><span className="micro">Ubicación</span><b>Luque, PY</b></div>
            <div><span className="micro">Servicios</span><b>Arq. + Interiores</b></div>
          </div>
          <div className="split split--narrow" style={{ marginTop: 'clamp(50px,6vw,84px)' }}>
            <div className="reveal"><h2 className="h-lg" style={{ maxWidth: '14ch' }}>Una casa que se abre al <em>verde</em>.</h2></div>
            <div className="reveal d1">
              <p className="lead-serif" style={{ marginBottom: '24px' }}>Casa del Bosque nace del deseo de disolver los límites entre el <em>interior</em> y el jardín.</p>
              <p style={{ color: 'var(--ink-soft)' }}>La doble altura del living y los grandes paños vidriados traen la naturaleza adentro. La paleta combina maderas cálidas, piedra natural y textiles nobles, generando una atmósfera serena que invita a habitar con calma. Cada ambiente fue diseñado a medida, integrando mobiliario, iluminación y vegetación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="gal">
            <div className="imgblock span7 reveal-img" style={{ aspectRatio: '16/10' }}><img src="/assets/img/cocina.jpg" alt="Cocina integrada" /></div>
            <div className="imgblock span5 reveal-img" style={{ aspectRatio: '4/5' }}><img src="/assets/img/dormitorio.jpg" alt="Suite principal" /></div>
            <div className="imgblock full reveal-img"><img src="/assets/img/terraza.jpg" alt="Terraza y quincho" /></div>
            <div className="imgblock span5 reveal-img"><div className="ph" style={{ aspectRatio: '4/5' }} data-ph="Render de la clienta"></div></div>
            <div className="imgblock span7 reveal-img" style={{ aspectRatio: '16/10' }}><img src="/assets/img/escalera.jpg" alt="Escalera y jardín vertical" /></div>
          </div>
        </div>
      </section>

      {/* MATERIALES / PALETA */}
      <section className="section" style={{ background: 'var(--sand)' }}>
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: '22px' }}>Materialidad</p>
              <h2 className="h-lg" style={{ marginBottom: '24px' }}>Una paleta <em>natural</em></h2>
              <p style={{ color: 'var(--ink-soft)', maxWidth: '430px' }}>Maderas cálidas, piedra, cuero y verde componen una atmósfera honesta que envejece con belleza y dialoga con el entorno.</p>
            </div>
            <div className="reveal d1">
              <div className="paleta" style={{ marginBottom: '18px' }}>
                <div style={{ background: '#b08a5d', color: '#fff' }}>Camel</div>
                <div style={{ background: '#8a5d33', color: '#fff' }}>Madera</div>
                <div style={{ background: '#7d9472', color: '#fff' }}>Sage</div>
                <div style={{ background: '#a89f90', color: '#fff' }}>Piedra</div>
                <div style={{ background: '#e9ddca', color: '#5a5448' }}>Arena</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="imgblock" style={{ aspectRatio: '3/2' }}><img src="/assets/tex/maderatex.jpg" alt="Madera" /></div>
                <div className="imgblock" style={{ aspectRatio: '3/2' }}><img src="/assets/tex/piedra.jpg" alt="Piedra" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRÓXIMO PROYECTO */}
      <Link className="nextpj" to="/proyecto">
        <img src="/assets/img/exterior.jpg" alt="" />
        <div className="nextpj__c">
          <p className="eyebrow light" style={{ marginBottom: '18px' }}>Próximo proyecto</p>
          <h2 className="display" style={{ color: 'var(--cream)', fontSize: 'clamp(34px,5vw,76px)' }}>Residencia Vera</h2>
          <span className="link-arrow" style={{ color: 'var(--sage)', marginTop: '20px' }}>Ver proyecto <span className="arr">→</span></span>
        </div>
      </Link>
    </Layout>
  );
}
