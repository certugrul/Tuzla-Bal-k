const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const salatalar = items.filter(i => i.category === 'salatalar');
console.log('--- ALL SALATALAR (' + salatalar.length + ') ---');
salatalar.forEach((s, idx) => {
  console.log(`${idx + 1}. [${s.id}] ${s.name} (${s.rawName}) - ${s.price} ₺`);
});
