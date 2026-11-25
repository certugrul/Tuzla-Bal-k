const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const etler = items.filter(i => i.category === 'etler');
console.log('--- ALL ETLER (' + etler.length + ') ---');
etler.forEach((e, idx) => {
  console.log(`${idx + 1}. [${e.id}] ${e.name} (${e.rawName}) - ${e.price} ₺`);
});
