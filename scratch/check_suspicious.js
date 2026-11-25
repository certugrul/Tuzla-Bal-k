const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const suspicious = items.filter(i => {
  const n = (i.name + ' ' + (i.rawName || '')).toLocaleLowerCase('tr-TR');
  return /\b(servis|kuver|pişirme|ikram|paket|boş|iptal)\b/i.test(n);
});
console.log('Suspicious adisyon items:', suspicious.length);
suspicious.forEach(i => console.log(`  - [${i.id}] ${i.name} (${i.category}) [raw: ${i.rawName}]`));
