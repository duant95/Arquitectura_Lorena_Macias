import Link from 'next/link';
import SiteShell from '../components/SiteShell';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="phero">
        <div className="phero__in">
          <div className="crumb">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <span>Página no encontrada</span>
          </div>
          <h1>Página no encontrada</h1>
          <p className="phero__lead">
            No encontramos la página que buscás. Puede que el enlace haya cambiado o ya no exista.
          </p>
          <div style={{ marginTop: 36 }}>
            <Link className="btn" href="/">
              Volver al inicio <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
