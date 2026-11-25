const fs = require('fs');
const files = fs.readdirSync('img');
files.forEach(f => {
  const stat = fs.statSync('img/' + f);
  console.log(`${f.padEnd(25)} | size: ${(stat.size / 1024).toFixed(1)} KB`);
});
