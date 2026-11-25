const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS.filter(i => i.category === 'rakilar');

console.log('Total rakilar:', items.length);

// Group by brand base
const brands = {};
items.forEach(i => {
  // extract brand base by removing cl sizes
  const clean = i.name.replace(/\b(20|35|50|70|75|100)\s*cl\b/gi, '').replace(/\(.*\)/g, '').trim();
  brands[clean] = brands[clean] || [];
  brands[clean].push(i);
});

console.log('Unique Rakı Brand Lines:', Object.keys(brands).length);
for (const [brand, list] of Object.entries(brands)) {
  const sizes = list.map(x => x.name.match(/\b\d+\s*cl\b/i)?.[0] || 'other').join(', ');
  console.log(`- ${brand.padEnd(35)} (${list.length} sizes: ${sizes})`);
}
