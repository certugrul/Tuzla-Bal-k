const fs = require('fs');

// Read PNG header to get width and height
const buf = fs.readFileSync('menu-app/images/tuzlabalikyazilogo.png');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`PNG Dimensions: ${width}x${height}, Aspect Ratio: ${(width/height).toFixed(2)}`);
