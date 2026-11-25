const fs = require('fs');
const rootData = fs.readFileSync('menu-data.js', 'utf8');
const counts = {};
const regex = /"category":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(rootData)) !== null) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('Categories in root menu-data.js:', counts);
const catPos = rootData.indexOf('MENU_CATEGORIES');
console.log('catPos:', catPos);
if (catPos !== -1) {
  console.log(rootData.slice(catPos, catPos + 500));
}
