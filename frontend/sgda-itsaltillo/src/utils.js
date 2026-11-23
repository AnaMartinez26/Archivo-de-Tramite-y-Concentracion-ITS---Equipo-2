// Utilidades compartidas: impresión (sin ventanas emergentes) y descarga de CSV

export const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export const fmtFecha = f => {
  if (!f) return '—';
  const d = new Date(f);
  return isNaN(d) ? String(f) : d.toLocaleDateString('es-MX');
};

const PRINT_CSS = `
  *{box-sizing:border-box}
  body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px}
  h1{font-size:20px;margin:0 0 4px;color:#1E3A5F}
  h2{font-size:15px;margin:18px 0 6px;color:#1E3A5F}
  p,small{margin:2px 0}
  table{border-collapse:collapse;width:100%;margin-top:8px;font-size:12px}
  th,td{border:1px solid #888;padding:5px 7px;text-align:left;vertical-align:top}
  th{background:#e8eef5}
  .head{border-bottom:2px solid #1E3A5F;padding-bottom:8px;margin-bottom:12px}
  .firmas{display:flex;gap:40px;margin-top:70px}
  .firmas div{flex:1;border-top:1px solid #111;text-align:center;padding-top:4px;font-size:12px}
  .marbete{border:2px solid #1E3A5F;border-radius:6px;padding:14px;max-width:420px}
  .marbete .r{display:flex;justify-content:space-between;gap:10px;border-bottom:1px dotted #aaa;padding:4px 0;font-size:13px}
  .marbete .codes{display:flex;gap:16px;align-items:center;justify-content:space-around;margin-top:12px}
  .marbete svg{max-width:100%;height:auto}
  @page{margin:14mm}
`;

// Imprime un HTML usando un iframe oculto (no lo bloquea el navegador como un window.open)
export function printHtml(title, body) {
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true');
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(f);
  const d = f.contentWindow.document;
  d.open();
  d.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${PRINT_CSS}</style></head><body>${body}</body></html>`);
  d.close();
  setTimeout(() => {
    try {
      f.contentWindow.focus();
      f.contentWindow.print();
    } finally {
      setTimeout(() => f.remove(), 1500);
    }
  }, 300);
}

// Descarga un CSV compatible con Excel (UTF-8 con BOM)
export function downloadCsv(nombre, encabezados, filas) {
  const celda = x => `"${String(x ?? '').replace(/"/g, '""')}"`;
  const csv = '﻿' + [encabezados, ...filas].map(r => r.map(celda).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
