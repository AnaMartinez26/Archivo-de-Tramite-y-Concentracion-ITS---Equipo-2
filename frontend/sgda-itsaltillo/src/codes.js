// Generadores de QR y código de barras (Code 39) como SVG
import QRCode from 'qrcode';

const xml = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// QR -> Promise<string svg>
export const qrSvg = (texto, size = 150) =>
  QRCode.toString(String(texto), { type: 'svg', margin: 1, width: size, errorCorrectionLevel: 'M' });

// Code 39: n = elemento angosto, w = elemento ancho. 9 elementos por caracter (barra, espacio, barra...)
const C39 = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn',
  'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn',
  'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn',
  'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn', 'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn',
  'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
  'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '*': 'nwnnwnwnn',
  '$': 'nwnwnwnnn', '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn'
};

// Devuelve un string SVG (síncrono). Los caracteres que Code 39 no soporta se cambian por "-".
export function code39Svg(texto, { alto = 60, angosto = 2, ancho = 5 } = {}) {
  const limpio = String(texto).toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '-');
  const data = `*${limpio}*`;
  let x = 10; // zona de silencio
  let rects = '';
  for (let i = 0; i < data.length; i++) {
    const pat = C39[data[i]];
    for (let j = 0; j < 9; j++) {
      const w = pat[j] === 'w' ? ancho : angosto;
      if (j % 2 === 0) rects += `<rect x="${x}" y="0" width="${w}" height="${alto}" fill="#000"/>`;
      x += w;
    }
    x += angosto; // espacio entre caracteres
  }
  const total = x - angosto + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${alto + 18}" width="${total}" height="${alto + 18}" role="img" aria-label="Código de barras ${xml(limpio)}">` +
    `<rect width="${total}" height="${alto + 18}" fill="#fff"/>${rects}` +
    `<text x="${total / 2}" y="${alto + 13}" font-family="monospace" font-size="12" text-anchor="middle" fill="#000">${xml(limpio)}</text></svg>`;
}
