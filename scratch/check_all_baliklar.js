const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const baliklar = items.filter(i => i.category === 'baliklar');
console.log('--- ALL BALIKLAR (' + baliklar.length + ') ---');
baliklar.forEach((b, idx) => {
  console.log(`${idx + 1}. [${b.id}] ${b.name} (${b.rawName}) - ${b.price} ₺`);
});
