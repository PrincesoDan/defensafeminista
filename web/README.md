# Sitio · Defensoría Popular Eloísa Zurita

Sitio para **defensoriafeminista.cl**, hecho con Vite (HTML + CSS + JS, sin framework de interfaz).
El diseño sale del dossier `../brand/eloisa-zurita-dossier.html` y el plan de `../Defensoria popular y feminista-*/Defensoria popular y feminista/plan.md`.

## Requisitos

Node 20 o superior (`nvm use`, el proyecto trae `.nvmrc`).

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # sitio estático en dist/
npm run preview   # sirve dist/ para revisarlo
```

## Cambiar la jornada o el WhatsApp

Todo está en **`src/data/sitio.json`**. Se edita ese archivo y se vuelve a ejecutar `npm run build`.
La fecha, el lugar, el mensaje precargado de WhatsApp, los metadatos y el evento para Google se generan desde ahí
(plugin `plantilla-defensoria` en `vite.config.js`, que reemplaza los `{{...}}` de `index.html`).

La imagen para compartir `public/og.png` tiene la fecha escrita: si cambia la jornada, hay que regenerarla.

Al compilar también se generan `robots.txt`, `sitemap.xml` y `llms.txt` (para buscadores y LLM) desde `sitio.json`.
`url` en `sitio.json` es la dirección oficial (canónica) y debe coincidir con el dominio principal en Vercel.

## Estructura

| Archivo | Qué es |
|---|---|
| `eloisa-zurita/index.html` | Página Eloísa Zurita con su biografía |
| `quienes-somos/index.html` | Página Quiénes somos y principios (misma barra, pie y datos que el inicio) |
| `index.html` | Página de inicio. `{{clave}}` son datos, `{{icon:nombre}}` son íconos (lucide-static / simple-icons) |
| `src/style.css` | Colores, tipografías y diseño del dossier |
| `src/main.js` | Barra que se compacta y pestaña activa |
| `src/assets/retrato.svg`, `ilustracion.svg` | Retrato e ilustración vectorizados (`fill="currentColor"`) |
| `scripts/assets.mjs` | Regenera esos SVG desde `assets-src/` (`npm run assets`) |
| `404.html` | Página para direcciones que no existen |
| `vercel.json` | Redirecciones de direcciones mal escritas (`/quienessomos` → `/quienes-somos/`, etc.) |
| `public/` | Favicon, ícono de iPhone, ícono 512 e imagen para compartir (`og.png`, 1200×630) |

## Publicar

`dist/` es un sitio estático: sirve en Vercel, Netlify o GitHub Pages. Luego se apunta el dominio `defensoriafeminista.cl`.
Las fuentes van incluidas en el sitio (no se piden a Google) y no hay cookies ni analítica.
