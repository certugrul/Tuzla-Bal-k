const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const duplicateIdsToRemove = new Set([
  'ST00166', 'ST00771', 'ST00570', 'ST00738', 'ST00413', 'ST00202', 'ST00046', 'ST00125',
  'ST00189', 'ST00223', 'ST00010', 'ST00027', 'ST00026', 'ST00028', 'ST00029', 'ST00030',
  'ST00031', 'ST00032', 'ST00034', 'ST00035', 'ST00036', 'ST00033', 'ST00141', 'ST00142',
  'ST00143', 'ST00144', 'ST00145', 'ST00146', 'ST00147', 'ST00148', 'ST00149', 'ST00052',
  'ST00056', 'ST00177', 'ST00185', 'ST00208', 'ST00221', 'ST00013', 'ST00004', 'ST00014',
  'ST00772', 'ST00015', 'ST00016'
]);

const cleaned = items.filter(i => !duplicateIdsToRemove.has(i.id));

// Check name overlaps in the cleaned list
const map = new Map();
cleaned.forEach(item => {
  const n = item.name.toLocaleLowerCase('tr-TR').trim();
  if (!map.has(n)) map.set(n, []);
  map.get(n).push(item);
});

const remainingDups = Array.from(map.entries()).filter(([k, v]) => v.length > 1);
console.log('Remaining exact name duplicates in cleaned list:', remainingDups.length);
remainingDups.forEach(([k, list]) => console.log(k, list.map(i => i.id)));
