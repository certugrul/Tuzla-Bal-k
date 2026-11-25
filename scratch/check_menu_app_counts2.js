const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const counts = {};
const regex = /"category":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  counts[m[1]] = (counts[m[1]] || 0) + 1;
}
console.log('Category item counts in menu-data.js:', counts);
