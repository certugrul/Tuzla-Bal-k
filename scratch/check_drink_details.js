const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const drinkCategories = ['saraplar', 'biralar', 'ithal-ickiler', 'rakilar'];
const drinkItems = items.filter(i => drinkCategories.includes(i.category));

// Strip sizes like 20 cl, 35 cl, 50 cl, 70 cl, 100 cl, 33 cl, 50 cl, Şişe, Kadeh, etc.
const drinkRootMap = new Map();
drinkItems.forEach(item => {
  const root = item.name
    .replace(/\b(20|35|50|70|100|33)\s*cl\b/gi, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\b(şişe|kadeh|fıçı|duble|tek)\b/gi, '')
    .toLocaleLowerCase('tr-TR')
    .trim();
  if (!drinkRootMap.has(root)) drinkRootMap.set(root, []);
  drinkRootMap.get(root).push(item);
});

// Let's also check if there are exact identical names in rawName or name
console.log('Drink items count:', drinkItems.length);
// Let's check if any drinks have the exact same name and size
const exactDrinkName = new Map();
drinkItems.forEach(item => {
  const n = item.name.trim().toLocaleLowerCase('tr-TR');
  if (!exactDrinkName.has(n)) exactDrinkName.set(n, []);
  exactDrinkName.get(n).push(item);
});
console.log('Exact drink duplicate names:', Array.from(exactDrinkName.entries()).filter(([k, v]) => v.length > 1));

// Let's check beer items
const beers = items.filter(i => i.category === 'biralar');
console.log('\n--- ALL BEERS (' + beers.length + ') ---');
beers.forEach(b => console.log(`  - [${b.id}] ${b.name} (${b.price} ₺)`));

// Let's check wines
const wines = items.filter(i => i.category === 'saraplar');
console.log('\n--- ALL WINES (' + wines.length + ') ---');
wines.forEach(w => console.log(`  - [${w.id}] ${w.name} (${w.price} ₺)`));

// Let's check cocktails & imports
const cocktails = items.filter(i => i.category === 'ithal-ickiler');
console.log('\n--- ALL COCKTAILS/IMPORTS (' + cocktails.length + ') ---');
cocktails.forEach(c => console.log(`  - [${c.id}] ${c.name} (${c.price} ₺)`));
