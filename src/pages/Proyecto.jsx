import { Link, useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useReveals from '../hooks/useReveals';
import { getProject, getNextProject } from '../data/projects';
import '../styles/proyecto.css';

export default function Proyecto() {
  const { slug } = useParams();
  const project = getProject(slug);
  // Importante: el hook debe llamarse siempre, antes de cualquier return condicional.
  useReveals([slug]);

  // Slug inexistente → 404
  if (!project) return <Navigate to="/404" replace />;

  const next = getNextProject(slug);

  return (
    <Layout navMode="dark">
      {/* HERO */}
      <section className="pj-hero">
        {project.cover ? (
          <img src={project.cover} alt={project.name} />
        ) : (
          <div className="ph" data-ph={project.ph} style={{ position: 'absolute', inset: 0 }}></div>
        )}
        <div className="pj-hero__in">
          <div
            className="crumb"
            style={{
              color: 'var(--sage)',
              fontSize: '11px',
              letterSpacing: '.26em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            <Link to="/proyectos" style={{ color: 'var(--sage)' }}>
              Proyectos
            </Link>{' '}
            — {project.name}
          </div>
          <div className="pj-hero__cat">{project.catLabel}</div>
          <h1>{project.name}</h1>
        </div>
      </section>

      {/* META + INTRO */}
      <section className="section" style={{ paddingTop: 'clamp(50px,6vw,84px)' }}>
        <div className="wrap">
          <div className="pj-meta reveal">
            <div>
              <span className="micro">Año</span>
              <b>{project.year}</b>
            </div>
            <div>
              <span className="micro">Superficie</span>
              <b>{project.area}</b>
            </div>
            <div>
              <span className="micro">Ubicación</span>
              <b>{project.location}</b>
            </div>
            <div>
              <span className="micro">Servicios</span>
              <b>{project.services}</b>
            </div>
          </div>
          <div className="split split--narrow" style={{ marginTop: 'clamp(50px,6vw,84px)' }}>
            <div className="reveal">
              <h2
                className="h-lg"
                style={{ maxWidth: '14ch' }}
                dangerouslySetInnerHTML={{ __html: project.heroTitle }}
              />
            </div>
            <div className="reveal d1">
              <p
                className="lead-serif"
                style={{ marginBottom: '24px' }}
                dangerouslySetInnerHTML={{ __html: project.intro }}
              />
              <p style={{ color: 'var(--ink-soft)' }}>{project.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="gal">
            {project.gallery.map((g, i) => (
              <div
                key={i}
                className={`imgblock ${g.span} reveal-img`}
                style={g.ratio ? { aspectRatio: g.ratio } : undefined}
              >
                {g.img ? (
                  <img src={g.img} alt={g.alt} />
                ) : (
                  <div
                    className="ph"
                    data-ph={g.ph}
                    style={{ position: 'absolute', inset: 0 }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MATERIALES / PALETA */}
      <section className="section" style={{ background: 'var(--sand)' }}>
        <div className="wrap">
          <div className="split">
            <div className="reveal">
              <p className="eyebrow" style={{ marginBottom: '22px' }}>
                Materialidad
              </p>
              <h2 className="h-lg" style={{ marginBottom: '24px' }}>
                Una paleta <em>natural</em>
              </h2>
              <p style={{ color: 'var(--ink-soft)', maxWidth: '430px' }}>
                Maderas cálidas, piedra, cuero y verde componen una atmósfera honesta que envejece
                con belleza y dialoga con el entorno.
              </p>
            </div>
            <div className="reveal d1">
              <div className="paleta" style={{ marginBottom: '18px' }}>
                {project.palette.map((c) => (
                  <div key={c.name} style={{ background: c.bg, color: c.fg }}>
                    {c.name}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="imgblock" style={{ aspectRatio: '3/2' }}>
                  <img src="/assets/tex/maderatex.jpg" alt="Madera" />
                </div>
                <div className="imgblock" style={{ aspectRatio: '3/2' }}>
                  <img src="/assets/tex/piedra.jpg" alt="Piedra" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRÓXIMO PROYECTO */}
      <Link className="nextpj" to={`/proyecto/${next.slug}`}>
        {next.cover ? (
          <img src={next.cover} alt="" />
        ) : (
          <div className="ph" data-ph={next.ph} style={{ position: 'absolute', inset: 0 }}></div>
        )}
        <div className="nextpj__c">
          <p className="eyebrow light" style={{ marginBottom: '18px' }}>
            Próximo proyecto
          </p>
          <h2
            className="display"
            style={{ color: 'var(--cream)', fontSize: 'clamp(34px,5vw,76px)' }}
          >
            {next.name}
          </h2>
          <span className="link-arrow" style={{ color: 'var(--sage)', marginTop: '20px' }}>
            Ver proyecto <span className="arr">→</span>
          </span>
        </div>
      </Link>
    </Layout>
  );
}
