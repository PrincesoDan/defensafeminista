import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const leer = (ruta) => readFileSync(resolve(import.meta.dirname, ruta), 'utf8');

// Arma los datos que se reemplazan en index.html como {{clave}}.
// Para cambiar la jornada se edita solo src/data/sitio.json.
function datosDelSitio() {
  const sitio = JSON.parse(leer('src/data/sitio.json'));
  const { jornada } = sitio;
  const mensaje = `Hola, quiero agendar una hora de orientación legal para la jornada del ${jornada.dia.toLowerCase()}.`;
  const evento = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Jornada de orientación legal gratuita para mujeres',
    startDate: `${jornada.fechaISO}T${jornada.horaInicio}:00-03:00`,
    endDate: `${jornada.fechaISO}T${jornada.horaFin}:00-03:00`,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    isAccessibleForFree: true,
    location: {
      '@type': 'Place',
      name: jornada.lugar,
      address: { '@type': 'PostalAddress', addressLocality: jornada.comuna, addressCountry: 'CL' },
    },
    organizer: { '@type': 'Organization', name: sitio.nombre, url: `https://${sitio.dominio}` },
  };
  return {
    nombre: sitio.nombre,
    dominio: sitio.dominio,
    whatsappVisible: sitio.whatsappVisible,
    whatsappUrl: `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(mensaje)}`,
    dia: jornada.dia,
    diaMayus: jornada.dia.toUpperCase(),
    diaMinus: jornada.dia.toLowerCase(),
    horario: jornada.horario,
    lugar: jornada.lugar,
    comuna: jornada.comuna,
    eventoJsonLd: JSON.stringify(evento),
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

// Sprite con el retrato y la ilustración como <symbol>, para reutilizarlos con <use>.
function sprite() {
  const simbolo = (id, archivo) => {
    const svg = leer(archivo);
    const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
    const cuerpo = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<symbol id="${id}" viewBox="${viewBox}">${cuerpo}</symbol>`;
  };
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${simbolo('retrato', 'src/assets/retrato.svg')}${simbolo('ilus', 'src/assets/ilustracion.svg')}</svg>`;
}

function plantilla() {
  return {
    name: 'plantilla-defensoria',
    transformIndexHtml(html) {
      const datos = datosDelSitio();
      return html
        .replace('{{sprite}}', sprite)
        .replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => icono(n))
        .replace(/\{\{(\w+)\}\}/g, (m, k) => (k in datos ? datos[k] : m));
    },
  };
}

export default defineConfig({
  plugins: [plantilla()],
});
