const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const rakilar = items.filter(i => i.category === 'rakilar');
console.log('Total rakilar:', rakilar.length);

const rakiNames = new Map();
rakilar.forEach(r => {
  const norm = r.name.toLocaleLowerCase('tr-TR').trim();
  if (!rakiNames.has(norm)) rakiNames.set(norm, []);
  rakiNames.get(norm).push(r);
});

const rakiDups = Array.from(rakiNames.entries()).filter(([k, v]) => v.length > 1);
console.log('Exact duplicate raki names:', rakiDups.length);
rakiDups.forEach(([k, list]) => console.log(k, list.map(i => i.id)));
