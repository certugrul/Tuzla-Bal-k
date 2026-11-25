const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

// Let's examine each category for potential duplicate or redundant items
const byCat = {};
items.forEach(i => {
  byCat[i.category] = byCat[i.category] || [];
  byCat[i.category].push(i);
});

for (const [cat, list] of Object.entries(byCat)) {
  console.log(`\n=== Category: ${cat} (${list.length} items) ===`);
  // Look for any word overlaps, identical descriptions, or identical images
  const imgMap = {};
  list.forEach(item => {
    if (item.isLocalImage) {
      imgMap[item.image] = (imgMap[item.image] || []);
      imgMap[item.image].push(item);
    }
  });
  const dupImgs = Object.entries(imgMap).filter(([k, v]) => v.length > 1);
  if (dupImgs.length > 0) {
    console.log(`  Items sharing the same local image (${dupImgs.length}):`);
    dupImgs.forEach(([img, subList]) => {
      console.log(`    ${img}:`, subList.map(s => `${s.id} - ${s.name} (${s.price}₺)`));
    });
  }
}
