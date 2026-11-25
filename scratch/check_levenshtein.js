const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const similarPairs = [];
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = items[i];
    const b = items[j];
    const na = a.name.toLocaleLowerCase('tr-TR').trim();
    const nb = b.name.toLocaleLowerCase('tr-TR').trim();
    if (Math.abs(na.length - nb.length) <= 3) {
      const dist = levenshtein(na, nb);
      if (dist <= 2) {
        similarPairs.push({ a, b, dist });
      }
    }
  }
}

console.log('Very similar pairs count (edit distance <= 2):', similarPairs.length);
similarPairs.forEach(({ a, b, dist }) => {
  console.log(`- [${a.id}] "${a.name}" (${a.category}) VS [${b.id}] "${b.name}" (${b.category}) -> dist: ${dist}`);
});
