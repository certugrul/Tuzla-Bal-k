const fs = require('fs');
const zlib = require('zlib');

// Quick parse of PNG IDAT to see color values
const buf = fs.readFileSync('menu-app/images/tuzlabalikyazilogo.png');
// Let's check color type at byte 25
const colorType = buf[25];
console.log('Color type:', colorType); // 6 = RGBA, 3 = Indexed, etc.
