const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

// Let's strip standard portion/size indicators from food items:
// (Az), (Az Porsiyon), (Porsiyon), (1.5 Porsiyon), (Büyük Porsiyon), (Büyük), (Tek Kişilik), (Adet), (Tek Dilim)
function cleanDishName(name) {
  return name
    .replace(/\s*\((az|az porsiyon|porsiyon|1\.5 porsiyon|1\.5|büyük porsiyon|büyük|tek kişilik|adet|tek dilim|tek|duble|sade)\)/gi, '')
    .trim();
}

const cleanedMap = new Map();
items.forEach(item => {
  const cName = cleanDishName(item.name).toLocaleLowerCase('tr-TR');
  if (!cleanedMap.has(cName)) cleanedMap.set(cName, []);
  cleanedMap.get(cName).push(item);
});

const portionDups = Array.from(cleanedMap.entries()).filter(([k, v]) => v.length > 1);
console.log('Dishes appearing multiple times with portion annotations:', portionDups.length);
portionDups.forEach(([k, list]) => {
  console.log(`\n"${k}" (${list.length} occurrences):`);
  list.forEach(i => console.log(`  - [${i.id}] ${i.name} [cat: ${i.category}] (${i.price} ₺) [raw: ${i.rawName}]`));
});
