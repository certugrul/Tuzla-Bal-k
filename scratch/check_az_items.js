const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const azItems = items.filter(i => /\b(az|az porsiyon)\b/i.test(i.name) || /\b(az|az porsiyon)\b/i.test(i.rawName || ''));
console.log('Items with "Az" or "Az Porsiyon" in name:', azItems.length);
azItems.forEach(i => console.log(`  - [${i.id}] ${i.name} (${i.category}) - ${i.price} ₺`));
