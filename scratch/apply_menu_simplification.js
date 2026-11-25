const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;
const categories = window.MENU_CATEGORIES;

// 1. MEZELER: Strictly keep only items with dedicated photos
const mezeler = items.filter(i => i.category === 'mezeler' && i.isLocalImage);
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
const araExcludeIds = new Set([
  'ST00205', // Sade Tereyağlı Karides (Mantarsız)
  'ST00203', // Kaşarlı Tereyağlı Karides
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
  'ST00215', // DANA BONFİLE PORSİYON
  'ST00217', // DANA BONFİLE MANTARLI
  'ST00236', // TAVUK BONFİLE
  'ST00238'  // TAVUK İNCİK
]);
const finalEtler = items.filter(i => i.category === 'etler' && !etExcludeIds.has(i.id));

// 5. SALATALAR: Keep clean distinct salads (all with local images)
const salataExcludeIds = new Set([
  'ST00012', // SALATALIK SÖĞÜŞ
  'ST00011', // R.D.S
  'ST00007', // KAŞIK SALATA PEYNİRLİ
  'ST00009', // MEVSİM SALATA PEYNİRLİ
  'ST00019'  // YEŞİL SALATA PEYNİRLİ
]);
const finalSalatalar = items.filter(i => i.category === 'salatalar' && !salataExcludeIds.has(i.id));

// 6. TATLILAR: Remove duplicates & casual snacks
const tatliExcludeIds = new Set([
  'ST00352', // FIRIN HELVA
  'ST00353', // FIRIN HELVA CEVİZLİ
  'ST00355', // FIRIN SÜTLAÇ DONDURMALI
  'ST00364', // KAZANDİBİ DONDURMALI
  'ST00358', // KABAK TATLISI
  'ST00362', // KAŞIK AYVA
  'ST00774', // İNCİR TATLISI KALEM
  'ST00343', // BALLI CEVİZLİ MUZ
  'ST00373', // SERPME MEYVE
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

const curatedItems = [
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

const content = `/**
 * Tuzla Balık Soyak - Sadeleştirilmiş Gastronomi Menüsü
 * Meze ve ara sıcaklarda yalnızca gerçek fotoğraflı ürünler yer alır.
 * Mükerrer, porsiyon türevleri ve adisyon ara kodları elenmiştir.
 * Toplam ${curatedItems.length} seçkin lezzet.
 */

window.MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};

window.MENU_ITEMS = ${JSON.stringify(curatedItems, null, 2)};
`;

fs.writeFileSync('menu-app/menu-data.js', content, 'utf8');
console.log(`Successfully written menu-app/menu-data.js with ${curatedItems.length} curated items.`);
