const fs = require('fs');

global.window = {};
require('../menu-app/menu-data.js');
const items = window.MENU_ITEMS;
const categories = window.MENU_CATEGORIES;

const verifiedIdToImage = {
  // === SALATALAR ===
  'ST00001': 'images/salata/coban.PNG',           // Klasik Çoban Salatası
  'ST00002': 'images/salata/peynirlimevsim.jpg',   // Ezine Peynirli Çoban Salatası
  'ST00003': 'images/salata/gavurdagı.jpg',       // Cevizli Gavurdağı Salatası
  'ST00005': 'images/salata/istanbul.PNG',        // İstanbul Salatası
  'ST00006': 'images/salata/kasik.jpg',           // Antep Usulü Kaşık Salatası
  'ST00007': 'images/salata/kasik.jpg',           // Peynirli Kaşık Salatası
  'ST00008': 'images/salata/mevsim.jpg',          // Mevsim Salatası
  'ST00009': 'images/salata/peynirlimevsim.jpg',   // Peynirli Mevsim Salatası
  'ST00778': 'images/salata/roka.PNG',            // Roka Domates Peynir Salatası
  'ST00011': 'images/salata/roka.PNG',            // Roka Domates Salatalık Salatası
  'ST00018': 'images/salata/yesil.PNG',           // Akdeniz Yeşil Salatası
  'ST00019': 'images/salata/yesilpeynirli.jpg',   // Peynirli Akdeniz Salatası

  // === MEZELER ===
  'ST00108': 'images/salata/roka.PNG',            // Taze Roka Söğüş
  'ST00075': 'images/mezeler/karpuzpeynir.jpg',   // Dilimlenmiş Soğuk Karpuz
  'ST00076': 'images/mezeler/karpuzpeynir.jpg',   // Karpuz & Ezine Peynir İkilisi
  'ST00077': 'images/mezeler/kavunpeynir.jpg',    // Kırkağaç Kavunu
  'ST00078': 'images/mezeler/kavunpeynir.jpg',    // Kavun & Ezine Peynir İkilisi
  'ST00105': 'images/mezeler/ezinepeyniri.PNG',   // Ezine Beyaz Peynir
  'ST00045': 'images/mezeler/cibes.png',          // Zeytinyağlı Cibez Otu
  'ST00058': 'images/mezeler/fava.png',           // Klasik Fava (Sade)
  'ST00059': 'images/mezeler/fava.png',           // Tekmil Fava
  'ST00065': 'images/mezeler/havuctarator.png',   // Havuç Tarator
  'ST00066': 'images/mezeler/haydari.png',        // Köz Nane ve Dereotlu Haydari
  'ST00067': 'images/mezeler/humus.png',          // Klasik Humus
  'ST00068': 'images/mezeler/humus.png',          // Pancarlı Humus
  'ST00081': 'images/mezeler/kopoglu.png',        // Köpoğlu Mancası
  'ST00086': 'images/mezeler/kurucacik.png',      // Süzme Kuru Cacık
  'ST00087': 'images/mezeler/kurucacik.png',      // Atomlu Kuru Cacık
  'ST00088': 'images/mezeler/kurucacik.png',      // Biber Taratorlu Kuru Cacık
  'ST00134': 'images/mezeler/yogurtlupatlican.png', // Yoğurtlu Köz Patlıcan
  'ST00136': 'images/mezeler/yogurlusemiz.jpg',   // Yoğurtlu Semizotu
  'ST00137': 'images/mezeler/zeytinsalatasi.jpg', // Ege Kırma Zeytin Tabağı
  'ST00138': 'images/mezeler/zeytinsalatasi.jpg', // Hatay Kırma Zeytin Salatası
  'ST00020': 'images/mezeler/ahtapotcarpaccio.png', // Ahtapot Carpaccio
  'ST00021': 'images/mezeler/ahtapotsalatasi.png',  // Ege Ahtapot Salatası
  'ST00856': 'images/mezeler/antibiyotik.jpg',    // Antibiyotik (Şifa Mezesi)
  'ST00023': 'images/mezeler/arnavutcigeri.png',  // Soğuk Arnavut Ciğeri
  'ST00024': 'images/mezeler/atom.png',           // Acılı Atom
  'ST00025': 'images/mezeler/atom.png',           // Yoğurtlu Patlıcan Üzeri Atom
  'ST00749': 'images/mezeler/avokadolukarides.png', // Avokadolu Karides Salatası
  'ST00741': 'images/mezeler/beyinsogus.png',     // Kuzu Beyin Söğüş
  'ST00040': 'images/mezeler/biberborani.png',    // Köz Kırmızı Biber Borani
  'ST00678': 'images/mezeler/bibertarator.png',   // Soğuk Biber Tarator
  'ST00044': 'images/mezeler/bruksellahanasi.png', // Zeytinyağlı Brüksel Lahanası
  'ST00047': 'images/mezeler/canakenginaradet.png', // Zeytinyağlı Çanak Enginar
  'ST00784': 'images/mezeler/cundameze.jpg',      // Cunda Ezmesi
  'ST00054': 'images/mezeler/denizborulcesi.png', // Zeytinyağlı Deniz Börülcesi
  'ST00053': 'images/mezeler/denizmahsullerisalatasi.png', // Zengin Deniz Mahsulleri Salatası
  'ST00770': 'images/mezeler/dilsogus.png',       // Soğuk Dana Dil Söğüş
  'ST00744': 'images/mezeler/egekarmasi.png',     // Ege Otları Karma Tabağı
  'ST00768': 'images/mezeler/eksilimantar.png',   // Ekşili Köz Patlıcan / Ekşili Mantar
  'ST00139': 'images/mezeler/enginarkalbi.PNG',   // Zeytinyağlı Enginar Kalbi
  'ST00055': 'images/mezeler/enginarkalbi.PNG',   // Ege Enginar Kalbi Salatası
  'ST00061': 'images/mezeler/giritezme.png',      // Klasik Girit Ezmesi
  'ST00063': 'images/mezeler/peynirligirit.png',  // Zeytinli Girit Peyniri
  'ST00050': 'images/mezeler/isliciroz.png',      // Uskumru Çirozu
  'ST00070': 'images/mezeler/izgarazeytin.jpg',   // Közde Izgara Zeytin
  'ST00079': 'images/mezeler/kayakorugu.png',     // Zeytinyağlı Kaya Koruğu
  'ST00080': 'images/mezeler/komplesogus.png',    // Lüks Serpme Söğüş Tabağı
  'ST00090': 'images/mezeler/lakerda.png',        // Boğaz Torik Lakerdası
  'ST00091': 'images/mezeler/levrekmarin.png',    // Klasik Hardallı Levrek Marin
  'ST00769': 'images/mezeler/lubnanmeze.png',     // Lübnan Mezesi (Mütebbel)
  'ST00120': 'images/mezeler/saksuka.png',        // Akdeniz Usulü Şakşuka
  'ST00121': 'images/mezeler/saksuklısüzmeyogurt.jpg', // Yoğurtlu Şakşuka
  'ST00794': 'images/mezeler/somongrawlax.PNG',   // İskandinav Somon Gravlax
  'ST00116': 'images/mezeler/sosluhamsi.png',     // Özel Soslu Hamsi Marin
  'ST00118': 'images/mezeler/subyesalatasi.png',   // Ege Sübye Salatası

  // === ARA SICAKLAR ===
  'ST00140': 'images/arasicaklar/ahtapotizgarabacak.png', // Izgara Ahtapot Bacak
  'ST00142': 'images/arasicaklar/ahtapotşiş.jpg',       // Izgara Ahtapot Şiş
  'ST00730': 'images/arasicaklar/kremaliahtapot.jpg',   // Kremalı Mantarlı Ahtapot Güveç
  'ST00731': 'images/arasicaklar/tereyagliahtapot.jpg', // Tereyağında Ahtapot
  'ST00859': 'images/arasicaklar/balikbeyti.png',       // Balık Beyti Sarma
  'ST00438': 'images/arasicaklar/balikkavurma.jpg',     // Sacda Balık Kavurma
  'ST00855': 'images/arasicaklar/balikkokorec.png',     // Meşhur Balık Kokoreç
  'ST00154': 'images/arasicaklar/begendiliahtapot.png',  // Beğendili Izgara Ahtapot
  'ST00156': 'images/arasicaklar/begendililevreksarma.png', // Beğendili Levrek Sarma
  'ST00157': 'images/arasicaklar/beğendili karides.jpg', // Beğendili Tereyağlı Karides
  'ST00155': 'images/arasicaklar/babykalamardolma.png', // Bebek Kalamar Dolma Şiş
  'ST00679': 'images/arasicaklar/sicakbibertarator.jpg', // Sıcak Biber Tarator
  'ST00162': 'images/arasicaklar/denizmahsulleriguvec.png', // Deniz Mahsulleri Güveç (Kremalı & Kaşarlı)
  'ST00163': 'images/arasicaklar/denizmahsulleriguvec.png', // Deniz Mahsulleri Güveç (Domatesli & Tereyağlı)
  'ST00164': 'images/arasicaklar/denizmahsullusevketibostan.png', // Kremalı Deniz Mahsullü Şevketi Bostan
  'ST00167': 'images/arasicaklar/hellimlilevreksis.png', // Hellimli Levrek Şiş
  'ST00169': 'images/arasicaklar/izgaraköypeyniri.jpg', // Kömürde Izgara Hellim
  'ST00170': 'images/arasicaklar/kurudomatessıcak.jpg',  // Güveçte Kuru Domatesli Peynir
  'ST00670': 'images/arasicaklar/kremaliistiridyemantari.png', // Kremalı Kaşarlı İstiridye Mantar
  'ST00671': 'images/arasicaklar/tereyagliistiridyemantar.png', // Tereyağında İstiridye Mantarı
  'ST00172': 'images/arasicaklar/jumboshotadet.png',    // Jumbo Karides Kokteyl Shot
  'ST00175': 'images/arasicaklar/kalamarizgarasisadet.png', // Kalamar Şiş Izgara
  'ST00176': 'images/arasicaklar/kalamartava.png',      // Tuzla Usulü Kalamar Tava
  'ST00178': 'images/arasicaklar/karidesguvec.png',     // Kaşarlı Karides Güveç
  'ST00179': 'images/arasicaklar/karidesmanti.png',     // El Açması Karides Mantı
  'ST00180': 'images/arasicaklar/karidessis.jpg',       // Karides Şiş (Adet)
  'ST00184': 'images/arasicaklar/kremalikasarlisevketibostan.jpg', // Kremalı Kaşarlı Şevket-i Bostan
  'ST00186': 'images/arasicaklar/sevketibostanlilevrek.png', // Levrekli Şevket-i Bostan
  'ST00190': 'images/arasicaklar/midyetavasisporsiyon.png',  // Çıtır Midye Tava
  'ST00775': 'images/arasicaklar/sicakhumus.png',       // Tereyağlı Sıcak Humus
  'ST00779': 'images/arasicaklar/sucukluhumus.jpg',     // Kasap Sucuklu Sıcak Humus
  'ST00196': 'images/arasicaklar/sicakpatlican.png',    // Fırında Sıcak Köz Patlıcan
  'ST00197': 'images/arasicaklar/sicakpatlican.png',    // Kaşarlı Sıcak Köz Patlıcan Güveç
  'ST00198': 'images/arasicaklar/sicakottabagi.png',    // Sıcak Ege Otları Tabağı
  'ST00668': 'images/arasicaklar/tereyaglikarides.png',  // Tereyağında Sarımsaklı Karides
  'ST00203': 'images/arasicaklar/tereyaglikarides.png',  // Kaşarlı Tereyağlı Karides
  'ST00205': 'images/arasicaklar/tereyaglikarides.png',  // Sade Tereyağlı Karides
  'ST00207': 'images/arasicaklar/yaprakciger.png',      // Edirne Usulü Çıtır Yaprak Ciğer
  'ST00209': 'images/arasicaklar/annepatates.png'       // Yoğurtlu Soslu Ev Patatesi
};

let exactCount = 0;
let fallbackCount = 0;

items.forEach(item => {
  if (verifiedIdToImage[item.id]) {
    item.image = verifiedIdToImage[item.id];
    item.isLocalImage = true;
    exactCount++;
  } else {
    item.isLocalImage = false;
    fallbackCount++;
    const cat = item.category;
    if (cat === 'mezeler') {
      item.image = 'images/mezeler/egekarmasi.png';
    } else if (cat === 'ara-sicaklar') {
      item.image = 'images/arasicaklar/denizmahsulleriguvec.png';
    } else if (cat === 'baliklar') {
      item.image = 'images/balik_default.jpg';
    } else if (cat === 'salatalar') {
      item.image = 'images/salata/mevsim.jpg';
    } else if (cat === 'etler') {
      item.image = 'images/etler_default.jpg';
    } else if (cat === 'rakilar') {
      item.image = 'images/raki_default.jpg';
    } else if (cat === 'saraplar' || cat === 'biralar' || cat === 'ithal-ickiler') {
      item.image = 'images/cilingir_default.jpg';
    } else if (cat === 'tatlilar') {
      if (/baklava|katmer|kadayıf/i.test(item.name)) {
        item.image = 'images/baklava_default.jpg';
      } else {
        item.image = 'images/tatli_default.jpg';
      }
    } else {
      item.image = 'images/cilingir_default.jpg';
    }
  }
});

console.log(`Updated all items: ${items.length}`);
console.log(`Exact 1-to-1 dish photos: ${exactCount}`);
console.log(`Category fallback photos: ${fallbackCount}`);

// Verify: Any item has Unsplash?
const unsplashItems = items.filter(i => i.image && i.image.includes('unsplash'));
console.log(`Items with Unsplash: ${unsplashItems.length} (must be 0!)`);

// Verify specific problem items from user complaint:
const testItems = [
  'Orkinos', 'Domates Salatalık Söğüş', 'Efe Yeşil Rakı', 'Balık Çorbası',
  'Yaprak Ciğer', 'Taze Roka Söğüş', 'Akdeniz Usulü Şakşuka', 'Ahtapot Carpaccio', 'Kalamar Tava'
];
testItems.forEach(query => {
  const match = items.find(i => i.name.includes(query) || i.rawName.includes(query));
  if (match) {
    console.log(`[VERIFY] ${match.name} (${match.category}) -> ${match.image} (local:${match.isLocalImage})`);
  }
});
