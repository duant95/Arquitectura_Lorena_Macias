# Puesta en marcha del CMS (Supabase)

Esta guía es para conectar el sitio con Supabase (base de datos + panel de
administración + carga de imágenes). Hacelo una sola vez.

## 1. Crear el proyecto en Supabase

1. Entrá a [supabase.com](https://supabase.com) y creá una cuenta (plan gratis alcanza).
2. **New project** → elegí nombre (ej. `lorena-macias`) y una contraseña para la base.
3. Esperá ~2 minutos a que se aprovisione.

## 2. Cargar el esquema

1. En el panel de Supabase: **SQL Editor → New query**.
2. Pegá TODO el contenido de [`supabase/schema.sql`](../supabase/schema.sql).
3. **Run**. Crea las tablas (`proyectos`, `mensajes`, `configuracion`), las
   políticas de seguridad y el bucket de imágenes.

## 3. Copiar las keys

En **Settings → API** vas a encontrar:

| En Supabase             | Va en `.env.local`              |
| ----------------------- | ------------------------------- |
| Project URL             | `NEXT_PUBLIC_SUPABASE_URL`      |
| `anon` `public`         | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY`     |

Copiá `.env.example` como `.env.local` y pegá los tres valores.

```bash
cp .env.example .env.local
# editá .env.local con tus keys
```

> ⚠️ La `service_role` es secreta. No la compartas ni la subas al repo
> (`.env.local` ya está en `.gitignore`).

## 4. Crear el usuario administrador

En **Authentication → Users → Add user**:

- Email y contraseña que usará Lorena (o vos) para entrar a `/admin`.
- Marcá **Auto Confirm User** para no tener que confirmar por email.

## 5. Probar

```bash
npm install
npm run dev
```

- Sitio público: `http://localhost:3000`
- Panel admin: `http://localhost:3000/admin` (entrá con el usuario del paso 4)

> Mientras no haya `.env.local`, el sitio funciona igual mostrando los datos de
> ejemplo (`src/data/projects.js`). Al conectar Supabase, empieza a leer de la base.
