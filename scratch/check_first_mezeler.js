const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const mezeler = items.filter(i => i.category === 'mezeler');
console.log('--- FIRST 40 MEZELER ---');
mezeler.slice(0, 40).forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.id}] ${m.name} (${m.rawName}) - ${m.price} ₺`);
});
