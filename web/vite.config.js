import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const leer = (ruta) => readFileSync(resolve(import.meta.dirname, ruta), 'utf8');

const DESCRIPCION =
  'Abogadas feministas. Orientación legal y representación jurídica gratuita para mujeres en pensión de alimentos, violencia y problemas legales de familia.';

// Páginas públicas: alimentan el sitemap y llms.txt.
const PAGINAS = [
  { ruta: '/', titulo: 'Inicio', resumen: 'Servicios, próxima jornada de orientación legal y cómo agendar.' },
  { ruta: '/quienes-somos/', titulo: 'Quiénes somos', resumen: 'Quiénes somos y los principios que guían nuestro trabajo.' },
  { ruta: '/eloisa-zurita/', titulo: 'Eloísa Zurita', resumen: 'Biografía de Eloísa Zurita Arriagada y por qué llevamos su nombre.' },
];

function leerSitio() {
  return JSON.parse(leer('src/data/sitio.json'));
}

function mensajeWhatsapp(sitio) {
  return `Hola, quiero agendar una hora de orientación legal para la jornada del ${sitio.jornada.dia.toLowerCase()}.`;
}

// Datos estructurados de la organización: Google y los LLM los usan para saber quiénes somos.
function organizacionJsonLd(sitio) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      '@id': `${sitio.url}/#organizacion`,
      name: sitio.nombre,
      alternateName: 'Defensoría Feminista',
      description: DESCRIPCION,
      url: `${sitio.url}/`,
      logo: `${sitio.url}/icon-512.png`,
      image: `${sitio.url}/og.png`,
      telephone: `+${sitio.whatsapp}`,
      priceRange: 'Gratuito',
      areaServed: { '@type': 'City', name: 'Santiago de Chile' },
      knowsAbout: ['Pensión de alimentos', 'Violencia contra la mujer', 'Derecho de familia', 'Relación directa y regular (visitas)'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Agendamiento por WhatsApp',
        telephone: `+${sitio.whatsapp}`,
        url: `https://wa.me/${sitio.whatsapp}`,
        availableLanguage: 'es',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${sitio.url}/#sitio`,
      name: sitio.nombre,
      url: `${sitio.url}/`,
      inLanguage: 'es-CL',
      publisher: { '@id': `${sitio.url}/#organizacion` },
    },
  ];
}

function eventoJsonLd(sitio, whatsappUrl) {
  const { jornada } = sitio;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Jornada de orientación legal gratuita para mujeres',
    description: `Orientación legal gratuita para mujeres en pensión de alimentos, violencia y problemas legales de familia. ${jornada.dia}, ${jornada.horario} en ${jornada.lugar}, ${jornada.comuna}.`,
    image: `${sitio.url}/og.png`,
    startDate: `${jornada.fechaISO}T${jornada.horaInicio}:00-03:00`,
    endDate: `${jornada.fechaISO}T${jornada.horaFin}:00-03:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'CLP', availability: 'https://schema.org/InStock', url: whatsappUrl },
    location: {
      '@type': 'Place',
      name: jornada.lugar,
      address: { '@type': 'PostalAddress', addressLocality: jornada.comuna, addressRegion: 'Región Metropolitana', addressCountry: 'CL' },
    },
    organizer: { '@id': `${sitio.url}/#organizacion`, '@type': 'Organization', name: sitio.nombre, url: `${sitio.url}/` },
  };
}

// Arma los datos que se reemplazan en las páginas como {{clave}}.
// Para cambiar la jornada se edita solo src/data/sitio.json.
function datosDelSitio() {
  const sitio = leerSitio();
  const { jornada } = sitio;
  const whatsappUrl = `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensajeWhatsapp(sitio))}`;
  return {
    nombre: sitio.nombre,
    dominio: sitio.dominio,
    url: sitio.url,
    whatsappVisible: sitio.whatsappVisible,
    whatsappUrl,
    dia: jornada.dia,
    diaMayus: jornada.dia.toUpperCase(),
    diaMinus: jornada.dia.toLowerCase(),
    horario: jornada.horario,
    lugar: jornada.lugar,
    comuna: jornada.comuna,
    eventoJsonLd: JSON.stringify(eventoJsonLd(sitio, whatsappUrl)),
    organizacionJsonLd: JSON.stringify(organizacionJsonLd(sitio)),
  };
}

// Íconos en línea: {{icon:nombre}} usa lucide-static; {{icon:whatsapp}} usa simple-icons.
function icono(nombre) {
  if (nombre === 'whatsapp') {
    return leer('node_modules/simple-icons/icons/whatsapp.svg')
      .replace(/<title>.*?<\/title>/, '')
      .replace('<svg ', '<svg class="ico" aria-hidden="true" focusable="false" fill="currentColor" ');
  }
  return leer(`node_modules/lucide-static/icons/${nombre}.svg`)
    .replace(/<!--.*?-->/gs, '')
    .replace(/\s*class="[^"]*"/, '')
    .replace('<svg', '<svg class="ico" aria-hidden="true" focusable="false"')
    .trim();
}

// Sprite con el retrato como <symbol>, para reutilizarlos con <use>.
function sprite() {
  const simbolo = (id, archivo) => {
    const svg = leer(archivo);
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const cuerpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<symbol id="${id}" viewBox="${viewBox}">${cuerpo}</symbol>`;
  };
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${simbolo('retrato', 'src/assets/retrato.svg')}</svg>`;
}

function plantilla() {
  return {
    name: 'plantilla-defensoria',
    // 'pre': reemplazar {{url}} antes de que Vite trate los href como rutas de archivos.
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const datos = datosDelSitio();
        return html
          .replace('{{sprite}}', sprite)
          .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => icono(n))
          .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in datos ? datos[k] : m));
      },
    },
  };
}

function robotsTxt(sitio) {
  // Se permite explícitamente a los crawlers de IA para que puedan citar el sitio (GEO).
  const bots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  return [
    'User-agent: *',
    'Allow: /',
    '',
    ...bots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${sitio.url}/sitemap.xml`,
    '',
  ].join('\n');
}

function sitemapXml(sitio) {
  const hoy = new Date().toISOString().slice(0, 10);
  const urls = PAGINAS.map((p) => `  <url><loc>${sitio.url}${p.ruta}</loc><lastmod>${hoy}</lastmod></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Resumen en texto plano para LLM (https://llmstxt.org).
function llmsTxt(sitio) {
  const { jornada } = sitio;
  return `# ${sitio.nombre}

> ${DESCRIPCION}

- Sitio: ${sitio.url}/
- Atención: gratuita, para mujeres.
- Temas: pensión de alimentos (fijar, cobrar o cambiar), visitas, violencia y problemas legales de familia.
- Cómo agendar: por WhatsApp al ${sitio.whatsappVisible} (https://wa.me/${sitio.whatsapp}).
- Próxima jornada de orientación legal: ${jornada.dia} (${jornada.fechaISO}), ${jornada.horario}, en ${jornada.lugar}, ${jornada.comuna}, Santiago de Chile.
- Nombre: homenaje a Eloísa Zurita Arriagada (1875–1941), considerada la primera feminista del norte de Chile.

## Páginas

${PAGINAS.map((p) => `- [${p.titulo}](${sitio.url}${p.ruta}): ${p.resumen}`).join('\n')}
`;
}

// Genera robots.txt, sitemap.xml y llms.txt desde sitio.json al compilar.
function archivosParaBuscadores() {
  return {
    name: 'archivos-buscadores',
    generateBundle() {
      const sitio = leerSitio();
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(sitio) });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(sitio) });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt(sitio) });
    },
  };
}

export default defineConfig({
  plugins: [plantilla(), archivosParaBuscadores()],
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(import.meta.dirname, 'index.html'),
        quienesSomos: resolve(import.meta.dirname, 'quienes-somos/index.html'),
        eloisaZurita: resolve(import.meta.dirname, 'eloisa-zurita/index.html'),
        noEncontrada: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
});
