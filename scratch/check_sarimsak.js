const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const pos = content.indexOf('Izgara Sarımsak');
if (pos !== -1) {
  console.log(content.slice(pos - 100, pos + 300));
}
