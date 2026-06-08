import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * Página interina para las secciones aún no migradas a React
 * (Nosotros, Proyectos, Servicios, Contacto, Detalle de proyecto).
 * Mantiene los enlaces funcionando sin romper el sitio.
 */
export default function Placeholder({ title }) {
  return (
    <Layout navMode="light">
      <section className="phero">
        <div className="phero__in">
          <div className="crumb"><Link to="/">Inicio</Link><span>/</span><span>{title}</span></div>
          <h1>{title}</h1>
          <p className="phero__lead">
            Esta sección está en construcción. La estamos migrando a React manteniendo el mismo
            diseño del prototipo.
          </p>
          <div style={{ marginTop: 36 }}>
            <Link className="btn" to="/">Volver al inicio <span className="arr">→</span></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
