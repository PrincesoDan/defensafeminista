import '@fontsource-variable/archivo/standard.css';
import '@fontsource-variable/inter';
import '@fontsource/anton';
import './style.css';

// Barra superior: se compacta al bajar.
const barra = document.getElementById('barra');
const alScroll = () => barra.classList.toggle('compacta', window.scrollY > 80);
window.addEventListener('scroll', alScroll, { passive: true });
alScroll();

// Salida rápida: reemplaza esta página en el historial y abre Google.
document.querySelectorAll('[data-salir]').forEach((boton) =>
  boton.addEventListener('click', () => window.location.replace('https://www.google.cl')),
);

// Marca la pestaña y el enlace del menú de la sección visible.
const enlaces = [...document.querySelectorAll('[data-tab], .menu a')];
const marcar = (id) => {
  for (const a of enlaces) {
    const destino = a.dataset.tab ?? document.querySelector(a.getAttribute('href'))?.dataset.seccion;
    a.toggleAttribute('aria-current', destino === id);
    if (destino === id) a.setAttribute('aria-current', 'true');
  }
};
const observador = new IntersectionObserver(
  (entradas) => {
    const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) marcar(visible.target.dataset.seccion);
  },
  { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
);
document.querySelectorAll('[data-seccion]').forEach((s) => observador.observe(s));
