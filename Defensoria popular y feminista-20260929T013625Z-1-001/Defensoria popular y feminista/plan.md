# Plan de desarrollo · Sitio web Defensoría Popular Eloísa Zurita

Base visual: `brand/eloisa-zurita-dossier.html` (secciones 01 Manual de marca y 03 Sitio web).
Assets de origen: esta carpeta (`logo.png`, `logo-titulo.PNG`, afiches `IMG_1758`, `IMG_1759`, `afiche-bn-3-10`).

---

## 1. Objetivo

Que una mujer que llega desde un afiche o desde redes entienda en segundos que la orientación legal es gratuita y para ella, y que **agende una hora por WhatsApp** para **asistir el sábado de la jornada**.

### Llamado a la acción (CTA) único

> **Agenda una hora por WhatsApp y asiste el sábado 3 de octubre**

- WhatsApp: **+56 9 5632 7225** → enlace `https://wa.me/56956327225`
- Mensaje precargado (propuesta):
  `Hola, quiero agendar una hora de orientación legal para la jornada del sábado 3 de octubre.`
- Todos los botones de acción del sitio llevan a ese mismo enlace, con el ícono de WhatsApp.
- Fecha de la jornada confirmada: **sábado 3 de octubre de 2026**, 15 a 18 hrs.

---

## 2. Navegación

### Escritorio: barra superior con el logo acoplado
- Barra fija arriba, fondo rosa `#FDC8BC`.
- A la izquierda, el **lockup completo** acoplado a la barra: retrato + "DEFENSORÍA POPULAR / ELOÍSA ZURITA".
- Al centro, los enlaces: Qué hacemos · Jornada · Quiénes somos · Eloísa Zurita.
- A la derecha, el botón **"Agenda por WhatsApp"** (ícono de WhatsApp + texto), fondo café `#974615`.
- Al bajar, la barra se compacta: el lockup se achica y queda solo el retrato bajo cierto alto de scroll.

### Celular: barra inferior con aspecto de app
- Arriba, una barra mínima con el lockup pequeño (sin menú hamburguesa).
- Abajo, una **barra de pestañas fija** (tab bar), como en una app:

| Pestaña | Ícono | Lleva a |
|---|---|---|
| Inicio | casa | `#inicio` |
| Servicios | balanza / documento | `#que-hacemos` |
| **Agendar** | **WhatsApp**, botón central destacado | `wa.me/56956327225` |
| Jornada | calendario | `#jornada` |
| Nosotras | retrato de Eloísa | `#quienes-somos` |

- El botón central de WhatsApp va más grande, circular, en café con el ícono en blanco, y sobresale de la barra.
- La barra respeta el área segura del teléfono: `padding-bottom: env(safe-area-inset-bottom)`.
- La pestaña activa se marca según la sección visible, con `IntersectionObserver`.

---

## 3. Estructura de la página (una sola página con anclas)

| # | Sección | Contenido | Fuente |
|---|---|---|---|
| 1 | **Inicio / hero** | Pregunta de entrada · titular "NO ESTÁS SOLA. TIENES DERECHOS." · cinta "Orientación legal gratuita para mujeres" · CTA WhatsApp · ilustración de línea | Afiche |
| 2 | **Qué hacemos** | Tres servicios: Pensión de alimentos · Violencia · Problemas legales de familia | Afiche (textos por completar) |
| 3 | **Jornada** | Bloque negro ¿Cuándo? / ¿Dónde?: Sábado 3 de octubre, 15 a 18 hrs · Manuela Errázuriz, Pedro Aguirre Cerda · CTA "Agenda tu hora" | Afiche |
| 4 | **Cómo agendar** | 3 pasos: 1) Escribe al WhatsApp · 2) Te confirmamos la hora · 3) Asiste el sábado | Propuesta |
| 5 | **Quiénes somos** | Texto institucional | ⏳ Pendiente (texto de la defensoría) |
| 6 | **Eloísa Zurita** | Retrato + biografía breve + línea de tiempo + fuentes | Dossier, sección 04 |
| 7 | **Pie** | WhatsApp · web · logo en negativo | Afiche |

---

## 4. Sistema visual (del dossier)

**Colores**
```css
--rosa:#FDC8BC;      /* barra, cabeceras */
--cafe:#974615;      /* logo, pie, botón WhatsApp */
--terracota:#AF643B; /* sobretítulo, cinta variante A */
--coral:#FF5757;     /* cinta variante B, un solo uso por pantalla */
--crema:#FBF7EE;     /* fondo del cuerpo */
--negro:#141414;     /* titulares, bloque de jornada */
--gris-linea:#706F6B;/* ilustración */
```

**Tipografías** (Google Fonts, por confirmar contra Canva)
- Nombre / fecha: Archivo 800, ancho 112–125 %
- Titulares: Anton
- Texto y botones: Inter
- Datos (hora, lugar): Archivo, ancho 75 %

**Assets a preparar**
- [ ] Retrato en SVG, vectorizado desde `logo.png` (hoy existe como máscara PNG en el dossier)
- [ ] Ilustración de línea en SVG, o PNG con fondo transparente
- [ ] Ícono de WhatsApp en SVG (oficial, monocromo)
- [ ] Favicon 32/180/512 con el retrato sobre rosa
- [ ] Imagen para compartir (OG) 1200×630: lockup + titular

---

## 5. Stack técnico (propuesta)

- **Sitio estático**: HTML + CSS + un poco de JS, o **Astro** si se van a publicar varias jornadas.
- Sin base de datos: la jornada vigente vive en un archivo de datos (`jornada.json` o frontmatter) para cambiar fecha y lugar sin tocar el diseño.
- **Hosting** gratuito o de bajo costo (Vercel, Netlify o GitHub Pages) apuntando a `defensoriafeminista.cl`.
- Sin cookies ni rastreadores de terceros, por la sensibilidad del público (violencia). Si se mide, usar analítica sin cookies.

---

## 6. Fases

### Fase 0 · Definiciones
- [x] Confirmar la fecha de la jornada: sábado 3 de octubre
- [ ] Confirmar el nombre oficial: "Defensoría Popular Eloísa Zurita" o "Defensoría Popular y Feminista"
- [ ] Recibir el texto de "Quiénes somos"
- [ ] Confirmar las tipografías de Canva
- [ ] Confirmar quién tiene acceso al dominio `defensoriafeminista.cl`

### Fase 1 · Base
- [ ] Crear el repo y la estructura del proyecto
- [ ] Tokens de color y tipografía
- [ ] Vectorizar el retrato y preparar los íconos
- [ ] Componente `Lockup` (completo, compacto, solo retrato, negativo)
- [ ] Componente `BotonWhatsApp` (enlace `wa.me` con mensaje precargado)

### Fase 2 · Navegación
- [ ] Barra superior de escritorio con el lockup acoplado y estado compacto al hacer scroll
- [ ] Barra inferior tipo app en celular, con el botón central de WhatsApp
- [ ] Pestaña activa según la sección visible

### Fase 3 · Secciones
- [ ] Hero
- [ ] Qué hacemos
- [ ] Jornada, que se lee del archivo de datos
- [ ] Cómo agendar
- [ ] Quiénes somos (texto provisional hasta recibir el definitivo)
- [ ] Eloísa Zurita
- [ ] Pie

### Fase 4 · Calidad
- [ ] Accesibilidad: contraste AA, foco visible, `aria-label` en los íconos de la tab bar, textos alternativos
- [ ] Pruebas en celulares reales (Android de gama baja incluido)
- [ ] Rendimiento: menos de 200 KB en la primera carga, imágenes en WebP/SVG
- [ ] Metadatos: título, descripción, imagen OG, favicon
- [ ] Salida rápida: evaluar un botón "Salir rápido" para quien navega en riesgo de violencia

### Fase 5 · Publicación
- [ ] Deploy y conexión del dominio
- [ ] Probar que el enlace de WhatsApp abra en Android, iPhone y escritorio (WhatsApp Web)
- [ ] Guía corta para el equipo: cómo cambiar la fecha y el lugar de la próxima jornada

---

## 7. Criterios de aceptación

- En cualquier pantalla, el botón de WhatsApp para agendar está visible sin hacer scroll.
- En celular, la barra inferior no tapa contenido: el último bloque tiene margen inferior igual al alto de la barra.
- La fecha, la hora y el lugar de la jornada aparecen en el hero o justo debajo, sin buscar.
- El logo en la barra coincide con el lockup del dossier (proporciones, colores y tipografía).
- Cambiar la jornada requiere editar un solo archivo.

---

## 8. Pendientes abiertos

| Tema | Estado |
|---|---|
| Fecha de la jornada | ✅ Sábado 3 de octubre |
| Texto "Quiénes somos" | ⏳ Lo entrega la defensoría |
| Tipografías exactas | ⏳ Confirmar en Canva |
| Nombre oficial | ⏳ Confirmar |
| Datos en conflicto sobre Eloísa Zurita (lugar de nacimiento, fechas) | ⏳ Revisar antes de publicar la biografía |
| Stack: HTML plano o Astro | ⏳ Decidir |
