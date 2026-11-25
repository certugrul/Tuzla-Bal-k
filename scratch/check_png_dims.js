const fs = require('fs');

function getPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf.readUInt32BE(0) !== 0x89504E47) {
    return { error: 'Not a PNG' };
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

['roka.PNG', 'cibes.png', 'fava.png', 'ezinepeyniri.PNG'].forEach(f => {
  const p = 'menu-app/images/mezeler/' + f;
  const pSalata = 'menu-app/images/salata/' + f;
  const target = fs.existsSync(p) ? p : (fs.existsSync(pSalata) ? pSalata : null);
  if (target) {
    console.log(target, getPngDimensions(target));
  }
});
