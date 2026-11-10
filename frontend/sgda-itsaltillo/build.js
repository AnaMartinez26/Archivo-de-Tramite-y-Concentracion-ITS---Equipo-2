// Compila todo src/ en un solo archivo: sgda-itsaltillo.html (no necesitas ejecutarlo para USAR el sistema,
// solo cuando modifiques el código). Uso:  npm install  &&  npm run build
import {build} from 'esbuild';
import {writeFileSync} from 'node:fs';
const out=await build({entryPoints:['src/main.jsx'],bundle:true,minify:true,format:'iife',jsx:'automatic',
  nodePaths:['node_modules'],loader:{'.png':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},outdir:'dist',write:false,logLevel:'warning'});
let js='',css='';
for(const f of out.outputFiles){if(f.path.endsWith('.js'))js=f.text;else if(f.path.endsWith('.css'))css=f.text}
const html=`<!doctype html>
<html lang="es">
<head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>SGDA – Instituto Tecnológico de Saltillo</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/g,'<\\/script')}</script>
</body>
</html>`;
writeFileSync('sgda-itsaltillo.html',html);
console.log('Listo: sgda-itsaltillo.html ('+Math.round(html.length/1024)+' KB)');
