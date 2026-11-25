const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push({
        fullPath,
        relPath: path.relative('menu-app', fullPath).replace(/\\/g, '/'),
        filename: file,
        size: stat.size
      });
    }
  }
  return fileList;
}

const images = getAllFiles('menu-app/images');
console.log('Total files in menu-app/images:', images.length);

const byFolder = {};
images.forEach(img => {
  const parts = img.relPath.split('/');
  const folder = parts.length > 2 ? parts[1] : 'root';
  byFolder[folder] = byFolder[folder] || [];
  byFolder[folder].push(img);
});

for (const [folder, list] of Object.entries(byFolder)) {
  console.log(`\n--- Folder: ${folder} (${list.length} images) ---`);
  list.forEach(i => console.log(`  ${i.relPath} (${i.size} bytes)`));
}
