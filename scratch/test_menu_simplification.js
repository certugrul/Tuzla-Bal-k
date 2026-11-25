const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;

console.log('Original items total:', items.length);

// 1. MEZELER: Strictly keep only items with dedicated photos
const mezeler = items.filter(i => i.category === 'mezeler' && i.isLocalImage);
// Deduplicate portion/name variants within mezeler
const mezeExcludeIds = new Set([
  'ST00075', // Dilimlenmiş Soğuk Karpuz (keep Karpuz & Ezine Peynir ST00076)
  'ST00077', // Kırkağaç Kavunu (keep Kavun & Ezine Peynir ST00078)
  'ST00137', // Ege Kırma Zeytin Tabağı (keep Hatay Kırma Zeytin ST00138)
  'ST00055', // Ege Enginar Kalbi Salatası (keep Zeytinyağlı Enginar Kalbi ST00139)
  'ST00088', // Biber Taratorlu Kuru Cacık (keep Süzme Kuru Cacık ST00086)
  'ST00025', // Yoğurtlu Patlıcan Üzeri Atom (keep Acılı Atom ST00024)
  'ST00087'  // Atomlu Kuru Cacık (keep Süzme Kuru Cacık ST00086)
]);
const finalMezeler = mezeler.filter(i => !mezeExcludeIds.has(i.id));

// 2. ARA SICAKLAR: Strictly keep only items with dedicated photos
const araSicaklar = items.filter(i => i.category === 'ara-sicaklar' && i.isLocalImage);
// Deduplicate preparation variants within ara sicaklar
const araExcludeIds = new Set([
  'ST00205', // Sade Tereyağlı Karides (Mantarsız) (keep Tereyağında Sarımsaklı Karides ST00668)
  'ST00203', // Kaşarlı Tereyağlı Karides (keep Tereyağında Sarımsaklı Karides ST00668)
  'ST00196', // Fırında Sıcak Köz Patlıcan (keep Kaşarlı Sıcak Köz Patlıcan ST00197)
  'ST00163'  // Deniz Mahsulleri Güveç (Domatesli & Tereyağlı) (keep Kremalı & Kaşarlı ST00162)
]);
const finalAraSicaklar = araSicaklar.filter(i => !araExcludeIds.has(i.id));

// 3. BALIKLAR: Remove all Lokum & Parça duplicates
const balikExcludeIds = new Set([
  'ST00848', // ADABEYİ LOKUM
  'ST00845', // FENER LOKUM
  'ST00844', // GRANYÖZ LOKUM
  'ST00735', // GRANYÖZ PARÇA
  'ST00850', // KIRLANGIÇ LOKUM
  'ST00851', // KOFANA LOKUM
  'ST00788', // KOFANA PARÇA
  'ST00849', // LAHOS LOKUM
  'ST00740', // LAHOS PARÇA
  'ST00846', // LEVREK LOKUM
  'ST00847', // LEVREK TAKOZ
  'ST00852', // MERCAN LOKUM
  'ST00790', // KALKAN PARÇA
  'ST00792'  // YILAN BALIĞI PARÇA
]);
const finalBaliklar = items.filter(i => i.category === 'baliklar' && !balikExcludeIds.has(i.id));

// 4. ETLER: Remove fast-food & redundant items
const etExcludeIds = new Set([
  'ST00218', // EKMEK ARASI KÖFTE
  'ST00226', // KÖFTE PATATES
  'ST00215', // DANA BONFİLE PORSİYON (keep Tereyağlı Dana Bonfile Lokum ST00214)
  'ST00217', // DANA BONFİLE MANTARLI (keep Tereyağlı Dana Bonfile Lokum ST00214)
  'ST00236', // TAVUK BONFİLE (keep Tavuk Şiş ST00242)
  'ST00238'  // TAVUK İNCİK (keep Tavuk Şiş ST00242)
]);
const finalEtler = items.filter(i => i.category === 'etler' && !etExcludeIds.has(i.id));

// 5. SALATALAR: Keep clean distinct salads
const salataExcludeIds = new Set([
  'ST00012', // SALATALIK SÖĞÜŞ
  'ST00011', // R.D.S (keep R.D.P ST00778)
  'ST00007', // KAŞIK SALATA PEYNİRLİ (keep Kaşık Salata ST00006)
  'ST00009', // MEVSİM SALATA PEYNİRLİ (keep Mevsim Salata ST00008)
  'ST00019'  // YEŞİL SALATA PEYNİRLİ (keep Yeşil Salata ST00018)
]);
const finalSalatalar = items.filter(i => i.category === 'salatalar' && !salataExcludeIds.has(i.id));

// 6. TATLILAR: Remove duplicates & casual snacks
const tatliExcludeIds = new Set([
  'ST00352', // FIRIN HELVA (keep Dondurmalı Fırın Helva ST00346)
  'ST00353', // FIRIN HELVA CEVİZLİ (keep Dondurmalı Fırın Helva ST00346)
  'ST00355', // FIRIN SÜTLAÇ DONDURMALI (keep Fırın Sütlaç ST00354)
  'ST00364', // KAZANDİBİ DONDURMALI (keep Kazandibi ST00363)
  'ST00358', // KABAK TATLISI (keep Kaymaklı Kabak Tatlısı ST00359)
  'ST00362', // KAŞIK AYVA (keep Kaymaklı Cevizli Ayva Tatlısı ST00339)
  'ST00774', // İNCİR TATLISI KALEM (keep Sütlü İncir ST00862)
  'ST00343', // BALLI CEVİZLİ MUZ
  'ST00373', // SERPME MEYVE (keep Meyve Tabağı ST00367)
  'ST00338'  // ANANAS
]);
const finalTatlilar = items.filter(i => i.category === 'tatlilar' && !tatliExcludeIds.has(i.id));

// 7. SARAPLAR: Remove POS generic 'ŞİŞE GRUBU' entries
const finalSaraplar = items.filter(i => i.category === 'saraplar' && !i.rawName.includes('ŞİŞE GRUBU'));

// 8. BIRALAR: Remove minor variants
const biraExcludeIds = new Set([
  'ST00332', // MİLLER KÜÇÜK
  'ST00322', // CARLSBERG LUNA 50 CL
  'ST00799'  // TUBORG ICE
]);
const finalBiralar = items.filter(i => i.category === 'biralar' && !biraExcludeIds.has(i.id));

// 9. ITHAL ICKILER: keep
const finalIthal = items.filter(i => i.category === 'ithal-ickiler');

// 10. RAKILAR: Remove obscure/internal buttons
const rakiExcludeIds = new Set([
  'ST00269', // KARAR KADEH RAKI
  'ST00795', // MTAİLAT ARAK 20 CL
  'ST00796', // MTAİLAT ARAK RAKI 70 CL
  'ST00535', // SAKİ DELUXE 35 CL
  'ST00754', // KULÜP DELUXE 35 CL
  'ST00755'  // KULÜP DELUXE 70 CL
]);
const finalRakilar = items.filter(i => i.category === 'rakilar' && !rakiExcludeIds.has(i.id));

// 11. MESRUBATLAR & CEREZLER
const mesrubatExcludeIds = new Set([
  'ST00252', // K. ŞALGAM ACILI
  'ST00734', // K. ŞALGAM ACISIZ
  'ST00246', // BÜYÜK ENERJİ İÇECEĞİ
  'ST00247', // BÜYÜK M. SUYU
  'ST00245', // BÜYÜK ELMA SUYU
  'ST00262', // SODA - LİMON
  'ST00257'  // NESCAFE
]);
const finalMesrubatlar = items.filter(i => i.category === 'mesrubatlar' && !mesrubatExcludeIds.has(i.id));
const finalCerezler = items.filter(i => i.category === 'cerezler');

const allFinal = [
  ...finalMezeler,
  ...finalAraSicaklar,
  ...finalBaliklar,
  ...finalEtler,
  ...finalSalatalar,
  ...finalRakilar,
  ...finalSaraplar,
  ...finalBiralar,
  ...finalIthal,
  ...finalTatlilar,
  ...finalMesrubatlar,
  ...finalCerezler
];

console.log('\n--- SIMPLIFIED & CURATED MENU SUMMARY ---');
console.log(`Soğuk Mezeler (Only with Photos!): ${finalMezeler.length}`);
console.log(`Ara Sıcaklar  (Only with Photos!): ${finalAraSicaklar.length}`);
console.log(`Taze Salatalar (Cleaned):          ${finalSalatalar.length}`);
console.log(`Mevsim Balıkları (Cleaned):        ${finalBaliklar.length}`);
console.log(`Kırmızı Et & Izgara (Cleaned):     ${finalEtler.length}`);
console.log(`Rakı Kavı (Cleaned):               ${finalRakilar.length}`);
console.log(`Şaraplar (Cleaned):                ${finalSaraplar.length}`);
console.log(`Biralar (Cleaned):                 ${finalBiralar.length}`);
console.log(`İthal İçkiler:                     ${finalIthal.length}`);
console.log(`Tatlı Kapanışlar (Cleaned):        ${finalTatlilar.length}`);
console.log(`Meşrubatlar (Cleaned):             ${finalMesrubatlar.length}`);
console.log(`Çerezler:                          ${finalCerezler.length}`);
console.log(`-----------------------------------------`);
console.log(`TOTAL REFINED MENU ITEMS:          ${allFinal.length} (was ${items.length})`);
