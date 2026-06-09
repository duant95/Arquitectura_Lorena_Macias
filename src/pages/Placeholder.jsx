import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

/**
 * Página 404 — se muestra cuando la ruta no existe (catch-all en App.jsx).
 */
export default function Placeholder({ title }) {
  return (
    <Layout navMode="light">
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link to="/">Inicio</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <h1>{title}</h1>
          <p className="phero__lead">
            No encontramos la página que buscás. Puede que el enlace haya cambiado o ya no exista.
          </p>
          <div style={{ marginTop: 36 }}>
            <Link className="btn" to="/">
              Volver al inicio <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
