-- Ficha técnica estructurada de cada proyecto (datos rápidos, claves y créditos).
-- Ejecutar UNA vez en Supabase → SQL Editor.
-- El sitio y el panel funcionan aún sin esta columna (se guarda sin ficha hasta correrla),
-- pero para que la ficha se guarde y se muestre, hay que crearla:

alter table public.proyectos
  add column if not exists ficha jsonb not null default '{}'::jsonb;
