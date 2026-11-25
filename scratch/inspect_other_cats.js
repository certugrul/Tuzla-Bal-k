const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

function listCat(cat) {
  console.log(`\n=================== ${cat.toUpperCase()} (${items.filter(i => i.category === cat).length}) ===================`);
  items.filter(i => i.category === cat).forEach(i => {
    console.log(`${i.id} | ${i.price ? (i.price + '₺').padStart(6) : '  Kg/Gün'} | ${i.rawName.padEnd(28)} | ${i.name}`);
  });
}

listCat('salatalar');
listCat('baliklar');
listCat('etler');
listCat('tatlilar');
