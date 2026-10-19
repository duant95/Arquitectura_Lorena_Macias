-- ============================================================
--  ACCESO AL PANEL — lista de administradoras con rol
--  Pegá este archivo completo en: Supabase → SQL Editor → Run
--  (se puede correr más de una vez sin problema)
--
--  Roles:
--    duena   → todo, incluido eliminar y gestionar usuarios
--    editora → crear y editar contenido, proyectos y fotos (no elimina)
-- ============================================================

create table if not exists admin_usuarios (
  email      text primary key,
  rol        text not null default 'editora' check (rol in ('duena', 'editora')),
  nombre     text,
  created_at timestamptz default now()
);

-- Sin políticas públicas: sólo el servidor (service role) lee/escribe la lista.
alter table admin_usuarios enable row level security;

-- Cuentas de Lorena como dueñas.
insert into admin_usuarios (email, rol, nombre) values
  ('lorenamacias@gmail.com', 'duena', 'Lorena Macías'),
  ('arqlmacias@gmail.com',   'duena', 'Lorena Macías')
on conflict (email) do update set rol = 'duena';

-- Rol de la usuaria logueada (null si no está en la lista). Lo usan las
-- políticas del storage para decidir quién sube/borra fotos.
create or replace function public.admin_rol()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select rol from admin_usuarios where email = lower(auth.jwt() ->> 'email')
$$;

revoke all on function public.admin_rol() from public;
grant execute on function public.admin_rol() to authenticated;

-- ---------- STORAGE (fotos) ----------
-- Subir fotos: sólo quien está en la lista (dueña o editora).
drop policy if exists "subida admin imagenes" on storage.objects;
create policy "subida admin imagenes"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'proyectos' and public.admin_rol() is not null);

-- Borrar archivos: sólo la dueña.
drop policy if exists "borrado admin imagenes" on storage.objects;
create policy "borrado admin imagenes"
  on storage.objects for delete to authenticated
  using (bucket_id = 'proyectos' and public.admin_rol() = 'duena');
