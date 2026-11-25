const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

function listFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = dir + '/' + file;
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(listFiles(full));
    else results.push(full.replace(/\\\\/g, '/').replace('menu-app/', ''));
  });
  return results;
}

const allImages = listFiles('menu-app/images');
const usedImages = new Set(items.map(i => i.image));

console.log('Total images in folder:', allImages.length);
console.log('\n--- UNMAPPED / UNUSED IMAGES IN menu-app/images/ ---');
allImages.forEach(img => {
  if (!usedImages.has(img)) {
    console.log(img);
  }
});

console.log('\n--- MEZELER WITH LOCAL IMAGES ---');
items.filter(i => i.category === 'mezeler' && i.isLocalImage).forEach(i => {
  console.log(`  ${i.id} | ${i.name} -> ${i.image}`);
});

console.log('\n--- ARA SICAKLAR WITH LOCAL IMAGES ---');
items.filter(i => i.category === 'ara-sicaklar' && i.isLocalImage).forEach(i => {
  console.log(`  ${i.id} | ${i.name} -> ${i.image}`);
});
