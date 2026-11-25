const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

// Check near-duplicate names (e.g. ignoring case, punctuation, numbers, "az porsiyon", etc.)
function simplify(str) {
  return str
    .toLocaleLowerCase('tr-TR')
    .replace(/\b(az\s+porsiyon|porsiyon|adet|şişe|kadeh|cl|gr|kg|tam|yarım|dub|tek)\b/g, '')
    .replace(/[^a-zçğıöşü0-9]/g, '')
    .trim();
}

const map = new Map();
items.forEach(item => {
  const s = simplify(item.name);
  if (!s) return;
  if (!map.has(s)) map.set(s, []);
  map.get(s).push(item);
});

const nearDups = Array.from(map.entries()).filter(([k, v]) => v.length > 1);
console.log('Near duplicates count (simplified base name):', nearDups.length);
nearDups.forEach(([k, list]) => {
  console.log(`\nBase: "${k}" (${list.length} items):`);
  list.forEach(i => console.log(`  - [${i.id}] ${i.name} (${i.category}) - ${i.price} ₺`));
});
