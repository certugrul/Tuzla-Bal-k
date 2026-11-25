const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const tatlilar = items.filter(i => i.category === 'tatlilar');
console.log('--- ALL TATLILAR (' + tatlilar.length + ') ---');
tatlilar.forEach((t, idx) => {
  console.log(`${idx + 1}. [${t.id}] ${t.name} (${t.rawName}) - ${t.price} ₺`);
});
