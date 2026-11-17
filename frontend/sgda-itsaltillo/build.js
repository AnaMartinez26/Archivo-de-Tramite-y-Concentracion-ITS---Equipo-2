// Compila todo src/ en un solo archivo autocontenido: sgda-itsaltillo.html
//
//   npm install      -> instala dependencias (solo la primera vez)
//   npm run build    -> genera sgda-itsaltillo.html (minificado, listo para abrir con doble clic)
//   npm run dev      -> levanta http://localhost:5173 y recompila al guardar cambios
import { build, context } from 'esbuild';
import { writeFileSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';

const MODO_DEV = process.argv.includes('--watch');
const SALIDA = 'sgda-itsaltillo.html';
const PUERTO_BASE = Number(process.env.PORT) || 5173;
const clientesSSE = new Set();

const scriptAutoRecarga = MODO_DEV
  ? `<script>new EventSource('/__reload').onmessage=()=>location.reload();</script>`
  : '';

const generarHtml = (js, css) => `<!doctype html>
<html lang="es">
<head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SGDA – Instituto Tecnológico de Saltillo</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/g, '<\\/script')}</script>
${scriptAutoRecarga}
</body>
</html>`;

const escribirHtml = {
  name: 'escribir-html',
  setup(builder) {
    builder.onEnd(resultado => {
      if (resultado.errors.length) return;

      let js = '';
      let css = '';
      for (const archivo of resultado.outputFiles) {
        if (archivo.path.endsWith('.js')) js = archivo.text;
        else if (archivo.path.endsWith('.css')) css = archivo.text;
      }

      const html = generarHtml(js, css);
      writeFileSync(SALIDA, html);
      const hora = new Date().toLocaleTimeString('es-MX');
      console.log(`[${hora}] Listo: ${SALIDA} (${Math.round(html.length / 1024)} KB)`);

      for (const res of clientesSSE) {
        res.write('data: reload\n\n');
      }
    });
  }
};

const opciones = {
  entryPoints: ['src/main.jsx'],
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  loader: { '.png': 'dataurl' },
  define: { 'process.env.NODE_ENV': MODO_DEV ? '"development"' : '"production"' },
  minify: !MODO_DEV,
  sourcemap: MODO_DEV ? 'inline' : false,
  outdir: 'dist',
  write: false,
  logLevel: 'warning',
  plugins: [escribirHtml]
};

function iniciarServidor(puerto) {
  const servidor = createServer((req, res) => {
    if (req.url === '/__reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      });
      clientesSSE.add(res);
      req.on('close', () => clientesSSE.delete(res));
      return;
    }

    try {
      const html = readFileSync(SALIDA, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Compilando...');
    }
  });

  servidor.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      iniciarServidor(puerto + 1);
    } else {
      console.error(err);
    }
  });

  servidor.listen(puerto, () => {
    console.log(`\n  ➜  Servidor local:  http://localhost:${puerto}`);
    console.log(`  ➜  Archivo directo: ${SALIDA}\n`);
  });
}

if (MODO_DEV) {
  const ctx = await context(opciones);
  await ctx.watch();
  iniciarServidor(PUERTO_BASE);
} else {
  await build(opciones);
}
