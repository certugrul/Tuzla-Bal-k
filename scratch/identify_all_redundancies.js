const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

console.log('Total items before deduplication:', items.length);

// Let's identify the redundant items:
const toRemove = new Set();
const removalReasons = [];

function markRemove(id, reason) {
  toRemove.add(id);
  removalReasons.push({ id, reason });
}

// 1. Exact duplicates:
// Hellimli Levrek Şiş: ST00166 (Adet) vs ST00167 (Porsiyon) -> both 550 TL. Keep ST00167 (Porsiyon, rename to Hellimli Levrek Şiş), remove ST00166.
markRemove('ST00166', 'Hellimli Levrek Şiş (Adet) duplicate of ST00167 (Porsiyon)');

// Kuzu Beyin Söğüş: ST00771 (Soğuk Kuzu Beyin Söğüş - 400 TL) duplicate of ST00741 (Kuzu Beyin Söğüş - 400 TL).
markRemove('ST00771', 'Soğuk Kuzu Beyin Söğüş duplicate of ST00741 Kuzu Beyin Söğüş');

// Sıcak Biber Tarator (Az) in mezeler: ST00027 (275 TL in mezeler) is a duplicate of ST00679 (Sıcak Biber Tarator - 400 TL in ara-sicaklar).
markRemove('ST00027', 'Sıcak Biber Tarator (Az) in mezeler is duplicate of ara-sicaklar ST00679');

// 2. All "(Az)" / "(Az Porsiyon)" POS entries that duplicate standard dishes:
const azDuplicates = [
  { azId: 'ST00028', mainId: 'ST00050', name: 'Uskumru Çirozu (Az) -> main: Uskumru Çirozu (Porsiyon)' },
  { azId: 'ST00030', mainId: 'ST00139', name: 'Enginar Kalbi (Az Porsiyon) -> main: Zeytinyağlı Enginar Kalbi' },
  { azId: 'ST00029', mainId: 'ST00053', name: 'Deniz Mahsulleri Salatası (Az) -> main: Deniz Mahsulleri Salatası' },
  { azId: 'ST00031', mainId: 'ST00074', name: 'Karides Söğüş (Az) -> main: Karides Söğüş' },
  { azId: 'ST00032', mainId: 'ST00091', name: 'Levrek Marin (Az) -> main: Klasik Hardallı Levrek Marin' },
  { azId: 'ST00026', mainId: 'ST00021', name: 'Ahtapot Salatası (Az Porsiyon) -> main: Ege Ahtapot Salatası' },
  { azId: 'ST00035', mainId: 'ST00116', name: 'Soslu Hamsi Marin (Az) -> main: Özel Soslu Hamsi Marin' },
  { azId: 'ST00034', mainId: 'ST00096', name: 'Midye Salatası (Az Porsiyon) -> main: Zeytinyağlı Midye Salatası' },
  { azId: 'ST00036', mainId: 'ST00122', name: 'Şevket-i Bostan (Az Porsiyon) -> main: Zeytinyağlı Şevket-i Bostan' },
  { azId: 'ST00033', mainId: null, name: 'Günün Mezesi (Az Porsiyon) - generic POS adisyon item' },
  { azId: 'ST00141', mainId: 'ST00162', name: 'Deniz Mahsulleri Güveç (Az) -> main: Deniz Mahsulleri Güveç' },
  { azId: 'ST00142', mainId: 'ST00209', name: 'Yoğurtlu Ev Patatesi (Az) -> main: Yoğurtlu Soslu Ev Patatesi' },
  { azId: 'ST00143', mainId: 'ST00176', name: 'Kalamar Tava (Az Porsiyon) -> main: Tuzla Usulü Kalamar Tava' },
  { azId: 'ST00144', mainId: 'ST00186', name: 'Levrekli Şevket-i Bostan (Az) -> main: Levrekli Şevket-i Bostan' },
  { azId: 'ST00145', mainId: 'ST00182', name: 'Kaşarlı Kremalı Mantar Güveç (Az) -> main: Fırında Kaşarlı Mantar' },
  { azId: 'ST00146', mainId: 'ST00193', name: 'Çıtır Patates Kızartması (Az) -> main: Parmak Patates Kızartması' },
  { azId: 'ST00147', mainId: 'ST00198', name: 'Sıcak Ege Otları (Az) -> main: Sıcak Ege Otları Tabağı' },
  { azId: 'ST00148', mainId: 'ST00668', name: 'Tereyağlı Karides (Az Porsiyon) -> main: Tereyağında Sarımsaklı Karides' },
  { azId: 'ST00149', mainId: 'ST00207', name: 'Yaprak Ciğer (Az Porsiyon) -> main: Edirne Usulü Çıtır Yaprak Ciğer' },
];

azDuplicates.forEach(d => markRemove(d.azId, d.name));

// 3. All "1.5 Porsiyon" / extra portion duplicate entries that duplicate the main dish:
const extraPortionDuplicates = [
  { id: 'ST00056', name: 'Enginar Kalbi (1.5 Porsiyon) -> duplicate of ST00139 / ST00055' },
  { id: 'ST00052', name: 'Deniz Mahsulleri Salatası (1.5 Porsiyon) -> duplicate of ST00053' },
  { id: 'ST00177', name: 'Kalamar Tava (1.5 Porsiyon) -> duplicate of ST00176' },
  { id: 'ST00185', name: 'Levrekli Şevket-i Bostan (1.5 Porsiyon) -> duplicate of ST00186' },
  { id: 'ST00208', name: 'Yaprak Ciğer (1.5 Porsiyon) -> duplicate of ST00207' },
  { id: 'ST00221', name: 'Kuzu Kaburga (1.5 Porsiyon) -> duplicate of ST00220' },
  { id: 'ST00046', name: 'Zeytinyağlı Çanak Enginar (Adet - 175TL) duplicate of ST00047 Çanak Enginar (Porsiyon - 350TL)' },
  { id: 'ST00125', name: 'Torik Lakerda (Tek Dilim - 225TL) duplicate of ST00090 Boğaz Torik Lakerdası (650TL)' },
  { id: 'ST00202', name: 'Patates Tava (Tek Kişilik - 250TL) duplicate of ST00193 Parmak Patates Kızartması' },
  { id: 'ST00189', name: 'Midye Tava Şiş (Adet - 175TL) duplicate of ST00190 Midye Tava (Porsiyon - 450TL)' },
];

extraPortionDuplicates.forEach(d => markRemove(d.id, d.name));

// 4. Duplicate single-portion salads that duplicate the full salad:
const saladDuplicates = [
  { id: 'ST00013', name: 'Çoban Salata (Tek Kişilik) -> duplicate of ST00001 Klasik Çoban Salatası' },
  { id: 'ST00004', name: 'Gavurdağı Salatası (Tek Kişilik) -> duplicate of ST00003 Cevizli Gavurdağı Salatası' },
  { id: 'ST00014', name: 'Kaşık Salatası (Tek Kişilik) -> duplicate of ST00006 Antep Usulü Kaşık Salatası' },
  { id: 'ST00772', name: 'Roka Domates Peynir (Tek Kişilik) -> duplicate of ST00778 Roka Domates Peynir Salatası' },
];

saladDuplicates.forEach(d => markRemove(d.id, d.name));

console.log('\nTotal redundant/duplicate items to remove:', toRemove.size);
removalReasons.forEach(r => console.log(`  - [${r.id}] ${r.reason}`));
