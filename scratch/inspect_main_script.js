const fs = require('fs');
const content = fs.readFileSync('script.js', 'utf8');
console.log('script.js length:', content.length);
const matches = content.match(/image|img|photo|placeholder/gi);
console.log('Occurrences in script.js:', matches ? matches.length : 0);
// Look for where images are referenced or assigned
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('image') || l.includes('img') || l.includes('menu-data')) {
    console.log((idx+1) + ': ' + l.trim().substring(0, 100));
  }
});
