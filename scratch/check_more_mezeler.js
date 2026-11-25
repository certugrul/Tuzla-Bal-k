const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const mezeler = items.filter(i => i.category === 'mezeler');
console.log('--- MEZELER 41 to 150 ---');
mezeler.slice(40, 150).forEach((m, idx) => {
  console.log(`${idx + 41}. [${m.id}] ${m.name} (${m.rawName}) - ${m.price} ₺`);
});
