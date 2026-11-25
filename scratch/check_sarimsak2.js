const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const pos = content.indexOf('SARIMSAK IZGARA');
if (pos !== -1) {
  console.log(content.slice(pos, pos + 400));
}
