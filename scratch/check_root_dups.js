const fs = require('fs');

const rootData = fs.readFileSync('menu-data.js', 'utf8');
const itemsMatch = rootData.match(/MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
if (itemsMatch) {
  const rootItems = JSON.parse(itemsMatch[1]);
  console.log('Root menu items count:', rootItems.length);

  const nameMap = new Map();
  rootItems.forEach(item => {
    const norm = (item.name || '').trim().toLocaleLowerCase('tr-TR');
    if (!nameMap.has(norm)) nameMap.set(norm, []);
    nameMap.get(norm).push(item);
  });
  const dups = Array.from(nameMap.entries()).filter(([k, v]) => v.length > 1);
  console.log('Root duplicate names count:', dups.length);
  dups.forEach(([k, list]) => {
    console.log(`Root Dup: "${k}" (${list.length})`);
  });
}
