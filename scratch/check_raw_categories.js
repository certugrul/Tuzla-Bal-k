const fs = require('fs');
const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');

const tatlilarMatch = content.match(/"category":\s*"tatlilar"[^}]+"rawCategory":\s*"([^"]+)"/);
console.log('Tatlilar sample rawCategory:', tatlilarMatch ? tatlilarMatch[1] : 'none');

const saraplarMatch = content.match(/"category":\s*"saraplar"[^}]+"rawCategory":\s*"([^"]+)"/);
console.log('Saraplar sample rawCategory:', saraplarMatch ? saraplarMatch[1] : 'none');

const biralarMatch = content.match(/"category":\s*"biralar"[^}]+"rawCategory":\s*"([^"]+)"/);
console.log('Biralar sample rawCategory:', biralarMatch ? biralarMatch[1] : 'none');

const ithalMatch = content.match(/"category":\s*"ithal-ickiler"[^}]+"rawCategory":\s*"([^"]+)"/);
console.log('Ithal sample rawCategory:', ithalMatch ? ithalMatch[1] : 'none');
