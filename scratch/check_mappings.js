const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

// Helper to sanitize turkish strings
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

console.log('--- SALATALAR MATCHING ---');
const salataItems = items.filter(i => i.category === 'salatalar');
salataItems.forEach(i => {
  console.log(`${i.id} | ${i.name} (raw: ${i.rawName})`);
});

console.log('\n--- MEZELER SAMPLE MATCHING ---');
const mezeItems = items.filter(i => i.category === 'mezeler');
console.log(`Total mezeler: ${mezeItems.length}`);

console.log('\n--- ARA SICAKLAR SAMPLE MATCHING ---');
const araItems = items.filter(i => i.category === 'ara-sicaklar');
console.log(`Total ara sicaklar: ${araItems.length}`);
