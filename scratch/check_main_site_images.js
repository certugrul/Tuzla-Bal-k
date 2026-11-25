const fs = require('fs');

if (fs.existsSync('js/data.js')) {
  const content = fs.readFileSync('js/data.js', 'utf8');
  console.log('js/data.js length:', content.length);
  const regex = /["']?image["']?\s*:\s*["']([^"']+)["']/g;
  let match;
  const images = new Set();
  while ((match = regex.exec(content)) !== null) {
    images.add(match[1]);
  }
  console.log('Images in js/data.js (' + images.size + '):', Array.from(images).slice(0, 20));
}

if (fs.existsSync('js/main.js')) {
  const content = fs.readFileSync('js/main.js', 'utf8');
  console.log('js/main.js length:', content.length);
  const regex = /["']?image["']?\s*:\s*["']([^"']+)["']/g;
  let match;
  const images = new Set();
  while ((match = regex.exec(content)) !== null) {
    images.add(match[1]);
  }
  console.log('Images in js/main.js (' + images.size + '):', Array.from(images).slice(0, 20));
}
