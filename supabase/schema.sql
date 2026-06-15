-- ============================================================
--  LORENA MACÍAS · ARQUITECTA — Esquema de base de datos
--  Pegá este archivo completo en: Supabase → SQL Editor → Run
-- ============================================================

-- ---------- PROYECTOS ----------
create table if not exists proyectos (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  titulo          text not null,
  categoria_label text,                 -- visible, ej: "Vivienda · Diseño de interiores"
  categorias      text default '',      -- para filtros, separadas por espacio: "vivienda interior"
  resumen         text,                 -- frase corta (hero de la obra; admite <em>)
  descripcion     text,                 -- cuerpo principal
  proceso         text,                 -- historia del proceso (página de obra)
  anio            text,
  superficie      text,
  ubicacion       text,
  servicios       text,
  imagen_portada  text,
  galeria         jsonb default '[]'::jsonb,  -- [{ "url": "...", "alt": "..." }]
  planos          jsonb default '[]'::jsonb,  -- planos 2D: [{ "url": "...", "alt": "..." }]
  renders         jsonb default '[]'::jsonb,  -- renders 3D: [{ "url": "...", "alt": "..." }]
  paleta          jsonb default '[]'::jsonb,  -- [{ "name": "Madera", "hex": "#8a5d33" }]
  destacado       boolean default false,      -- aparece en el inicio
  orden           int default 99,             -- menor = primero
  created_at      timestamptz default now()
);

create index if not exists proyectos_orden_idx on proyectos (orden, created_at desc);

-- ---------- MENSAJES (Contacto + Agenda) ----------
create table if not exists mensajes (
  id            uuid primary key default gen_random_uuid(),
  origen        text default 'contacto',   -- 'contacto' | 'agenda'
  nombre        text not null,
  email         text,
  telefono      text,
  tipo_proyecto text,
  horario       text,                       -- slot elegido (agenda)
  mensaje       text,
  leido         boolean default false,
  created_at    timestamptz default now()
);

create index if not exists mensajes_created_idx on mensajes (created_at desc);

-- ---------- CONFIGURACIÓN (textos/imágenes editables) ----------
create table if not exists configuracion (
  clave text primary key,
  valor text
);

-- ============================================================
--  SEGURIDAD (RLS)
--  Lectura pública de proyectos y configuración.
--  Escrituras y mensajes pasan por la API con service role
--  (que ignora RLS), así que NO habilitamos escritura pública.
-- ============================================================
alter table proyectos     enable row level security;
alter table configuracion enable row level security;
alter table mensajes      enable row level security;

drop policy if exists "lectura publica proyectos" on proyectos;
create policy "lectura publica proyectos"
  on proyectos for select using (true);

drop policy if exists "lectura publica configuracion" on configuracion;
create policy "lectura publica configuracion"
  on configuracion for select using (true);

-- mensajes: sin políticas públicas → solo la service role (API) puede leer/insertar.

-- ============================================================
--  STORAGE — bucket público para imágenes de proyectos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('proyectos', 'proyectos', true)
on conflict (id) do nothing;

drop policy if exists "lectura publica imagenes" on storage.objects;
create policy "lectura publica imagenes"
  on storage.objects for select
  using (bucket_id = 'proyectos');

-- Subida/edición/borrado de imágenes: solo usuarios autenticados (el admin).
drop policy if exists "subida admin imagenes" on storage.objects;
create policy "subida admin imagenes"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'proyectos');

drop policy if exists "borrado admin imagenes" on storage.objects;
create policy "borrado admin imagenes"
  on storage.objects for delete to authenticated
  using (bucket_id = 'proyectos');
