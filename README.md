# Lorena Macías · Arquitecta

Sitio web del estudio de arquitectura y diseño de interiores de **Lorena Macías** (Luque, Paraguay).
Construido con **React + Vite** y enrutado con **React Router**.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Puesta en marcha

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # genera el sitio de producción en dist/
npm run preview  # sirve el build de producción localmente
```

## Estructura del proyecto

```
public/assets/        Imágenes, logos, texturas y fuentes
src/
├─ main.jsx           Punto de entrada (BrowserRouter + estilos globales)
├─ App.jsx            Rutas de la aplicación
├─ components/        Componentes compartidos (Nav, Footer, Layout, modal, etc.)
├─ context/           AgendaContext (estado del modal "Agendar reunión")
├─ data/              site.js — datos de contacto y navegación centralizados
├─ hooks/             useReveals — animaciones de aparición al hacer scroll
├─ pages/             Una página por ruta (Home, Nosotros, Proyectos, …)
└─ styles/            global.css + un CSS por página
```

## Rutas

| Ruta          | Página              |
|---------------|---------------------|
| `/`           | Inicio (Home)       |
| `/nosotros`   | Nosotros            |
| `/proyectos`  | Portafolio          |
| `/proyecto`   | Detalle de proyecto |
| `/servicios`  | Servicios           |
| `/contacto`   | Contacto            |
| `*`           | 404                 |

## Datos centralizados

Los datos de contacto (WhatsApp, Instagram, email, teléfono) y el menú de navegación
viven en [`src/data/site.js`](src/data/site.js). Cambiá un valor ahí y se actualiza
en todo el sitio (nav, footer, contacto, botón flotante).

## Próximos pasos

Ver la sección de pendientes y mejoras sugeridas más abajo o el historial del repo.

- [ ] Conectar los formularios (Contacto y Agenda) a un backend / servicio de email.
- [ ] Páginas de proyecto dinámicas (`/proyecto/:slug`) con datos reales.
- [ ] Reemplazar los placeholders de imágenes por fotos/renders definitivos.
- [ ] Configuración de despliegue (ver más abajo).

## Despliegue

Es una SPA: el servidor debe redirigir todas las rutas a `index.html` para que el
enrutado del lado del cliente funcione al recargar una URL profunda (p. ej. `/servicios`).

- **Netlify:** incluido en `public/_redirects`.
- **Vercel:** incluido en `vercel.json`.
- **GitHub Pages / Apache:** configurar el fallback a `index.html` (o usar `HashRouter`).
