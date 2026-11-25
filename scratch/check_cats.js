const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const matches = [...code.matchAll(/category:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const unique = [...new Set(matches)];
console.log('Categories in script.js items:', unique);

const fineSectionsMatch = code.match(/const FINE_SECTIONS = \[([\s\S]*?)\];/);
if (fineSectionsMatch) {
  console.log('FINE_SECTIONS:\n', fineSectionsMatch[0]);
}
