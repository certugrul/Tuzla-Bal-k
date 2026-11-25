const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

function norm(str) {
  return (str || '')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

console.log('=== ALL MEZELER ===');
const mezeler = items.filter(i => i.category === 'mezeler');
mezeler.forEach(i => {
  console.log(`${i.id} | ${i.rawName.padEnd(25)} | ${i.name}`);
});

console.log('\n=== ALL ARA SICAKLAR ===');
const araSicaklar = items.filter(i => i.category === 'ara-sicaklar');
araSicaklar.forEach(i => {
  console.log(`${i.id} | ${i.rawName.padEnd(25)} | ${i.name}`);
});
