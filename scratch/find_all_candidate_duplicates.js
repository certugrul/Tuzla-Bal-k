const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

console.log('Total items:', items.length);

// Let's find all pairs of items where names share a common stem or one is a portion variant
function getStem(name) {
  return name
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\b(az|tek|duble|küçük|büyük|1\.5|porsiyon|adet|şişe|kadeh|dilim|kg|fıçı|soğuk|sıcak|klasik|özel|geleneksel|usulü|meşhur|taze)\b/gi, '')
    .replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('tr-TR')
    .trim();
}

const stemMap = new Map();
items.forEach(item => {
  const stem = getStem(item.name);
  if (!stem || stem.length < 3) return;
  if (!stemMap.has(stem)) stemMap.set(stem, []);
  stemMap.get(stem).push(item);
});

const candidateDuplicates = Array.from(stemMap.entries())
  .filter(([stem, list]) => list.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

console.log('Candidate duplicate groups count:', candidateDuplicates.length);
candidateDuplicates.forEach(([stem, list]) => {
  console.log(`\nStem: "${stem}" (${list.length} items):`);
  list.forEach(i => console.log(`  - [${i.id}] "${i.name}" (${i.category}) - ${i.price} ₺ [${i.rawName}]`));
});
