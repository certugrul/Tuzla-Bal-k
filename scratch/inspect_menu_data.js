const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
console.log('File size:', content.length);
console.log('First 500 chars:\n', content.slice(0, 500));
const pos = content.indexOf('window.MENU_ITEMS');
console.log('window.MENU_ITEMS pos:', pos);
if (pos !== -1) {
  console.log('After window.MENU_ITEMS:\n', content.slice(pos, pos + 400));
}
