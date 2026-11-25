const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const mesrubatlar = items.filter(i => i.category === 'mesrubatlar');
console.log('--- MESRUBATLAR (' + mesrubatlar.length + ') ---');
mesrubatlar.forEach(m => console.log(`  - [${m.id}] ${m.name} (${m.rawName}) - ${m.price} ₺`));

const cerezler = items.filter(i => i.category === 'cerezler');
console.log('\n--- CEREZLER (' + cerezler.length + ') ---');
cerezler.forEach(c => console.log(`  - [${c.id}] ${c.name} (${c.rawName}) - ${c.price} ₺`));
