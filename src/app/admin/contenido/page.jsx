import { getContent } from '@/lib/config';
import { getAllProjects } from '@/lib/projects';
import ContenidoEditor from '@/components/admin/ContenidoEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contenido' };

export default async function AdminContenido() {
  const [content, proyectos] = await Promise.all([getContent(), getAllProjects()]);
  const opciones = proyectos.map((p) => ({
    slug: p.slug,
    name: p.name,
    catLabel: p.catLabel || '',
    cover: p.cover || '',
  }));
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Contenido de las páginas</h1>
          <p>Editá las fotos y los textos del Inicio y de Sobre mí, y la línea de tiempo.</p>
        </div>
      </div>
      <ContenidoEditor inicial={content} proyectos={opciones} />
    </>
  );
}
