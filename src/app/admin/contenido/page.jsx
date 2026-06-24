import { getContent } from '@/lib/config';
import ContenidoEditor from '@/components/admin/ContenidoEditor';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Contenido' };

export default async function AdminContenido() {
  const content = await getContent();
  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Contenido de las páginas</h1>
          <p>Editá las fotos y los textos del Inicio y de Sobre mí, y la línea de tiempo.</p>
        </div>
      </div>
      <ContenidoEditor inicial={content} />
    </>
  );
}
