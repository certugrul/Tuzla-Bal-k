const fs = require('fs');
const zlib = require('zlib');

// Extract IDAT chunks
const buf = fs.readFileSync('menu-app/images/tuzlabalikyazilogo.png');
let p = 8;
const idatChunks = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p);
  const type = buf.toString('ascii', p + 4, p + 8);
  if (type === 'IDAT') {
    idatChunks.push(buf.subarray(p + 8, p + 8 + len));
  }
  p += 8 + len + 4;
}
const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
console.log('Decompressed size:', decompressed.length);
// Read non-transparent pixels: width = 407, height = 74
// each scanline: 1 filter byte + 407 * 4 bytes = 1629 bytes
let nonTransparentCount = 0;
let sampleColors = [];
const stride = 1 + 407 * 4;
for (let y = 0; y < 74; y++) {
  const lineStart = y * stride + 1;
  for (let x = 0; x < 407; x++) {
    const idx = lineStart + x * 4;
    const r = decompressed[idx];
    const g = decompressed[idx+1];
    const b = decompressed[idx+2];
    const a = decompressed[idx+3];
    if (a > 50) {
      nonTransparentCount++;
      if (sampleColors.length < 5) {
        sampleColors.push({ r, g, b, a });
      }
    }
  }
}
console.log(`Non-transparent pixels: ${nonTransparentCount}, samples:`, sampleColors);
