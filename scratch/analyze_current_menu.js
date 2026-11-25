const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

console.log('Total items in menu-app currently:', items.length);

const byCat = {};
items.forEach(i => {
  byCat[i.category] = byCat[i.category] || { total: 0, withLocalImage: 0, items: [] };
  byCat[i.category].total++;
  if (i.isLocalImage) byCat[i.category].withLocalImage++;
  byCat[i.category].items.push(i);
});

for (const [cat, data] of Object.entries(byCat)) {
  console.log(`\nCategory: ${cat} -> Total: ${data.total}, With Local Image: ${data.withLocalImage}`);
}
