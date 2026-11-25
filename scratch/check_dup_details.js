const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

// 1. RawName duplicates
const rawNameMap = new Map();
items.forEach(item => {
  const norm = (item.rawName || '').trim().toLocaleLowerCase('tr-TR');
  if (!norm) return;
  if (!rawNameMap.has(norm)) rawNameMap.set(norm, []);
  rawNameMap.get(norm).push(item);
});

const duplicateRaw = Array.from(rawNameMap.entries()).filter(([k, v]) => v.length > 1);
console.log('Duplicate rawName count (tr-TR lower):', duplicateRaw.length);
duplicateRaw.slice(0, 10).forEach(([k, list]) => {
  console.log(`Raw: "${k}" (${list.length}):`, list.map(i => `${i.id}: ${i.name} (${i.category})`));
});

// 2. Turkish lowercased name duplicates
const trNameMap = new Map();
items.forEach(item => {
  const norm = item.name.trim().toLocaleLowerCase('tr-TR');
  if (!trNameMap.has(norm)) trNameMap.set(norm, []);
  trNameMap.get(norm).push(item);
});
const duplicateTr = Array.from(trNameMap.entries()).filter(([k, v]) => v.length > 1);
console.log('Duplicate name count with tr-TR lower:', duplicateTr.length);
duplicateTr.forEach(([k, list]) => {
  console.log(`TR Name: "${k}" (${list.length}):`, list.map(i => `${i.id}: ${i.name} (${i.category})`));
});

// 3. Normalized stripped name (strip punctuation, spaces, az porsiyon, etc.)
const strippedMap = new Map();
items.forEach(item => {
  // normalize: remove parentheses, extra spaces, accents/case
  const norm = item.name
    .toLocaleLowerCase('tr-TR')
    .replace(/[()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!strippedMap.has(norm)) strippedMap.set(norm, []);
  strippedMap.get(norm).push(item);
});
const duplicateStripped = Array.from(strippedMap.entries()).filter(([k, v]) => v.length > 1);
console.log('Duplicate stripped count:', duplicateStripped.length);
duplicateStripped.slice(0, 10).forEach(([k, list]) => {
  console.log(`Stripped: "${k}" (${list.length}):`, list.map(i => `${i.id}: ${i.name} (${i.category})`));
});
