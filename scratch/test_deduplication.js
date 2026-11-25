const fs = require('fs');

const content = fs.readFileSync('menu-app/menu-data.js', 'utf8');
const itemsMatch = content.match(/window\.MENU_ITEMS\s*=\s*(\[[\s\S]*?\]);/);
const items = JSON.parse(itemsMatch[1]);

const duplicateIdsToRemove = new Set([
  // Exact duplicates / POS piece charges
  'ST00166', // Hellimli Levrek Şiş (Adet) -> keep ST00167
  'ST00771', // Soğuk Kuzu Beyin Söğüş -> keep ST00741
  'ST00570', // Karadeniz Usulü Çıtır Hamsi -> keep ST00414
  'ST00738', // Bütün Akya Izgara -> keep ST00803
  'ST00413', // Balık Pişirme Servisi (service fee, not food)
  'ST00202', // Patates Tava (Tek Kişilik) -> keep ST00193
  'ST00046', // Zeytinyağlı Çanak Enginar (Adet) -> keep ST00047
  'ST00125', // Torik Lakerda (Tek Dilim) -> keep ST00090
  'ST00189', // Midye Tava Şiş (Adet) -> keep ST00190
  'ST00223', // Kasap Köfte (Adet) -> keep ST00674
  'ST00010', // Roka Domates Salatalık Peynir (R.D.S.P) -> keep ST00778
  'ST00027', // Sıcak Biber Tarator (Az) in mezeler -> keep ST00679 in ara-sicaklar

  // "Az" / "Az Porsiyon" duplicates
  'ST00026', // Ahtapot Salatası (Az Porsiyon) -> keep ST00021
  'ST00028', // Uskumru Çirozu (Az) -> keep ST00050
  'ST00029', // Deniz Mahsulleri Salatası (Az) -> keep ST00053
  'ST00030', // Enginar Kalbi (Az Porsiyon) -> keep ST00139 / ST00055
  'ST00031', // Karides Söğüş (Az) -> keep ST00074
  'ST00032', // Levrek Marin (Az) -> keep ST00091
  'ST00034', // Midye Salatası (Az Porsiyon) -> keep ST00096
  'ST00035', // Soslu Hamsi Marin (Az) -> keep ST00116
  'ST00036', // Şevket-i Bostan (Az Porsiyon) -> keep ST00122
  'ST00033', // Günün Mezesi (Az Porsiyon) -> generic POS item
  'ST00141', // Deniz Mahsulleri Güveç (Az) -> keep ST00162
  'ST00142', // Yoğurtlu Ev Patatesi (Az) -> keep ST00209
  'ST00143', // Kalamar Tava (Az Porsiyon) -> keep ST00176
  'ST00144', // Levrekli Şevket-i Bostan (Az) -> keep ST00186
  'ST00145', // Kaşarlı Kremalı Mantar Güveç (Az) -> keep ST00182 / ST00670
  'ST00146', // Çıtır Patates Kızartması (Az) -> keep ST00193
  'ST00147', // Sıcak Ege Otları (Az) -> keep ST00198
  'ST00148', // Tereyağlı Karides (Az Porsiyon) -> keep ST00668
  'ST00149', // Yaprak Ciğer (Az Porsiyon) -> keep ST00207

  // "1.5 Porsiyon" duplicates
  'ST00052', // Deniz Mahsulleri Salatası (1.5 Porsiyon) -> keep ST00053
  'ST00056', // Enginar Kalbi (1.5 Porsiyon) -> keep ST00139
  'ST00177', // Kalamar Tava (1.5 Porsiyon) -> keep ST00176
  'ST00185', // Levrekli Şevket-i Bostan (1.5 Porsiyon) -> keep ST00186
  'ST00208', // Yaprak Ciğer (1.5 Porsiyon) -> keep ST00207
  'ST00221', // Kuzu Kaburga (1.5 Porsiyon) -> keep ST00220

  // "Tek Kişilik" salad duplicates
  'ST00013', // Çoban Salata (Tek Kişilik) -> keep ST00001
  'ST00004', // Gavurdağı Salatası (Tek Kişilik) -> keep ST00003
  'ST00014', // Kaşık Salatası (Tek Kişilik) -> keep ST00006
  'ST00772', // Roka Domates Peynir (Tek Kişilik) -> keep ST00778
  'ST00015', // Yeşil Salata (Tek Kişilik) -> keep ST00018
  'ST00016', // Peynirli Yeşil Salata (Tek Kişilik) -> keep ST00019
]);

console.log('Duplicate IDs designated for deletion:', duplicateIdsToRemove.size);

const cleanedItems = items.filter(item => !duplicateIdsToRemove.has(item.id));
console.log('Original count:', items.length);
console.log('Cleaned count:', cleanedItems.length);

// Also clean up any lingering "(Porsiyon)" in dish names that were left after removing (Az)
cleanedItems.forEach(item => {
  if (item.name === 'Hellimli Levrek Şiş (Porsiyon)') {
    item.name = 'Hellimli Levrek Şiş';
  }
  if (item.name === 'Uskumru Çirozu (Porsiyon)') {
    item.name = 'Uskumru Çirozu';
  }
  if (item.name === 'Karides Söğüş (Porsiyon)') {
    item.name = 'Karides Söğüş';
  }
  if (item.name === 'Zeytinyağlı Midye Salatası (Porsiyon)') {
    item.name = 'Zeytinyağlı Midye Salatası';
  }
  if (item.name === 'Çanak Enginar (Porsiyon)') {
    item.name = 'Zeytinyağlı Çanak Enginar';
  }
  if (item.name === 'Levrekli Şevket-i Bostan (Porsiyon)') {
    item.name = 'Levrekli Şevket-i Bostan';
  }
  if (item.name === 'Kuzu Kaburga (Porsiyon)') {
    item.name = 'Kuzu Kaburga';
  }
  if (item.name === 'Izgara Kasap Köfte (Porsiyon)') {
    item.name = 'Izgara Kasap Köfte';
  }
  if (item.name === 'Midye Tava (Porsiyon)') {
    item.name = 'Çıtır Midye Tava';
  }
});

// Category counts after deduplication:
const catCounts = {};
cleanedItems.forEach(i => {
  catCounts[i.category] = (catCounts[i.category] || 0) + 1;
});
console.log('Category item counts after deduplication:', catCounts);
