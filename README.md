# Lorena Macías · Arquitecta

Sitio web + CMS del estudio de arquitectura y diseño de interiores de **Lorena Macías**
(Luque, Paraguay). Construido con **Next.js (App Router)** y **Supabase**.

## Requisitos

- Node.js 18.18 o superior
- Una cuenta de [Supabase](https://supabase.com) (plan gratis)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completá con tus keys de Supabase
npm run dev                  # http://localhost:3000
```

Para conectar el CMS (base de datos, panel admin, carga de imágenes) seguí la guía
paso a paso: [`docs/SETUP-SUPABASE.md`](docs/SETUP-SUPABASE.md).

```bash
npm run build    # build de producción
npm run start    # sirve el build
npm run lint     # ESLint
node scripts/seed.mjs   # siembra la base con proyectos de ejemplo (opcional)
```

## Estructura

```
src/
├─ app/
│  ├─ layout.jsx            Layout raíz (importa el CSS del sitio, metadatos)
│  ├─ (site)/               Sitio público (chrome común: nav, footer, modal)
│  │  ├─ page.jsx           Inicio        (lee proyectos destacados)
│  │  ├─ proyectos/         Portafolio    (lee de Supabase)
│  │  ├─ proyecto/[slug]/   Página de obra (galería, planos 2D, renders 3D, proceso)
│  │  ├─ nosotros/ servicios/ contacto/
│  ├─ admin/                Panel CMS protegido (login + CRUD de proyectos)
│  └─ api/proyectos/        API protegida (crear/editar/eliminar)
├─ components/              Nav, Footer, AgendaModal, SiteShell, admin/*
├─ views/                  Las vistas de cada página (componentes cliente)
├─ lib/                    supabase, projects (capa de datos), authServer
├─ data/                   projects.js / site.js — datos de ejemplo y contacto
├─ styles/                 CSS del sitio + admin.css (panel)
└─ middleware.js           Protege /admin con Supabase Auth
supabase/schema.sql        Esquema de la base (correr una vez en Supabase)
```

## Cómo funciona el contenido

- Los **proyectos** se cargan y editan desde el panel **`/admin`** (sin tocar código):
  datos, imágenes (portada, galería, planos 2D, renders 3D), paleta y proceso.
- El sitio lee los proyectos desde **Supabase**. Si la base está vacía o no hay
  conexión, cae a los datos de ejemplo de [`src/data/projects.js`](src/data/projects.js)
  para no quedar vacío.
- Los datos de contacto y el menú viven en [`src/data/site.js`](src/data/site.js).

## Despliegue

Pensado para **Vercel**: importás el repo, cargás las 3 variables de entorno
(`.env.local`) en el proyecto de Vercel y desplegás. El dominio, hosting y SSL los
gestiona Vercel.

## Pendiente

- [ ] Formularios de Contacto y Agenda enviando a la base + notificaciones.
- [ ] Reemplazar imágenes de ejemplo por fotos/renders reales (desde el panel).
- [ ] SEO: sitemap, robots, Google Analytics.
