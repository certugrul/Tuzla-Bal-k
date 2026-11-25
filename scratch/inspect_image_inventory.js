const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

function listFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = dir + '/' + file;
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(listFiles(full));
    else results.push({ full: full.replace(/\\\\/g, '/'), rel: full.replace('menu-app/', '').replace(/\\\\/g, '/'), file });
  });
  return results;
}

const allImages = listFiles('menu-app/images');
console.log('Total images found in menu-app/images:', allImages.length);

// Let's print all image files by folder
const byFolder = {};
allImages.forEach(img => {
  const parts = img.rel.split('/');
  const folder = parts.length > 1 ? parts[1] : 'root';
  byFolder[folder] = byFolder[folder] || [];
  byFolder[folder].push(img.file);
});

for (const [folder, files] of Object.entries(byFolder)) {
  console.log(`\n=== FOLDER: ${folder} (${files.length} files) ===`);
  files.sort().forEach(f => console.log('  ' + f));
}
