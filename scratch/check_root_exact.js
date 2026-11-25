const fs = require('fs');

const rootData = fs.readFileSync('menu-data.js', 'utf8');
const itemsMatch = rootData.match(/MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const rootItems = JSON.parse(itemsMatch[1]);

// Let's check if there are duplicate items in rootItems based on rawName or name
console.log('Total root items:', rootItems.length);

// Let's check if any name contains duplicate portions or exact duplicate
const mapRaw = new Map();
rootItems.forEach(i => {
  const k = i.name.trim();
  if (!mapRaw.has(k)) mapRaw.set(k, []);
  mapRaw.get(k).push(i);
});

console.log('Exact duplicate names in root:', Array.from(mapRaw.entries()).filter(([k, v]) => v.length > 1));
