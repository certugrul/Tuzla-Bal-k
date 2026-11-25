const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('activeMenuItems') || l.includes('MENU_ITEMS') || l.includes('menuItems')) {
    console.log(`${idx + 1}: ${l.slice(0, 100)}`);
  }
});
