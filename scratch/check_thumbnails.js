const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

const firstFour = items.slice(0, 10);
firstFour.forEach(i => {
  const p = 'menu-app/' + i.image;
  const exists = fs.existsSync(p);
  const size = exists ? fs.statSync(p).size : 0;
  console.log(`${i.name} -> ${i.image} (exists: ${exists}, size: ${(size/1024).toFixed(1)} KB)`);
});
