// Vectoriza el retrato y la ilustración de línea a SVG monocromo (fill="currentColor").
// Uso: npm run assets
import potrace from 'potrace';
import { writeFile } from 'node:fs/promises';

const trace = (file, opts) =>
  new Promise((ok, fail) => potrace.trace(file, opts, (err, svg) => (err ? fail(err) : ok(svg))));

const jobs = [
  { src: 'assets-src/retrato-bw.png', out: 'src/assets/retrato.svg', opts: { threshold: 128, turdSize: 6, optTolerance: 0.3 } },
  { src: 'assets-src/ilustracion-bw.png', out: 'src/assets/ilustracion.svg', opts: { threshold: 128, turdSize: 40, optTolerance: 1 } },
];

for (const { src, out, opts } of jobs) {
  let svg = await trace(src, { ...opts, color: 'currentColor', background: 'transparent' });
  svg = svg.replace(/<rect[^>]*\/>/, '').replace(/\d+\.\d+/g, (n) => (+n).toFixed(1).replace(/\.0$/, ''));
  await writeFile(out, svg);
  console.log(`${out}  ${(svg.length / 1024).toFixed(1)} KB`);
}
