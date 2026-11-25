const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

// Let's check non-drinks (mezeler, ara-sicaklar, baliklar, etler, salatalar, tatlilar)
const foodCategories = ['mezeler', 'ara-sicaklar', 'baliklar', 'etler', 'salatalar', 'tatlilar'];
const foodItems = items.filter(i => foodCategories.includes(i.category));

console.log('Total food items:', foodItems.length);

// Group food items by root name (strip parenthetical notes like (Az Porsiyon), (Adet), (Porsiyon), etc.)
const rootMap = new Map();
foodItems.forEach(item => {
  const root = item.name
    .replace(/\s*\([^)]*\)/g, '')
    .toLocaleLowerCase('tr-TR')
    .trim();
  if (!rootMap.has(root)) rootMap.set(root, []);
  rootMap.get(root).push(item);
});

const multipleRoots = Array.from(rootMap.entries()).filter(([k, v]) => v.length > 1);
console.log('Food dishes with multiple variants (e.g. portion vs normal):', multipleRoots.length);
multipleRoots.forEach(([k, list]) => {
  console.log(`\nDish: "${k}" (${list.length} variants):`);
  list.forEach(i => console.log(`  - [${i.id}] ${i.name} (${i.category}) - ${i.price} ₺`));
});
