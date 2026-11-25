const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const ara = items.filter(i => i.category === 'ara-sicaklar');
console.log('--- ALL ARA SICAKLAR (' + ara.length + ') ---');
ara.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.id}] ${m.name} (${m.rawName}) - ${m.price} ₺`);
});
