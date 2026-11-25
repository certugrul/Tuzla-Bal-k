const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');

// Parse window.MENU_ITEMS
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
if (!itemsMatch) {
  console.error('Could not find window.MENU_ITEMS');
  process.exit(1);
}

const items = JSON.parse(itemsMatch[1]);
console.log('Total items in menu-data.js:', items.length);

// 1. Check duplicate by ID
const idCounts = {};
items.forEach(item => {
  idCounts[item.id] = (idCounts[item.id] || 0) + 1;
});
const duplicateIds = Object.entries(idCounts).filter(([id, count]) => count > 1);
console.log('Duplicate IDs count:', duplicateIds.length);
if (duplicateIds.length > 0) {
  console.log('Duplicate IDs samples:', duplicateIds.slice(0, 10));
}

// 2. Check duplicate by normalized Name (lowercased, trimmed)
const nameMap = new Map();
items.forEach((item, idx) => {
  const norm = item.name.trim().toLowerCase();
  if (!nameMap.has(norm)) {
    nameMap.set(norm, []);
  }
  nameMap.get(norm).push({ idx, id: item.id, name: item.name, price: item.price, category: item.category });
});

const duplicateNames = Array.from(nameMap.entries()).filter(([name, list]) => list.length > 1);
console.log('Duplicate Names count:', duplicateNames.length);
console.log('Total duplicate item instances:', duplicateNames.reduce((acc, [_, list]) => acc + list.length, 0));

console.log('\n--- First 20 Duplicate Names Details ---');
duplicateNames.slice(0, 20).forEach(([name, list]) => {
  console.log(`\nName: "${name}" (${list.length} occurrences):`);
  list.forEach(i => console.log(`  - [${i.id}] category: ${i.category}, price: ${i.price}`));
});
