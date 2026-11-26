// Tuzla Balık Soyak - Dinamik Menü Veritabanı
// Backoffice üzerinden güncellendi

var MENU_CATEGORIES = {
  "mezeler": {
    "tr": "Soğuk Mezeler & Ege Otları",
    "icon": "fa-seedling",
    "count": 150
  },
  "ara-sicaklar": {
    "tr": "Ara Sıcaklar & Deniz Ürünleri",
    "icon": "fa-fire-burner",
    "count": 97
  },
  "baliklar": {
    "tr": "Taze Mevsim Balıkları",
    "icon": "fa-fish-fins",
    "count": 46
  },
  "etler": {
    "tr": "Kırmızı Et & Izgaralar",
    "icon": "fa-drumstick-bite",
    "count": 25
  },
  "salatalar": {
    "tr": "Bahçe & Deniz Salataları",
    "icon": "fa-bowl-rice",
    "count": 21
  },
  "rakilar": {
    "tr": "Rakı Kavı (Tüm Boylar)",
    "icon": "fa-wine-bottle",
    "count": 128
  },
  "saraplar": {
    "tr": "Şarap Kavı",
    "icon": "fa-wine-glass",
    "count": 45
  },
  "biralar": {
    "tr": "Bira Çeşitleri",
    "icon": "fa-beer-mug-empty",
    "count": 21
  },
  "ithal-ickiler": {
    "tr": "Kokteyller & İthal İçkiler",
    "icon": "fa-martini-glass-citrus",
    "count": 36
  },
  "tatlilar": {
    "tr": "Tatlılar & Taze Meyveler",
    "icon": "fa-cake-candles",
    "count": 28
  },
  "mesrubatlar": {
    "tr": "Meşrubatlar & Sıcak İçecekler",
    "icon": "fa-mug-hot",
    "count": 25
  },
  "cerezler": {
    "tr": "Çerezler & Rakı Yanı",
    "icon": "fa-cookie",
    "count": 6
  }
};

var MENU_ITEMS = [
  {
    "id": "ST00108",
    "raw_name": "ROKA SÖĞÜŞ",
    "name": "Taze Roka Söğüş",
    "price": 100,
    "category": "mezeler",
    "description": "Bahçeden taze toplanmış çıtır roka yaprakları, sızma zeytinyağı ve limon ile.",
    "badge": "Ege Yeşillikleri",
    "is_signature": false
  },
  {
    "id": "ST00111",
    "raw_name": "SADECE SÖĞÜŞ",
    "name": "Domates Salatalık Söğüş",
    "price": 100,
    "category": "mezeler",
    "description": "İnce dilimlenmiş tarla domatesi ve çıtır salatalık.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00112",
    "raw_name": "SARIMSAK IZGARA",
    "name": "Izgara Sarımsak",
    "price": 100,
    "category": "mezeler",
    "description": "Köz ateşinde yumuşatılmış, zeytinyağlı ızgara sarımsak dişleri.",
    "badge": "Meze",
    "is_signature": false
  },
  {
    "id": "ST00075",
    "raw_name": "KARPUZ",
    "name": "Dilimlenmiş Soğuk Karpuz",
    "price": 150,
    "category": "mezeler",
    "description": "Mevsiminde buz gibi dilimlenmiş ferahlatıcı karpuz.",
    "badge": "Meyve",
    "is_signature": false
  },
  {
    "id": "ST00077",
    "raw_name": "KAVUN",
    "name": "Kırkağaç Kavunu",
    "price": 150,
    "category": "mezeler",
    "description": "Rakı sofralarının vazgeçilmezi, tatlı ve sulu kavun dilimleri.",
    "badge": "Rakı Eşlikçisi",
    "is_signature": false
  },
  {
    "id": "ST00105",
    "raw_name": "PEYNİR",
    "name": "Ezine Beyaz Peynir",
    "price": 150,
    "category": "mezeler",
    "description": "Tam yağlı, olgunlaştırılmış Çanakkale Ezine koyun/keçi peyniri.",
    "badge": "Rakı Eşlikçisi",
    "is_signature": false
  },
  {
    "id": "ST00033",
    "raw_name": "AZ MEZE",
    "name": "Günün Mezesi (Az Porsiyon)",
    "price": 175,
    "category": "mezeler",
    "description": "Tadım porsiyonunda taze günlük meze seçeneği.",
    "badge": "Tadımlık",
    "is_signature": false
  },
  {
    "id": "ST00046",
    "raw_name": "ÇANAK ENGİNAR ADET",
    "name": "Zeytinyağlı Çanak Enginar (Adet)",
    "price": 175,
    "category": "mezeler",
    "description": "Havuç, patates ve bezelyeli garnitürle doldurulmuş taze çanak enginar.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00034",
    "raw_name": "AZ MİDYE SALATASI",
    "name": "Midye Salatası (Az Porsiyon)",
    "price": 200,
    "category": "mezeler",
    "description": "Taze iç midye, dereotu, taze soğan ve zeytinyağlı sos ile.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00022",
    "raw_name": "ANTEP EZME",
    "name": "Antep Acılı Ezme",
    "price": 225,
    "category": "mezeler",
    "description": "Zırhta çekilmiş domates, biber, nar ekşisi ve taze nane.",
    "badge": "Acılı / Klasik",
    "is_signature": false
  },
  {
    "id": "ST00036",
    "raw_name": "AZ ŞEVKET BOSTAN",
    "name": "Şevket-i Bostan (Az Porsiyon)",
    "price": 225,
    "category": "mezeler",
    "description": "Geleneksel Ege usulü zeytinyağlı ve limonlu şevketi bostan.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00045",
    "raw_name": "CİBEZ",
    "name": "Zeytinyağlı Cibez Otu",
    "price": 225,
    "category": "mezeler",
    "description": "Haşlanmış taze cibez lahanası, sızma zeytinyağı ve sarımsaklı limon sosu.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00058",
    "raw_name": "FAVA SADE",
    "name": "Klasik Fava (Sade)",
    "price": 225,
    "category": "mezeler",
    "description": "Kuru bakladan ipeksi kıvamda ezme, sızma zeytinyağı ile.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00065",
    "raw_name": "HAVUÇ TARATOR",
    "name": "Havuç Tarator",
    "price": 225,
    "category": "mezeler",
    "description": "Zeytinyağında sotelenmiş havuç, süzme yoğurt, ceviz ve sarımsak.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00066",
    "raw_name": "HAYDARİ",
    "name": "Köz Nane ve Dereotlu Haydari",
    "price": 225,
    "category": "mezeler",
    "description": "Süzme yoğurt, beyaz peynir, tereyağında kavrulmuş nane ve sarımsak.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00068",
    "raw_name": "HUMUSLU PANCAR",
    "name": "Pancarlı Humus",
    "price": 225,
    "category": "mezeler",
    "description": "Tahinli ipek humus ile fırınlanmış kırmızı pancarın uyumu.",
    "badge": "Şefin Dokunuşu",
    "is_signature": false
  },
  {
    "id": "ST00069",
    "raw_name": "ISPANAK BORANİ",
    "name": "Ispanak Borani",
    "price": 225,
    "category": "mezeler",
    "description": "Kavrulmuş körpe ıspanak yaprakları, sarımsaklı süzme yoğurt.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00764",
    "raw_name": "KESTİRMELİ BÖRÜLCE",
    "name": "Kestirmeli Taze Börülce",
    "price": 225,
    "category": "mezeler",
    "description": "Özel sarımsaklı ve unlu limonlu ekşi sosuyla marine edilmiş börülce.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00081",
    "raw_name": "KÖPEOĞLU",
    "name": "Köpoğlu Mancası",
    "price": 225,
    "category": "mezeler",
    "description": "Közlenmiş patlıcan, biber ve domates soslu sarımsaklı yoğurtlu meze.",
    "badge": "Yoğurtlu / Köz",
    "is_signature": false
  },
  {
    "id": "ST00085",
    "raw_name": "KURU BÖRÜLCE",
    "name": "Zeytinyağlı Kuru Börülce Salatası",
    "price": 225,
    "category": "mezeler",
    "description": "Haşlanmış kuru börülce, mor soğan, maydanoz ve limon sos.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00086",
    "raw_name": "KURU CACIK",
    "name": "Süzme Kuru Cacık",
    "price": 225,
    "category": "mezeler",
    "description": "Koyu süzme yoğurt, minik doğranmış çıtır salatalık, nane ve zeytinyağı.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00093",
    "raw_name": "MANTAR SALATASI",
    "name": "Zeytinyağlı Mantar Salatası",
    "price": 225,
    "category": "mezeler",
    "description": "Marine edilmiş taze mantar dilimleri, maydanoz ve zeytinyağı.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00104",
    "raw_name": "PEMBE SULTAN",
    "name": "Pembe Sultan",
    "price": 225,
    "category": "mezeler",
    "description": "Fırınlanmış kırmızı pancar ve sarımsaklı süzme yoğurt birlikteliği.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00106",
    "raw_name": "PİYAZ",
    "name": "Antalya Usulü Tahinli Piyaz",
    "price": 225,
    "category": "mezeler",
    "description": "İspir kuru fasulyesi, haşlanmış yumurta, domates ve tahinli sos.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00119",
    "raw_name": "SÜZME YOĞURT",
    "name": "Köy Süzme Yoğurdu",
    "price": 225,
    "category": "mezeler",
    "description": "Kıvamlı geleneksel süzme yoğurt, üzerinde sızma zeytinyağı.",
    "badge": "Sade",
    "is_signature": false
  },
  {
    "id": "ST00125",
    "raw_name": "TEK LAKERDA",
    "name": "Torik Lakerda (Tek Dilim)",
    "price": 225,
    "category": "mezeler",
    "description": "Özel marine edilmiş kalın dilim torik lakerda, kırmızı soğanla.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00126",
    "raw_name": "TURP OTU",
    "name": "Ege Turp Otu",
    "price": 225,
    "category": "mezeler",
    "description": "Taze haşlanmış turp otu, zeytinyağı ve limon sosu.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00127",
    "raw_name": "TURŞU",
    "name": "Ev Yapımı Karışık Turşu",
    "price": 125,
    "category": "mezeler",
    "description": "Kıtır kıtır mevsim sebzelerinden geleneksel salamura turşu.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00131",
    "raw_name": "YOĞURTLU KABAK",
    "name": "Cevizli Yoğurtlu Kabak",
    "price": 225,
    "category": "mezeler",
    "description": "Hafif kavrulmuş rendelenmiş kabak, süzme yoğurt ve ceviz içi.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00134",
    "raw_name": "YOĞURTLU PATLICAN",
    "name": "Yoğurtlu Köz Patlıcan",
    "price": 225,
    "category": "mezeler",
    "description": "Köz ateşinde tütsülenmiş patlıcan, sarımsaklı yoğurt ile.",
    "badge": "Yoğurtlu / Köz",
    "is_signature": false
  },
  {
    "id": "ST00136",
    "raw_name": "YOĞURTLU SEMİZ",
    "name": "Yoğurtlu Semizotu",
    "price": 225,
    "category": "mezeler",
    "description": "Taze körpe semizotu yaprakları ve sarımsaklı süzme yoğurt.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00137",
    "raw_name": "ZEYTİN",
    "name": "Ege Kırma Zeytin Tabağı",
    "price": 225,
    "category": "mezeler",
    "description": "Özel marine edilmiş sele ve kırma yeşil zeytinler kekik ve zeytinyağı ile.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00786",
    "raw_name": "AŞK YAKAR",
    "name": "Aşk Yakar (Özel Acılı)",
    "price": 250,
    "category": "mezeler",
    "description": "Köz biber, ceviz, kurutulmuş domates ve özel acı baharat harmanı.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00782",
    "raw_name": "ATA MEZE",
    "name": "Ata Mezesi",
    "price": 250,
    "category": "mezeler",
    "description": "Közlenmiş patlıcan, ceviz ve tahin bazlı nostaljik lezzet.",
    "badge": "Özel Meze",
    "is_signature": true
  },
  {
    "id": "ST00024",
    "raw_name": "ATOM",
    "name": "Acılı Atom",
    "price": 250,
    "category": "mezeler",
    "description": "Süzme yoğurt üzerinde tereyağında kızartılmış acı kurutulmuş Arnavut biberleri.",
    "badge": "Acılı / Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00025",
    "raw_name": "ATOM Y.P.Ü",
    "name": "Yoğurtlu Patlıcan Üzeri Atom",
    "price": 250,
    "category": "mezeler",
    "description": "Köz patlıcanlı yoğurt tabanında çıtır tereyağlı acı atom biberleri.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00035",
    "raw_name": "AZ SOSLU HAMSİ",
    "name": "Soslu Hamsi Marin (Az)",
    "price": 250,
    "category": "mezeler",
    "description": "Sirke, limon ve zeytinyağında marine edilmiş Karadeniz hamsisi.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00037",
    "raw_name": "BABAGANUŞ",
    "name": "Köz Patlıcanlı Babaganuş",
    "price": 250,
    "category": "mezeler",
    "description": "Köz patlıcan, köz biber, tahin, sarımsak ve nar ekşisi.",
    "badge": "Köz / Klasik",
    "is_signature": false
  },
  {
    "id": "ST00038",
    "raw_name": "BALLI SÜZME YOĞURT",
    "name": "Ballı Cevizli Süzme Yoğurt",
    "price": 250,
    "category": "mezeler",
    "description": "Süzme manda yoğurdu, çam balı ve taze ceviz içi.",
    "badge": "Tatlı Meze",
    "is_signature": false
  },
  {
    "id": "ST00039",
    "raw_name": "BARBUNYA PİLAKİ",
    "name": "Zeytinyağlı Barbunya Pilaki",
    "price": 250,
    "category": "mezeler",
    "description": "Havuç ve patatesle ağır ateşte pişmiş zeytinyağlı barbunya.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00040",
    "raw_name": "BİBER BORANİ",
    "name": "Köz Kırmızı Biber Borani",
    "price": 250,
    "category": "mezeler",
    "description": "Közlenmiş kapya biberler ve sarımsaklı süzme yoğurt.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00678",
    "raw_name": "BİBER TARATOR SOĞUK",
    "name": "Soğuk Biber Tarator",
    "price": 250,
    "category": "mezeler",
    "description": "Ceviz, sarımsak ve süzme yoğurtla harmanlanmış köz biber.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00043",
    "raw_name": "BROKOLİ",
    "name": "Zeytinyağlı Brokoli",
    "price": 250,
    "category": "mezeler",
    "description": "Buharda pişirilmiş brokoli, sarımsaklı limon sosu eşliğinde.",
    "badge": "Hafif & Sağlıklı",
    "is_signature": false
  },
  {
    "id": "ST00765",
    "raw_name": "BROKOLİ SALATASI",
    "name": "Hardal Soslu Brokoli Salatası",
    "price": 250,
    "category": "mezeler",
    "description": "Taze brokoli, haşlanmış mısır ve hardallı zeytinyağı sosu.",
    "badge": "Salata Meze",
    "is_signature": false
  },
  {
    "id": "ST00044",
    "raw_name": "BRÜKSEL LAHANASI",
    "name": "Zeytinyağlı Brüksel Lahanası",
    "price": 250,
    "category": "mezeler",
    "description": "Havuç ve nar ekşili sızma zeytinyağı sosuyla.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00784",
    "raw_name": "CUNDA",
    "name": "Cunda Ezmesi",
    "price": 250,
    "category": "mezeler",
    "description": "Ezine peyniri, ceviz, fesleğen ve sızma zeytinyağlı ada klasiği.",
    "badge": "Ada Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00048",
    "raw_name": "ÇITIR",
    "name": "Çıtır Meze",
    "price": 250,
    "category": "mezeler",
    "description": "Özel soslu çıtır yufka ve baharatlı yoğurt harmanı.",
    "badge": "Özel Meze",
    "is_signature": true
  },
  {
    "id": "ST00049",
    "raw_name": "ÇİĞKÖFTE",
    "name": "Etsiz Çiğ Köfte Tabağı",
    "price": 250,
    "category": "mezeler",
    "description": "Geleneksel yoğrulmuş etsiz çiğ köfte, marul ve limon ile.",
    "badge": "Acılı",
    "is_signature": false
  },
  {
    "id": "ST00768",
    "raw_name": "EKŞİLİ PATLICAN",
    "name": "Ekşili Köz Patlıcan",
    "price": 250,
    "category": "mezeler",
    "description": "Közlenmiş patlıcan, sumak, nar ekşisi, ceviz ve zeytinyağı.",
    "badge": "Köz / Ekşili",
    "is_signature": false
  },
  {
    "id": "ST00059",
    "raw_name": "FAVA TEKMİL",
    "name": "Tekmil Fava",
    "price": 250,
    "category": "mezeler",
    "description": "Kırmızı soğan, dereotu, kapari ve sızma zeytinyağlı zengin fava.",
    "badge": "Şefin Önerisi",
    "is_signature": false
  },
  {
    "id": "ST00060",
    "raw_name": "FELLAH KÖFTE",
    "name": "Sosuyla Fellah Köftesi",
    "price": 250,
    "category": "mezeler",
    "description": "İnce bulgur köfteleri, sarımsaklı domates sosu ve maydanoz.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00781",
    "raw_name": "GELİNCİK",
    "name": "Gelincik Mezesi",
    "price": 250,
    "category": "mezeler",
    "description": "Pancar ve özel peynir harmanıyla pembe rengini alan imza lezzet.",
    "badge": "İmza Meze",
    "is_signature": true
  },
  {
    "id": "ST00061",
    "raw_name": "GİRİT EZME",
    "name": "Klasik Girit Ezmesi",
    "price": 250,
    "category": "mezeler",
    "description": "Ezine peyniri, Antep fıstığı, ceviz, taze fesleğen ve zeytinyağı.",
    "badge": "Peynirli / Popüler",
    "is_signature": false
  },
  {
    "id": "ST00067",
    "raw_name": "HUMUS",
    "name": "Klasik Humus",
    "price": 250,
    "category": "mezeler",
    "description": "Haşlanmış nohut, tahin, kimyon, limon suyu ve sızma zeytinyağı.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00070",
    "raw_name": "IZGARA ZEYTİN",
    "name": "Közde Izgara Zeytin",
    "price": 250,
    "category": "mezeler",
    "description": "Kömür ateşinde ızgaralanmış iri yeşil zeytinler, kekikli sosla.",
    "badge": "Özel Lezzet",
    "is_signature": true
  },
  {
    "id": "ST00761",
    "raw_name": "KABAK ŞAHAN",
    "name": "Kabak Şahan",
    "price": 250,
    "category": "mezeler",
    "description": "İnce kıyım çıtır kabak şeritleri, ceviz ve yoğurtlu hafif sos.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00076",
    "raw_name": "KARPUZ - PEYNİR",
    "name": "Karpuz & Ezine Peynir İkilisi",
    "price": 250,
    "category": "mezeler",
    "description": "Yaz akşamlarının efsanevi rakı eşlikçisi taze karpuz ve tam yağlı Ezine.",
    "badge": "Rakı Yanı",
    "is_signature": false
  },
  {
    "id": "ST00079",
    "raw_name": "KAYA KORUĞU",
    "name": "Zeytinyağlı Kaya Koruğu",
    "price": 250,
    "category": "mezeler",
    "description": "Ege kıyılarının kayalıklarından toplanan ekşimsi lezzetli yabani ot.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00080",
    "raw_name": "KOMPLE SÖĞÜŞ",
    "name": "Lüks Serpme Söğüş Tabağı",
    "price": 250,
    "category": "mezeler",
    "description": "Çengelköy salatalığı, tarla domatesi, biberler, roka ve taze nane.",
    "badge": "Bahçeden",
    "is_signature": false
  },
  {
    "id": "ST00082",
    "raw_name": "KÖZ BİBER",
    "name": "Közlenmiş Kırmızı Kapya Biber",
    "price": 250,
    "category": "mezeler",
    "description": "Kömür ateşinde közlenmiş, sarımsaklı sızma zeytinyağı sosunda.",
    "badge": "Köz",
    "is_signature": false
  },
  {
    "id": "ST00083",
    "raw_name": "KÖZ BİBER DOLMA",
    "name": "Peynir Dolgulu Köz Biber",
    "price": 250,
    "category": "mezeler",
    "description": "Közlenmiş kırmızı biber içerisine tulum ve lor peyniri dolgusu.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00084",
    "raw_name": "KÖZ PATLICAN",
    "name": "Sade Köz Patlıcan Salatası",
    "price": 250,
    "category": "mezeler",
    "description": "Közlenmiş odun ateşi patlıcanı, sarımsak, limon ve zeytinyağı.",
    "badge": "Köz",
    "is_signature": false
  },
  {
    "id": "ST00087",
    "raw_name": "KURU CACIK ÜZERİ ATOM",
    "name": "Atomlu Kuru Cacık",
    "price": 250,
    "category": "mezeler",
    "description": "Ferahlatıcı koyu cacık üzerinde sıcak tereyağlı acı Arnavut biberi.",
    "badge": "Acı & Ferah",
    "is_signature": false
  },
  {
    "id": "ST00088",
    "raw_name": "KURU CACIK ÜZERİ BİBER TARATOR",
    "name": "Biber Taratorlu Kuru Cacık",
    "price": 250,
    "category": "mezeler",
    "description": "İki katmanlı özel sunum: altta kuru cacık, üstte cevizli biber tarator.",
    "badge": "Özel Meze",
    "is_signature": true
  },
  {
    "id": "ST00089",
    "raw_name": "KURU DOMATES",
    "name": "Zeytinyağlı Güneşte Kurutulmuş Domates",
    "price": 250,
    "category": "mezeler",
    "description": "Kekik, sarımsak ve ceviz ile marine edilmiş Ege güneşi domatesleri.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00094",
    "raw_name": "MASTABE",
    "name": "Tarihi Mastabe",
    "price": 250,
    "category": "mezeler",
    "description": "Pazı, süzme yoğurt, tahin ve ceviz ile hazırlanan Osmanlı saray mezesi.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00097",
    "raw_name": "MİDYE SARMA",
    "name": "Zeytinyağlı Midye Sarma",
    "price": 250,
    "category": "mezeler",
    "description": "Baharatlı iç pilavla doldurulup asma yaprağına sarılmış midye.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00098",
    "raw_name": "NURANİYE GİRİT MEZE",
    "name": "Nuraniye",
    "price": 250,
    "category": "mezeler",
    "description": "Kabak, pirinç, taze yeşillikler ve sarımsaklı süzme yoğurtlu Girit mezesi.",
    "badge": "Girit Usulü",
    "is_signature": false
  },
  {
    "id": "ST00100",
    "raw_name": "PANCAR",
    "name": "Zeytinyağlı Fırın Pancar",
    "price": 250,
    "category": "mezeler",
    "description": "Fırında karamelize edilmiş kırmızı pancar dilimleri, zeytinyağı ve sirke.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00805",
    "raw_name": "PAŞA MEZE",
    "name": "Paşa Mezesi",
    "price": 250,
    "category": "mezeler",
    "description": "Özel ezine peyniri, ceviz, tereyağı ve baharatların nefis uyumu.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00101",
    "raw_name": "PATLICAN DOLMA",
    "name": "Kuru Patlıcan Dolması (Zeytinyağlı)",
    "price": 250,
    "category": "mezeler",
    "description": "Kuş üzümlü, fıstıklı baharatlı pirinç dolgulu kuru patlıcan.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00102",
    "raw_name": "PATLICAN DÖVME",
    "name": "Patlıcan Dövme",
    "price": 250,
    "category": "mezeler",
    "description": "Zırhta çekilmiş köz patlıcan, sarımsak ve zeytinyağı.",
    "badge": "Köz",
    "is_signature": false
  },
  {
    "id": "ST00110",
    "raw_name": "RUS SALATASI",
    "name": "Klasik Rus Salatası",
    "price": 250,
    "category": "mezeler",
    "description": "Garnitür bezelye, havuç, patates ve kornişon turşu mayonez sosunda.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00672",
    "raw_name": "SEMİZOTU",
    "name": "Zeytinyağlı Taze Semizotu",
    "price": 250,
    "category": "mezeler",
    "description": "Domates ve soğanla hafif sotelenmiş zeytinyağlı taze semizotu.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00760",
    "raw_name": "SULTAN MEZE",
    "name": "Saray Sultan Mezesi",
    "price": 250,
    "category": "mezeler",
    "description": "Köz patlıcan, köz kırmızı biber, ceviz ve yoğurtlu harman.",
    "badge": "Özel Meze",
    "is_signature": true
  },
  {
    "id": "ST00117",
    "raw_name": "SULU CACIK",
    "name": "Buzlu Köy Cacığı",
    "price": 250,
    "category": "mezeler",
    "description": "Buz gibi kıvamında dereotlu, zeytinyağlı geleneksel sulu cacık.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00120",
    "raw_name": "ŞAKŞUKA",
    "name": "Akdeniz Usulü Şakşuka",
    "price": 250,
    "category": "mezeler",
    "description": "Kızarmış patlıcan, biber ve patates küpleri, sarımsaklı domates sosunda.",
    "badge": "Popüler",
    "is_signature": false
  },
  {
    "id": "ST00121",
    "raw_name": "ŞAKŞUKA - YOĞURT",
    "name": "Yoğurtlu Şakşuka",
    "price": 250,
    "category": "mezeler",
    "description": "Süzme yoğurt yatağında servis edilen leziz domates soslu şakşuka.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00123",
    "raw_name": "ŞIMARIK",
    "name": "Şımarık Meze",
    "price": 250,
    "category": "mezeler",
    "description": "Tuzla Balık mutfağından tatlı-ekşi baharatlı özel peynirli meze.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00124",
    "raw_name": "TARLA BÖRÜLCE",
    "name": "Taze Tarla Börülcesi",
    "price": 250,
    "category": "mezeler",
    "description": "Doğal Ege tarlalarından toplanmış, sarmısaklı zeytinyağı ile haşlanmış.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00128",
    "raw_name": "TUZLA BALIK SPECİAL",
    "name": "Tuzla Balık Özel Spesiyal Meze",
    "price": 250,
    "category": "mezeler",
    "description": "Mekanımızın gizli reçetesiyle hazırlanan imza meze.",
    "badge": "Spesiyal",
    "is_signature": false
  },
  {
    "id": "ST00780",
    "raw_name": "YELA",
    "name": "Yela Mezesi",
    "price": 250,
    "category": "mezeler",
    "description": "Fesleğenli peynir ezmesi ve köz sebzelerle hazırlanan Akdeniz mezesi.",
    "badge": "Akdeniz",
    "is_signature": false
  },
  {
    "id": "ST00132",
    "raw_name": "YOĞURTLU KÖZ BİBER",
    "name": "Yoğurtlu Köz Kırmızı Biber",
    "price": 250,
    "category": "mezeler",
    "description": "Kömür közü kapya biberler, süzme yoğurt ve nane.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00133",
    "raw_name": "YOĞURTLU MANTAR",
    "name": "Yoğurtlu Marine Mantar",
    "price": 250,
    "category": "mezeler",
    "description": "Sotelenmiş mantar dilimleri, sarımsaklı yoğurt sosu ile.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00135",
    "raw_name": "YOĞURTLU PATLICAN ÜZERİ ŞAKŞUKA",
    "name": "Yoğurtlu Patlıcan Üzeri Şakşuka",
    "price": 250,
    "category": "mezeler",
    "description": "Köz patlıcanlı yoğurt tabanında sıcak domates soslu şakşuka sebzeleri.",
    "badge": "Özel Sunum",
    "is_signature": true
  },
  {
    "id": "ST00027",
    "raw_name": "AZ BİBER TARATOR SICAK",
    "name": "Sıcak Biber Tarator (Az)",
    "price": 275,
    "category": "mezeler",
    "description": "Tereyağında sotelenmiş sıcak biber tarator lezzeti.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00028",
    "raw_name": "AZ ÇİROZ",
    "name": "Uskumru Çirozu (Az)",
    "price": 275,
    "category": "mezeler",
    "description": "Dereotu, sızma zeytinyağı ve sirkeyle marine edilmiş kurutulmuş uskumru.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00030",
    "raw_name": "AZ ENGİNAR KALBİ",
    "name": "Enginar Kalbi (Az Porsiyon)",
    "price": 275,
    "category": "mezeler",
    "description": "Zeytinyağı ve limon soslu yumuşacık enginar kalpleri.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00762",
    "raw_name": "BADEMLİK",
    "name": "Bademlik Mezesi",
    "price": 275,
    "category": "mezeler",
    "description": "Kavrulmuş bademler, tulum peyniri ve zeytinyağlı ezme.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00042",
    "raw_name": "BİBER TARATOR YOĞURT",
    "name": "Yoğurtlu Biber Tarator",
    "price": 275,
    "category": "mezeler",
    "description": "Özel baharatlar, ceviz ve yoğun süzme yoğurtla biber tarator.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00748",
    "raw_name": "FESLEĞENLİ GİRİT",
    "name": "Taze Fesleğenli Girit Ezmesi",
    "price": 275,
    "category": "mezeler",
    "description": "Ezine peyniri, ceviz, bol taze fesleğen ve zeytinyağı.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00062",
    "raw_name": "GİRİT GÜZELİ",
    "name": "Girit Güzeli",
    "price": 275,
    "category": "mezeler",
    "description": "Peynir, kurutulmuş domates ve cevizle harmanlanmış adalı lezzet.",
    "badge": "Ada Usulü",
    "is_signature": false
  },
  {
    "id": "ST00063",
    "raw_name": "GİRİT PEYNİRLİ",
    "name": "Zeytinli Girit Peyniri",
    "price": 275,
    "category": "mezeler",
    "description": "Marine edilmiş Girit peyniri küpleri, kekik ve zeytinyağı.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00783",
    "raw_name": "HARDALLI PATLICAN",
    "name": "Dijon Hardallı Köz Patlıcan",
    "price": 275,
    "category": "mezeler",
    "description": "Köz patlıcana Fransız Dijon hardalı ve sızma zeytinyağı dokunuşu.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00875",
    "raw_name": "HEYECANLI",
    "name": "Heyecanlı (Özel Acılı)",
    "price": 275,
    "category": "mezeler",
    "description": "Müdavimlerin favorisi, hafif tatlı ve acı dengesiyle iştah açıcı meze.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00758",
    "raw_name": "İSLİ PANCAR",
    "name": "İsli Fırın Pancar",
    "price": 275,
    "category": "mezeler",
    "description": "Tütsü aromalı közlenmiş kırmızı pancar, keçi peyniri kırıntıları ile.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00092",
    "raw_name": "LORLU BİBER",
    "name": "Ayvalık Loru Dolgulu Biber",
    "price": 275,
    "category": "mezeler",
    "description": "Közlenmiş biber içinde tatlı Ayvalık loru ve çörek otu.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00857",
    "raw_name": "SİCİLYANO",
    "name": "Sicilyano",
    "price": 275,
    "category": "mezeler",
    "description": "Kurutulmuş domates, kapari, zeytin ve peynirle Akdeniz esintisi.",
    "badge": "Akdeniz",
    "is_signature": false
  },
  {
    "id": "ST00122",
    "raw_name": "ŞEVKETİ BOSTAN",
    "name": "Zeytinyağlı Şevket-i Bostan",
    "price": 275,
    "category": "mezeler",
    "description": "Ege'nin efsanevi şifalı otu, sızma zeytinyağı ve taze limon sosunda.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00856",
    "raw_name": "ANTİBİYOTİK",
    "name": "Antibiyotik (Şifa Mezesi)",
    "price": 300,
    "category": "mezeler",
    "description": "Sarımsak, zencefil, acı biber ve zeytinyağıyla hazırlanan şifa kaynağı.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00029",
    "raw_name": "AZ DENİZ MAH. SALATASI",
    "name": "Deniz Mahsulleri Salatası (Az)",
    "price": 300,
    "category": "mezeler",
    "description": "Karides, ahtapot ve kalamar parçaları, limon ve zeytinyağı ile.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00031",
    "raw_name": "AZ KARİDES SÖĞÜŞ",
    "name": "Karides Söğüş (Az)",
    "price": 300,
    "category": "mezeler",
    "description": "Haşlanmış taze karides, zeytinyağı ve limon sosu.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00032",
    "raw_name": "AZ LEVREK MARİN",
    "name": "Levrek Marin (Az)",
    "price": 300,
    "category": "mezeler",
    "description": "Hardal ve narenciye marinasyonunda dinlendirilmiş levrek dilimleri.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00051",
    "raw_name": "DENİZ BÖRÜLCELİ SICAK DOMATES",
    "name": "Deniz Börülceli Sıcak Domates",
    "price": 300,
    "category": "mezeler",
    "description": "Sote sıcak domates sosu ve zeytinyağlı deniz börülcesi uyumu.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00054",
    "raw_name": "DENİZ BÖRÜLCESİ",
    "name": "Zeytinyağlı Deniz Börülcesi",
    "price": 300,
    "category": "mezeler",
    "description": "Geleneksel sarımsaklı sızma zeytinyağı sosunda deniz börülcesi.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00744",
    "raw_name": "EGE KARMASI",
    "name": "Ege Otları Karma Tabağı",
    "price": 300,
    "category": "mezeler",
    "description": "Deniz börülcesi, cibez, turp otu ve şevketi bostandan oluşan seçki.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00071",
    "raw_name": "KABAK ÇİÇEĞİ DOLMASI",
    "name": "Zeytinyağlı Kabak Çiçeği Dolması",
    "price": 300,
    "category": "mezeler",
    "description": "Sabahın erken saatlerinde toplanan çiçeklere baharatlı pirinç dolgusu.",
    "badge": "Ege Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00078",
    "raw_name": "KAVUN - PEYNİR",
    "name": "Kavun & Ezine Peynir İkilisi",
    "price": 300,
    "category": "mezeler",
    "description": "Kırkağaç kavunu dilimleri ve 1. sınıf Çanakkale Ezine peyniri.",
    "badge": "Rakı Yanı",
    "is_signature": false
  },
  {
    "id": "ST00769",
    "raw_name": "LÜBNAN MEZE",
    "name": "Lübnan Mezesi (Mütebbel)",
    "price": 300,
    "category": "mezeler",
    "description": "Tahinli, sarımsaklı köz patlıcan ve nar taneleri.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00095",
    "raw_name": "MİDYE DOLMA",
    "name": "İzmir Usulü Sıcak Midye Dolma",
    "price": 300,
    "category": "mezeler",
    "description": "Taze baharatlı ve kuş üzümlü iç pilavlı leziz İzmir midye dolması.",
    "badge": "İzmir Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00103",
    "raw_name": "PATLICAN ÜZERİ YOĞURTLU SICAK ATOM",
    "name": "Patlıcan Üzeri Sıcak Atom",
    "price": 300,
    "category": "mezeler",
    "description": "Köz patlıcan ve yoğurt üzerine taze cızırdayan tereyağlı atom dökümü.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00109",
    "raw_name": "RUM MEZE",
    "name": "Geleneksel Rum Mezesi",
    "price": 300,
    "category": "mezeler",
    "description": "Fesleğenli peynir kreması, ceviz ve köz sebzeler.",
    "badge": "Rum Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00113",
    "raw_name": "SICAK DOMATES ATOMLU",
    "name": "Atomlu Sıcak Domates",
    "price": 300,
    "category": "mezeler",
    "description": "Fırınlanmış sulu domates üzerinde tereyağlı acı atom sosu.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00114",
    "raw_name": "SOĞUK KALAMAR DOLMA",
    "name": "Zeytinyağlı Soğuk Kalamar Dolması",
    "price": 300,
    "category": "mezeler",
    "description": "Peynir, mantar ve taze otlarla doldurulup dilimlenmiş kalamar.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00115",
    "raw_name": "SOĞUK OT TABAĞI",
    "name": "Buzda Ege Otları Tabağı",
    "price": 300,
    "category": "mezeler",
    "description": "Buz üstünde servis edilen günlük taze yabani Ege otları.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00129",
    "raw_name": "YOĞURTLU BAMYA",
    "name": "Yoğurtlu Çıtır Bamya",
    "price": 300,
    "category": "mezeler",
    "description": "Hafif çıtır pişmiş körpe bamyalar ve sarımsaklı yoğurt sosu.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00130",
    "raw_name": "YOĞURTLU DENİZ BÖRÜLCESİ",
    "name": "Yoğurtlu Deniz Börülcesi",
    "price": 300,
    "category": "mezeler",
    "description": "Sarımsaklı süzme yoğurt ile deniz börülcesinin harika uyumu.",
    "badge": "Yoğurtlu",
    "is_signature": false
  },
  {
    "id": "ST00138",
    "raw_name": "ZEYTİN SALATASI",
    "name": "Hatay Kırma Zeytin Salatası",
    "price": 300,
    "category": "mezeler",
    "description": "Yeşil zeytin, ceviz, nar ekşisi, taze soğan ve sızma zeytinyağı.",
    "badge": "Salata Meze",
    "is_signature": false
  },
  {
    "id": "ST00139",
    "raw_name": "ZEYTİN YAĞLI ENGİNAR",
    "name": "Zeytinyağlı Enginar Kalbi",
    "price": 300,
    "category": "mezeler",
    "description": "Taze dereotu ve limon soslu özel zeytinyağlı enginar tabağı.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00107",
    "raw_name": "PORTAKALLI KEREVİZ",
    "name": "Portakallı Zeytinyağlı Kereviz",
    "price": 325,
    "category": "mezeler",
    "description": "Taze sıkılmış portakal suyunda ağır ateşte pişmiş zeytinyağlı kereviz.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00026",
    "raw_name": "AZ AHTAPOT SALATA",
    "name": "Ahtapot Salatası (Az Porsiyon)",
    "price": 350,
    "category": "mezeler",
    "description": "Lokum gibi haşlanmış ahtapot kolları, kapari, zeytinyağı ve limon.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00047",
    "raw_name": "ÇANAK ENGİNAR PORSİYON",
    "name": "Çanak Enginar (Porsiyon)",
    "price": 350,
    "category": "mezeler",
    "description": "Garnitürlü tam porsiyon taze zeytinyağlı çanak enginar.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00055",
    "raw_name": "ENGİNAR KALBİ",
    "name": "Ege Enginar Kalbi Salatası",
    "price": 350,
    "category": "mezeler",
    "description": "Limon ve zeytinyağı soslu bütün enginar kalpleri.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00057",
    "raw_name": "ENGİNAR SALATASI",
    "name": "Dereotlu Taze Enginar Salatası",
    "price": 350,
    "category": "mezeler",
    "description": "Körpe enginar dilimleri, dereotu, taze soğan ve hardallı sos.",
    "badge": "Salata Meze",
    "is_signature": false
  },
  {
    "id": "ST00785",
    "raw_name": "FIRIN ENGİNAR",
    "name": "Fırınlanmış Enginar",
    "price": 350,
    "category": "mezeler",
    "description": "Kömür fırınında zeytinyağı ve taze biberiyeyle közlenmiş enginar.",
    "badge": "Köz / Sıcak",
    "is_signature": false
  },
  {
    "id": "ST00023",
    "raw_name": "ARNAVUT CİĞER",
    "name": "Soğuk Arnavut Ciğeri",
    "price": 375,
    "category": "mezeler",
    "description": "Küp doğranmış kuzu ciğeri, sumaklı kırmızı soğan ve maydanoz.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00116",
    "raw_name": "SOSLU HAMSİ",
    "name": "Özel Soslu Hamsi Marin",
    "price": 375,
    "category": "mezeler",
    "description": "Taze Karadeniz hamsileri, narenciye ve zeytinyağı sosunda tam porsiyon.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00741",
    "raw_name": "BEYİN SÖĞÜŞ",
    "name": "Kuzu Beyin Söğüş",
    "price": 400,
    "category": "mezeler",
    "description": "Özel baharatlar, zeytinyağı, limon ve maydanoz eşliğinde.",
    "badge": "Söğüş",
    "is_signature": false
  },
  {
    "id": "ST00050",
    "raw_name": "ÇİROZ",
    "name": "Uskumru Çirozu (Porsiyon)",
    "price": 400,
    "category": "mezeler",
    "description": "Geleneksel kurutulmuş uskumru çirozu, dereotlu sızma zeytinyağında.",
    "badge": "Rakı Yanı",
    "is_signature": false
  },
  {
    "id": "ST00072",
    "raw_name": "KARIŞIK KIZARTMA",
    "name": "Ege Usulü Karışık Kızartma",
    "price": 400,
    "category": "mezeler",
    "description": "Patlıcan, kabak, biber kızartması, sarımsaklı domates sosuyla.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00096",
    "raw_name": "MİDYE SALATASI",
    "name": "Zeytinyağlı Midye Salatası (Porsiyon)",
    "price": 400,
    "category": "mezeler",
    "description": "Taze iç midyeler, ince kıyım yeşillik ve kaparili sos ile.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00797",
    "raw_name": "PEJMURGE",
    "name": "Pejmurge Mezesi",
    "price": 400,
    "category": "mezeler",
    "description": "Tütsülenmiş balık parçaları ve peynir ezmeli şef spesiyali.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00771",
    "raw_name": "SOĞUK BEYİN SÖĞÜŞ",
    "name": "Soğuk Kuzu Beyin Söğüş",
    "price": 400,
    "category": "mezeler",
    "description": "Buzda servis edilen lezzetli beyin söğüş, zeytinyağı ve kekikle.",
    "badge": "Söğüş",
    "is_signature": false
  },
  {
    "id": "ST00770",
    "raw_name": "SOĞUK DİL SÖĞÜŞ",
    "name": "Soğuk Dana Dil Söğüş",
    "price": 400,
    "category": "mezeler",
    "description": "İnce dilimlenmiş yumuşacık dana dili, hardal ve taze otlar ile.",
    "badge": "Söğüş",
    "is_signature": false
  },
  {
    "id": "ST00794",
    "raw_name": "SOMON GRAVLAX",
    "name": "İskandinav Somon Gravlax",
    "price": 400,
    "category": "mezeler",
    "description": "Tuz, şeker, taze dereotu ve kişniş tohumlarıyla marine somon dilimleri.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00020",
    "raw_name": "AHTAPOT CARPACİO",
    "name": "Ahtapot Carpaccio",
    "price": 450,
    "category": "mezeler",
    "description": "Çok ince yaprak dilimlenmiş ahtapot, kapari, pembe biber ve zeytinyağı.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00749",
    "raw_name": "AVOKADOLU KARİDES",
    "name": "Avokadolu Karides Salatası",
    "price": 450,
    "category": "mezeler",
    "description": "Taze avokado yatağında haşlanmış karidesler ve narenciyeli sos.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00766",
    "raw_name": "BADEMLİ LEVREK",
    "name": "Kavrulmuş Bademli Levrek Marin",
    "price": 450,
    "category": "mezeler",
    "description": "Levrek marin parçaları üzerinde tereyağında kavrulmuş kıtır badem.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00053",
    "raw_name": "DENİZ MAH. SALATASI",
    "name": "Zengin Deniz Mahsulleri Salatası",
    "price": 450,
    "category": "mezeler",
    "description": "Kalamar, ahtapot, karides ve sübye parçaları sızma zeytinyağında.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00056",
    "raw_name": "ENGİNAR KALBİ 1.5",
    "name": "Enginar Kalbi (1.5 Porsiyon)",
    "price": 450,
    "category": "mezeler",
    "description": "Büyük porsiyon enginar kalbi ziyafeti.",
    "badge": "Zeytinyağlı",
    "is_signature": false
  },
  {
    "id": "ST00798",
    "raw_name": "FESLEĞENLİ LEVREK",
    "name": "Fesleğenli Levrek Marin",
    "price": 450,
    "category": "mezeler",
    "description": "Taze fesleğen pesto sosuyla marine edilmiş taze levrek filetoları.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00759",
    "raw_name": "İSLİ MİDYE",
    "name": "Tütsülenmiş İsli Midye",
    "price": 450,
    "category": "mezeler",
    "description": "Odun dumanında özel tütsülenmiş iri midye etleri.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00073",
    "raw_name": "KARİDES AVAKADO",
    "name": "Avokado Yatağında Karides",
    "price": 450,
    "category": "mezeler",
    "description": "Kremamsı avokado püresi ve taze söğüş karides sunumu.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00074",
    "raw_name": "KARİDES SÖĞÜŞ",
    "name": "Karides Söğüş (Porsiyon)",
    "price": 450,
    "category": "mezeler",
    "description": "Buzda servis edilen taze haşlanmış çimçim karidesler.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00091",
    "raw_name": "LEVREK MARİN",
    "name": "Klasik Hardallı Levrek Marin",
    "price": 450,
    "category": "mezeler",
    "description": "Mekanımızın dillere destan narenciye ve hardal soslu levrek marini.",
    "badge": "En Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00099",
    "raw_name": "ORDÖV",
    "name": "Zengin Ordövr Tabağı",
    "price": 450,
    "category": "mezeler",
    "description": "Masaya özel seçilmiş 6 çeşit soğuk meze tadım tabağı.",
    "badge": "Tadım",
    "is_signature": false
  },
  {
    "id": "ST00118",
    "raw_name": "SÜBYE SALATASI",
    "name": "Ege Sübye Salatası",
    "price": 450,
    "category": "mezeler",
    "description": "Lokum yumuşaklığında haşlanmış sübye dilimleri, zeytinyağı ve limon.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00021",
    "raw_name": "AHTAPOT SALATA",
    "name": "Ege Ahtapot Salatası (Büyük)",
    "price": 650,
    "category": "mezeler",
    "description": "Ayvalık sızma zeytinyağı, kapari ve sirke ile lezzetlendirilmiş ahtapot.",
    "badge": "En Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00090",
    "raw_name": "LAKERDA",
    "name": "Boğaz Torik Lakerdası (Büyük Porsiyon)",
    "price": 650,
    "category": "mezeler",
    "description": "Eski usul tuzlanmış gerçek torik lakerda, kırmızı soğan halkalarıyla.",
    "badge": "Klasik / İmza",
    "is_signature": true
  },
  {
    "id": "ST00052",
    "raw_name": "DENİZ MAH. SALATA 1.5",
    "name": "Deniz Mahsulleri Salatası (1.5 Porsiyon)",
    "price": 775,
    "category": "mezeler",
    "description": "Masayı donatan bol deniz mahsullü dev salata tabağı.",
    "badge": "Ziyafet",
    "is_signature": false
  },
  {
    "id": "ST00140",
    "raw_name": "AHTAPOT IZGARA BACAK",
    "name": "Izgara Ahtapot Bacak",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Kömür ızgarasında dışı çıtır içi lokum ahtapot bacağı, kekikli zeytinyağı ile.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00730",
    "raw_name": "AHTAPOT KREMALI GÜVEÇ MANTAR",
    "name": "Kremalı Mantarlı Ahtapot Güveç",
    "price": 800,
    "category": "ara-sicaklar",
    "description": "Fırında eritilmiş kaşar peyniri, krema, mantar ve ahtapot parçaları.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00731",
    "raw_name": "AHTAPOT SÖĞÜŞ",
    "name": "Ilık Ahtapot Söğüş",
    "price": 650,
    "category": "ara-sicaklar",
    "description": "Tereyağında hafifçe ısıtılmış, pul biberli ve sarımsaklı ahtapot.",
    "badge": "Ilık Başlangıç",
    "is_signature": false
  },
  {
    "id": "ST00729",
    "raw_name": "AHTAPOT TEREYAĞLI",
    "name": "Tereyağında Ahtapot",
    "price": 500,
    "category": "ara-sicaklar",
    "description": "Bakır tavada cızırdayan sarımsaklı ve pul biberli tereyağında ahtapot.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00141",
    "raw_name": "AZ D.M.G",
    "name": "Deniz Mahsulleri Güveç (Az)",
    "price": 650,
    "category": "ara-sicaklar",
    "description": "Karides, kalamar, ahtapot ve taze mantarlı küçük güveç.",
    "badge": "Güveç",
    "is_signature": false
  },
  {
    "id": "ST00142",
    "raw_name": "AZ EV PATATESİ YOĞURTLU",
    "name": "Yoğurtlu Ev Patatesi (Az)",
    "price": 275,
    "category": "ara-sicaklar",
    "description": "El kesimi kızarmış patates üzerinde sarımsaklı yoğurt ve tereyağı sosu.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00143",
    "raw_name": "AZ KALAMAR",
    "name": "Kalamar Tava (Az Porsiyon)",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Özel tarator sosuyla çıtır çıtır kızarmış kalamar halkaları.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00144",
    "raw_name": "AZ LEVREK - ŞEVKET",
    "name": "Levrekli Şevket-i Bostan (Az)",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Körpe levrek parçaları ile harmanlanmış ılık şevketi bostan.",
    "badge": "Ege Spesiyali",
    "is_signature": false
  },
  {
    "id": "ST00145",
    "raw_name": "AZ MANTAR GÜVEÇ KREMALI KAŞARLI",
    "name": "Kaşarlı Kremalı Mantar Güveç (Az)",
    "price": 275,
    "category": "ara-sicaklar",
    "description": "Fırında erimiş kaşar peyniri ve mantar güveci.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00146",
    "raw_name": "AZ PATATES",
    "name": "Çıtır Patates Kızartması (Az)",
    "price": 250,
    "category": "ara-sicaklar",
    "description": "Taze el kesimi altın sarısı patates kızartması.",
    "badge": "Atıştırmalık",
    "is_signature": false
  },
  {
    "id": "ST00147",
    "raw_name": "AZ SICAK OT",
    "name": "Sıcak Ege Otları (Az)",
    "price": 250,
    "category": "ara-sicaklar",
    "description": "Tereyağında hafif sotelenmiş günlük yabani Ege otları.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00148",
    "raw_name": "AZ T. KARİDES",
    "name": "Tereyağlı Karides (Az Porsiyon)",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Cızırdayan tereyağında sarımsak ve pul biberli taze karidesler.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00149",
    "raw_name": "AZ YAPRAK CİĞER",
    "name": "Yaprak Ciğer (Az Porsiyon)",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "İncecik kesilip tavada pişirilmiş çıtır kuzu yaprak ciğer.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00859",
    "raw_name": "BALIK BEYTİ",
    "name": "Balık Beyti Sarma",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Lavaş ekmeğine sarılı balık köftesi, domates ve yoğurt sosuyla.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00150",
    "raw_name": "BALIK ÇORBASI",
    "name": "Geleneksel Balık Çorbası",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Taze balık suyu, sebzeler ve terbiye ile hazırlanmış sıcak şifa çorbası.",
    "badge": "Çorba",
    "is_signature": false
  },
  {
    "id": "ST00438",
    "raw_name": "BALIK KAVURMA",
    "name": "Sacda Balık Kavurma",
    "price": 800,
    "category": "ara-sicaklar",
    "description": "Mantar, arpacık soğan, renkli biberler ve domatesle sotelenmiş taze balık.",
    "badge": "Sac Tava",
    "is_signature": false
  },
  {
    "id": "ST00855",
    "raw_name": "BALIK KOKOREÇ",
    "name": "Meşhur Balık Kokoreç",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "İnce kıyılmış balık filetoları, domates, biber ve baharatlarla sacda.",
    "badge": "Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00151",
    "raw_name": "BALIK KÖFTE",
    "name": "Izgara Balık Köfte (Adet)",
    "price": 175,
    "category": "ara-sicaklar",
    "description": "Taze balık kıyması ve taze yeşilliklerle yoğrulmuş ızgara köfte.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00880",
    "raw_name": "BALIK KÜNEFE",
    "name": "İmza Balık Künefe",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Çıtır kadayıf telleri arasında eritme peynir ve deniz ürünleri dolgusu.",
    "badge": "Şefin Sürprizi",
    "is_signature": false
  },
  {
    "id": "ST00885",
    "raw_name": "BALIK PASTIRMA",
    "name": "Sıcak Balık Pastırma",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Özel çemenli balık pastırması tereyağında ızgaralanarak sıcak servis edilir.",
    "badge": "Özel Lezzet",
    "is_signature": true
  },
  {
    "id": "ST00152",
    "raw_name": "BALIKÇI BÖREĞİ",
    "name": "Çıtır Balıkçı Böreği",
    "price": 225,
    "category": "ara-sicaklar",
    "description": "Deniz mahsulleri ve taze kaşar dolgulu nefis çıtır rulo börek.",
    "badge": "Börek",
    "is_signature": false
  },
  {
    "id": "ST00153",
    "raw_name": "BEĞENDİ",
    "name": "Sıcak Köz Patlıcan Beğendi",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Tereyağı, kaşar ve sütle kıvam bulmuş köz patlıcan beğendi tabağı.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00154",
    "raw_name": "BEĞENDİLİ AHTAPOT",
    "name": "Beğendili Izgara Ahtapot",
    "price": 800,
    "category": "ara-sicaklar",
    "description": "Dumanı tüten tereyağlı patlıcan beğendi üzerinde kömürde ızgara ahtapot.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00156",
    "raw_name": "BEĞENDİLİ LEVREK SARMA",
    "name": "Beğendili Levrek Sarma",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Patlıcan beğendi yatağında fırınlanmış levrek rulo sarma.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00157",
    "raw_name": "BEĞENDİLİ T. KARİDES",
    "name": "Beğendili Tereyağlı Karides",
    "price": 800,
    "category": "ara-sicaklar",
    "description": "Kadifemsi köz patlıcan beğendi üzerinde sarımsaklı tereyağında karides.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00155",
    "raw_name": "BEYBİ KALAMAR DOLMA ŞİŞ",
    "name": "Bebek Kalamar Dolma Şiş",
    "price": 375,
    "category": "ara-sicaklar",
    "description": "Peynir ve ot dolgulu küçük boy taze kalamarlar ızgara şişte.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00881",
    "raw_name": "BIYIK",
    "name": "Bıyık Spesiyal",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Mekanımıza özel deniz mahsullü sıcak gurme meze.",
    "badge": "Spesiyal",
    "is_signature": false
  },
  {
    "id": "ST00679",
    "raw_name": "BİBER TARATOR SICAK",
    "name": "Sıcak Biber Tarator",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Fırından yeni çıkmış sıcak cevizli köz biber tarator.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00883",
    "raw_name": "ÇERKEZ TAVUĞU",
    "name": "Ilık Çerkez Tavuğu",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Yoğun cevizli ve sarımsaklı özel sosunda tiftiklenmiş tavuk.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00882",
    "raw_name": "ÇITIR KABAK",
    "name": "Çıtır Kabak Dilimleri",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "İnce yaprak dilimlenip kızartılmış çıtır kabaklar, tarator sos eşliğinde.",
    "badge": "Çıtır",
    "is_signature": false
  },
  {
    "id": "ST00159",
    "raw_name": "ÇITIR SEPET",
    "name": "Karışık Çıtır Deniz Sepeti",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Kalamar, karides ve çıtır mezelerden oluşan paylaşmalık sepet.",
    "badge": "Paylaşımlık",
    "is_signature": false
  },
  {
    "id": "ST00160",
    "raw_name": "ÇORBA",
    "name": "Günün Çorbası",
    "price": 250,
    "category": "ara-sicaklar",
    "description": "Taze günlük hazırlanan nefis sıcak çorba.",
    "badge": "Çorba",
    "is_signature": false
  },
  {
    "id": "ST00161",
    "raw_name": "D.M. BÖREK MUSKA",
    "name": "Deniz Mahsullü Muska Böreği",
    "price": 225,
    "category": "ara-sicaklar",
    "description": "İçinde karides ve kalamar harcı bulunan çıtır üçgen muska börekler.",
    "badge": "Börek",
    "is_signature": false
  },
  {
    "id": "ST00162",
    "raw_name": "D.M. GÜVEÇ KREMALI",
    "name": "Deniz Mahsulleri Güveç (Kremalı & Kaşarlı)",
    "price": 850,
    "category": "ara-sicaklar",
    "description": "Ahtapot, kalamar, karides, krema ve erimiş taze kaşarlı güveç.",
    "badge": "En Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00163",
    "raw_name": "D.M. GÜVEÇ KREMASIZ",
    "name": "Deniz Mahsulleri Güveç (Domatesli & Tereyağlı)",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Kremasız, sarımsaklı domates sosunda ağır ateşte pişmiş deniz mahsulleri.",
    "badge": "Güveç",
    "is_signature": false
  },
  {
    "id": "ST00165",
    "raw_name": "DENİZ MAH. MAKARNA",
    "name": "Deniz Mahsullü İtalyan Makarna",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Linguine makarna, ahtapot, karides, kalamar ve fesleğenli domates sos.",
    "badge": "Makarna",
    "is_signature": false
  },
  {
    "id": "ST00164",
    "raw_name": "DENİZ MAH. ŞEVKET B. KREMALI",
    "name": "Kremalı Deniz Mahsullü Şevketi Bostan",
    "price": 850,
    "category": "ara-sicaklar",
    "description": "Ege'nin şevketi bostanı, karides ve kalamarla krema sosunda.",
    "badge": "Ege Spesiyali",
    "is_signature": false
  },
  {
    "id": "ST00743",
    "raw_name": "DİL SÖĞÜŞ SICAK",
    "name": "Sıcak Dil Söğüş",
    "price": 550,
    "category": "ara-sicaklar",
    "description": "Tereyağı ve pul biber ile hafifçe ısıtılmış taze dil balığı söğüşü.",
    "badge": "Sıcak Balık",
    "is_signature": false
  },
  {
    "id": "ST00473",
    "raw_name": "DİL ŞİŞ",
    "name": "Dil Balığı Şiş",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Defne yaprağı ve domates eşliğinde ızgarada pişmiş yumuşacık dil balığı.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00166",
    "raw_name": "HELLİMLİ LEVREK ŞİŞ ADET",
    "name": "Hellimli Levrek Şiş (Adet)",
    "price": 550,
    "category": "ara-sicaklar",
    "description": "Levrek fileto dilimleri ve Kıbrıs hellim peyniri şişte ızgara.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00167",
    "raw_name": "HELLİMLİ LEVREK ŞİŞ PORSİYON",
    "name": "Hellimli Levrek Şiş (Porsiyon)",
    "price": 550,
    "category": "ara-sicaklar",
    "description": "Tam porsiyon hellimli levrek şiş, roka ve limonla.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00168",
    "raw_name": "HELLİMLİ LTAVUK ŞİŞ KALEM",
    "name": "Hellimli Tavuk Şiş",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Hellim peyniri ve marine tavuk göğsü şişte kömür ateşinde.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00169",
    "raw_name": "IZGARA PEYNİR",
    "name": "Kömürde Izgara Hellim",
    "price": 175,
    "category": "ara-sicaklar",
    "description": "Kömür ateşinde ızgaralanmış kekikli sıcak peynir dilimleri.",
    "badge": "Peynir",
    "is_signature": false
  },
  {
    "id": "ST00170",
    "raw_name": "IZGARA PEYNİR GÜVEÇ KURU DOMATESLİ",
    "name": "Güveçte Kuru Domatesli Peynir",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Fırın güveçte eriyen peynir, güneşte kurutulmuş domates ve kekik.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00474",
    "raw_name": "IZGARA YILAN BALIĞI",
    "name": "Izgara Yılan Balığı",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Özel marinasyonlu, yüksek yağlı ve lezzetli ızgara yılan balığı.",
    "badge": "Spesiyal",
    "is_signature": false
  },
  {
    "id": "ST00171",
    "raw_name": "İSTİRİDYE MANTAR IZGARA",
    "name": "Izgara İstiridye Mantarı",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Kömürde ızgaralanmış etli istiridye mantarları, sarımsaklı zeytinyağıyla.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00670",
    "raw_name": "İSTİRİDYE MANTAR KREMALI KAŞARLI",
    "name": "Kremalı Kaşarlı İstiridye Mantar",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Fırında eritilmiş kaşar ve krema soslu taze istiridye mantarı.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00671",
    "raw_name": "İSTİRİDYE MANTAR TEREYAĞLI",
    "name": "Tereyağında İstiridye Mantarı",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Tavada cızırdayan taze sarımsak ve tereyağlı istiridye mantarı.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00807",
    "raw_name": "JUMBO KARİDES ADET",
    "name": "Izgara Jumbo Karides (Adet)",
    "price": 250,
    "category": "ara-sicaklar",
    "description": "Kömür ateşinde kabuğuyla ızgaralanmış iri boy jumbo karides.",
    "badge": "Jumbo",
    "is_signature": false
  },
  {
    "id": "ST00863",
    "raw_name": "JUMBO KARİDES KG",
    "name": "Jumbo Karides (Tava / Izgara / Fırın)",
    "price": 1800,
    "category": "ara-sicaklar",
    "description": "Mevsimine göre kilo hesabıyla hazırlanan taze jumbo karides ziyafeti.",
    "badge": "Jumbo",
    "is_signature": false
  },
  {
    "id": "ST00172",
    "raw_name": "JUMBO KARİDES SHOT",
    "name": "Jumbo Karides Kokteyl Shot",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Özel sos eşliğinde shot kadehinde sunulan jumbo karides.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00173",
    "raw_name": "KALAMAR BEYTİ ŞİŞ ADET",
    "name": "Kalamar Beyti Şiş",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Kalamar eti kıymasıyla hazırlanan özel beyti şiş.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00174",
    "raw_name": "KALAMAR DOLMA",
    "name": "Büyük Kalamar Dolması",
    "price": 1250,
    "category": "ara-sicaklar",
    "description": "İçi deniz ürünleri, peynir ve otlarla doldurulup fırınlanmış dev kalamar.",
    "badge": "Ziyafet",
    "is_signature": false
  },
  {
    "id": "ST00175",
    "raw_name": "KALAMAR ŞİŞ",
    "name": "Kalamar Şiş Izgara",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Kömür ateşinde nar gibi kızarmış taze kalamar şişi.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00176",
    "raw_name": "KALAMAR TAVA",
    "name": "Tuzla Usulü Kalamar Tava",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Özel un karışımında altın sarısı kızarmış, tarator soslu kalamar.",
    "badge": "Popüler",
    "is_signature": false
  },
  {
    "id": "ST00177",
    "raw_name": "KALAMAR TAVA 1.5",
    "name": "Kalamar Tava (1.5 Porsiyon)",
    "price": 950,
    "category": "ara-sicaklar",
    "description": "Bol porsiyon çıtır kalamar tava ve çifte tarator sos.",
    "badge": "Büyük Porsiyon",
    "is_signature": false
  },
  {
    "id": "ST00860",
    "raw_name": "KARİDES CARPACİO",
    "name": "Sıcak Karides Carpaccio",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Çok ince dövülmüş taze karidesler, sıcak tereyağı ve limon sosuyla.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00178",
    "raw_name": "KARİDES GÜVEÇ KAŞARLI",
    "name": "Kaşarlı Karides Güveç",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Fırında domates, biber, sarımsak ve erimiş kaşar altında karides güveç.",
    "badge": "Güveç",
    "is_signature": false
  },
  {
    "id": "ST00179",
    "raw_name": "KARİDES MANTI",
    "name": "El Açması Karides Mantı",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Karides dolgulu el yapımı mantı, sarımsaklı yoğurt ve nane yağı sosuyla.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00180",
    "raw_name": "KARİDES ŞİŞ KALEM",
    "name": "Karides Şiş (Adet)",
    "price": 325,
    "category": "ara-sicaklar",
    "description": "Kömürde pişirilmiş marine karides şiş.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00181",
    "raw_name": "KARİDESLİ LEVREK ŞEVKET",
    "name": "Karidesli Levrekli Şevket-i Bostan",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Hem karides hem levrek fileto içeren enfes ılık Ege şevket-i bostanı.",
    "badge": "Ege Spesiyali",
    "is_signature": false
  },
  {
    "id": "ST00182",
    "raw_name": "KAŞARLI MANTAR ADET",
    "name": "Fırında Kaşarlı Mantar",
    "price": 125,
    "category": "ara-sicaklar",
    "description": "Fırında tereyağı ve kaşarla kızartılmış mantar şapkası.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00184",
    "raw_name": "KREMALI KAŞARLI ŞEVKETİ BOSTAN",
    "name": "Kremalı Kaşarlı Şevket-i Bostan",
    "price": 475,
    "category": "ara-sicaklar",
    "description": "Fırın güveçte krema ve kaşar peyniriyle graten edilmiş şevket-i bostan.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00854",
    "raw_name": "LEVREK SİMİT",
    "name": "Susamlı Çıtır Levrek Simit",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Susamla kaplanmış simit formunda çıtır çıtır levrek parçaları.",
    "badge": "Özel Lezzet",
    "is_signature": true
  },
  {
    "id": "ST00186",
    "raw_name": "LEVREK ŞEVKET",
    "name": "Levrekli Şevket-i Bostan (Porsiyon)",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Taze levrek filetoları ve Ege'nin taze şevketi bostanı.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00185",
    "raw_name": "LEVREK ŞEVKET 1.5",
    "name": "Levrekli Şevket-i Bostan (1.5 Porsiyon)",
    "price": 950,
    "category": "ara-sicaklar",
    "description": "Doyurucu büyük porsiyon levrekli şevket-i bostan.",
    "badge": "Büyük Porsiyon",
    "is_signature": false
  },
  {
    "id": "ST00874",
    "raw_name": "MAVİ KUYRUK",
    "name": "Mavi Kuyruk Istakoz / Karides",
    "price": 3500,
    "category": "ara-sicaklar",
    "description": "Özel deniz ürünü ziyafeti, sarımsaklı tereyağı ve soslar eşliğinde.",
    "badge": "Lüks",
    "is_signature": true
  },
  {
    "id": "ST00188",
    "raw_name": "MİDYE GÜVEÇ",
    "name": "Domatesli Kaşarlı Midye Güveç",
    "price": 500,
    "category": "ara-sicaklar",
    "description": "Fırın güveçte taze midye etleri, biber, domates ve kaşar peyniri.",
    "badge": "Güveç",
    "is_signature": false
  },
  {
    "id": "ST00189",
    "raw_name": "MİDYE TAVA KALEM",
    "name": "Midye Tava Şiş (Adet)",
    "price": 175,
    "category": "ara-sicaklar",
    "description": "Çıtır çıtır kızarmış midye şişi, tarator sos ile.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00190",
    "raw_name": "MİDYE TAVA PORSİYON",
    "name": "Midye Tava (Porsiyon)",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Altın sarısı çıtır midye tava porsiyonu, yanında ev yapımı tarator sos.",
    "badge": "Popüler",
    "is_signature": false
  },
  {
    "id": "ST00886",
    "raw_name": "ORKİNOS FÜME",
    "name": "Ilık Orkinos Füme",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Hafifçe ızgaralanmış tütsülenmiş orkinos fileto dilimleri.",
    "badge": "Tütsü",
    "is_signature": false
  },
  {
    "id": "ST00191",
    "raw_name": "ORKİNOS GÜVEÇ",
    "name": "Orkinos Balığı Güveç",
    "price": 550,
    "category": "ara-sicaklar",
    "description": "Fırında arpacık soğan ve domates sosunda orkinos balığı.",
    "badge": "Güveç",
    "is_signature": false
  },
  {
    "id": "ST00192",
    "raw_name": "PAÇANGA BÖREĞİ",
    "name": "Geleneksel Paçanga Böreği",
    "price": 225,
    "category": "ara-sicaklar",
    "description": "Kayseri pastırması, kaşar peyniri, domates ve biber dolgulu çıtır börek.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00193",
    "raw_name": "PATATES KIZARTMASI",
    "name": "Parmak Patates Kızartması",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Taze el kesimi altın çıtır patatesler, baharat harmanıyla.",
    "badge": "Atıştırmalık",
    "is_signature": false
  },
  {
    "id": "ST00873",
    "raw_name": "POSEDION TABAĞI 2 KİŞİLİK",
    "name": "Poseidon Sıcak Ziyafet Tabağı (2 Kişilik)",
    "price": 1300,
    "category": "ara-sicaklar",
    "description": "Kalamar tava, tereyağlı karides, ahtapot ızgara ve balık köftesi.",
    "badge": "Ziyafet",
    "is_signature": false
  },
  {
    "id": "ST00872",
    "raw_name": "POSEDİON TABAĞI 4 KİŞİLİK",
    "name": "Poseidon Sıcak Ziyafet Tabağı (4 Kişilik)",
    "price": 2250,
    "category": "ara-sicaklar",
    "description": "Tüm sıcak deniz ürünlerini bir araya getiren 4 kişilik devasa ziyafet.",
    "badge": "Ziyafet",
    "is_signature": false
  },
  {
    "id": "ST00858",
    "raw_name": "SAGANAKİ",
    "name": "Yunan Usulü Peynir Saganaki",
    "price": 225,
    "category": "ara-sicaklar",
    "description": "Kızgın tavada dışı altın rengi çıtır, içi akışkan kızarmış peynir.",
    "badge": "Yunan Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00194",
    "raw_name": "SICAK ATOM",
    "name": "Tavada Sıcak Atom",
    "price": 275,
    "category": "ara-sicaklar",
    "description": "Kızgın tereyağında kavrulmuş acı kuru biberler.",
    "badge": "Acılı",
    "is_signature": false
  },
  {
    "id": "ST00195",
    "raw_name": "SICAK DOMATES",
    "name": "Közde Fırınlanmış Sıcak Domates",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Zeytinyağı, sarımsak ve kekikle fırında közlenmiş domatesler.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00775",
    "raw_name": "SICAK HUMUS",
    "name": "Tereyağlı Sıcak Humus",
    "price": 350,
    "category": "ara-sicaklar",
    "description": "Fırında sıcak servis edilen, üzerine tereyağı ve çam fıstığı gezdirilmiş humus.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00779",
    "raw_name": "SICAK HUMUS SUCUKLU",
    "name": "Kasap Sucuklu Sıcak Humus",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Fırında dumanı tüten sıcak humus üzerinde çıtır kasap sucuğu dilimleri.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00196",
    "raw_name": "SICAK KÖZ PATLICAN",
    "name": "Fırında Sıcak Köz Patlıcan",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Közlenmiş patlıcanın tereyağı ve sarımsakla sıcak güveç sunumu.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00197",
    "raw_name": "SICAK KÖZ PATLICAN KAŞARLI",
    "name": "Kaşarlı Sıcak Köz Patlıcan Güveç",
    "price": 425,
    "category": "ara-sicaklar",
    "description": "Fırında erimiş kaşar peyniri kaplı sıcak köz patlıcan.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00198",
    "raw_name": "SICAK OT",
    "name": "Sıcak Ege Otları Tabağı",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Cibez, şevketi bostan, börülce ve otların tereyağında sıcacık sotesi.",
    "badge": "Ege Otu",
    "is_signature": false
  },
  {
    "id": "ST00199",
    "raw_name": "SICAK SÜBYE",
    "name": "Tereyağında Sıcak Sübye",
    "price": 600,
    "category": "ara-sicaklar",
    "description": "Lokum yumuşaklığında taze sübye parçaları sarımsaklı tereyağında.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00876",
    "raw_name": "SOMON CEHİCHE",
    "name": "Ilık Somon Ceviche",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "Limon ve narenciyede marine edilmiş, hafif ılık servis edilen somon küpleri.",
    "badge": "Gurme",
    "is_signature": false
  },
  {
    "id": "ST00887",
    "raw_name": "SOMON FÜME",
    "name": "Sıcak Somon Füme",
    "price": 400,
    "category": "ara-sicaklar",
    "description": "Hafifçe ısıtılmış meşe talaşında tütsülenmiş Norveç somonu.",
    "badge": "Tütsü",
    "is_signature": false
  },
  {
    "id": "ST00201",
    "raw_name": "ŞEVKET KARİDES KREMALI",
    "name": "Kremalı Karidesli Şevket-i Bostan",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Krema soslu yumuşacık şevket-i bostan ve taze karidesler.",
    "badge": "Ege Spesiyali",
    "is_signature": false
  },
  {
    "id": "ST00202",
    "raw_name": "TEK PATATES",
    "name": "Patates Tava (Tek Kişilik)",
    "price": 250,
    "category": "ara-sicaklar",
    "description": "Tek kişilik çıtır patates porsiyonu.",
    "badge": "Atıştırmalık",
    "is_signature": false
  },
  {
    "id": "ST00668",
    "raw_name": "TEREYAĞLI KARİDES",
    "name": "Tereyağında Sarımsaklı Karides",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Cızırdayan bakır güveçte taze sarımsak, pul biber ve tereyağlı karides.",
    "badge": "En Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00203",
    "raw_name": "TEREYAĞLI KARİDES KAŞARLI",
    "name": "Kaşarlı Tereyağlı Karides",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Cızırdayan tereyağı üzerinde uzayan taze kaşar peyniri ve karides.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00205",
    "raw_name": "TEREYAĞLI KARİDES MANTARSIZ",
    "name": "Sade Tereyağlı Karides (Mantarsız)",
    "price": 700,
    "category": "ara-sicaklar",
    "description": "Sadece sarımsak, tereyağı ve karides sevenler için özel.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00206",
    "raw_name": "Y.P.Ü.SICAK DOMATES",
    "name": "Yoğurtlu Patlıcan Üzeri Sıcak Domates",
    "price": 300,
    "category": "ara-sicaklar",
    "description": "Köz patlıcanlı yoğurt tabanında tereyağında fırınlanmış sıcak domates.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00207",
    "raw_name": "YAPRAK CİĞER",
    "name": "Edirne Usulü Çıtır Yaprak Ciğer",
    "price": 600,
    "category": "ara-sicaklar",
    "description": "Kusursuz incelikte kesilmiş, unlanıp kızartılmış çıtır kuzu ciğeri.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00208",
    "raw_name": "YAPRAK CİĞER 1.5",
    "name": "Yaprak Ciğer (1.5 Porsiyon)",
    "price": 750,
    "category": "ara-sicaklar",
    "description": "Doyurucu porsiyon çıtır yaprak ciğer, sumaklı soğanla.",
    "badge": "Büyük Porsiyon",
    "is_signature": false
  },
  {
    "id": "ST00209",
    "raw_name": "YOĞURTLU EV PATATES",
    "name": "Yoğurtlu Soslu Ev Patatesi",
    "price": 450,
    "category": "ara-sicaklar",
    "description": "El kesimi altın kızarmış patatesler, süzme yoğurt ve tereyağlı biber sos.",
    "badge": "Sıcak Meze",
    "is_signature": false
  },
  {
    "id": "ST00888",
    "raw_name": "ZİNNUR",
    "name": "Zinnur Spesiyal Sıcak Meze",
    "price": 650,
    "category": "ara-sicaklar",
    "description": "Tuzla Balık mutfağının sır tarifli sıcak mezesi.",
    "badge": "Spesiyal",
    "is_signature": false
  },
  {
    "id": "ST00685",
    "raw_name": "ADABEYİ",
    "name": "Adabeyi Balığı (İskorpit)",
    "price": 2000,
    "category": "baliklar",
    "description": "Ege derinliklerinden lezzetli beyaz etli Adabeyi; çorba, buğulama veya tava.",
    "badge": "Mevsim Balığı",
    "is_signature": false
  },
  {
    "id": "ST00848",
    "raw_name": "ADABEYİ LOKUM",
    "name": "Adabeyi Lokum Fileto",
    "price": 2500,
    "category": "baliklar",
    "description": "Kılçıksız temizlenmiş, lokum gibi yumuşacık tereyağında Adabeyi fileto.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00803",
    "raw_name": "AKYA",
    "name": "Akya Balığı (Kuzu Balığı)",
    "price": 2000,
    "category": "baliklar",
    "description": "Akdeniz ve Ege'nin güçlü balığı Akya; kalın ızgara dilim.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00738",
    "raw_name": "AKYA BÜTÜN",
    "name": "Bütün Akya Izgara",
    "price": 2000,
    "category": "baliklar",
    "description": "Kömür ateşinde bütün pişirilmiş taze Akya balığı.",
    "badge": "Bütün Balık",
    "is_signature": false
  },
  {
    "id": "ST00413",
    "raw_name": "BALIK PİŞİRME",
    "name": "Balık Pişirme Servisi",
    "price": 400,
    "category": "baliklar",
    "description": "Misafirimizin getirdiği balığın ustalarımızca tava veya ızgarada pişirilmesi.",
    "badge": "Servis",
    "is_signature": false
  },
  {
    "id": "ST00853",
    "raw_name": "BALIK ŞAŞLIK",
    "name": "Balık Şaşlık",
    "price": 750,
    "category": "baliklar",
    "description": "Özel marinasyonlu taze balık parçaları ve arpacık soğan şişte kömürde.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00659",
    "raw_name": "BARBUN",
    "name": "Kaya Barbunu",
    "price": 3000,
    "category": "baliklar",
    "description": "Ege'nin kırmızısı kaya barbunu; unlanıp tavada nar gibi kızartılmış.",
    "badge": "Tava / Izgara",
    "is_signature": false
  },
  {
    "id": "ST00658",
    "raw_name": "ÇUPRA",
    "name": "Deniz Çuprası",
    "price": 1750,
    "category": "baliklar",
    "description": "Kömür ızgarasında içi sulu dışı çıtır pişirilmiş taze Ege çuprası.",
    "badge": "Izgara / Tava",
    "is_signature": false
  },
  {
    "id": "ST00667",
    "raw_name": "DİL",
    "name": "Ege Dil Balığı",
    "price": 2500,
    "category": "baliklar",
    "description": "Kılçığı tek hamlede ayrılan, tereyağında tavada veya ızgarada dil balığı.",
    "badge": "Tava / Şiş",
    "is_signature": false
  },
  {
    "id": "ST00665",
    "raw_name": "DÜLGER",
    "name": "Dülger Balığı (St. Pierre)",
    "price": 2000,
    "category": "baliklar",
    "description": "Derin suların en lezzetli balıklarından Dülger tava veya ızgara.",
    "badge": "Özel Balık",
    "is_signature": true
  },
  {
    "id": "ST00664",
    "raw_name": "FENER",
    "name": "Fener Balığı",
    "price": 1700,
    "category": "baliklar",
    "description": "Kemiksiz, ıstakoz dokusunda beyaz etli fener balığı güveç veya tava.",
    "badge": "Tava / Güveç",
    "is_signature": false
  },
  {
    "id": "ST00845",
    "raw_name": "FENER LOKUM",
    "name": "Fener Lokum",
    "price": 2500,
    "category": "baliklar",
    "description": "Kılçıksız lokum doğranmış fener balığı filetosu tereyağında sote.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00666",
    "raw_name": "GRANYÖZ",
    "name": "Granyöz (Kaya Levreği)",
    "price": 1800,
    "category": "baliklar",
    "description": "Etli ve sulu kaya levreği kömür ateşinde enfes ızgara.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00844",
    "raw_name": "GRANYÖZ LOKUM",
    "name": "Granyöz Lokum",
    "price": 2750,
    "category": "baliklar",
    "description": "Kaya levreğinden hazırlanan tereyağlı lokum fileto porsiyon.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00735",
    "raw_name": "GRANYÖZ PARÇA",
    "name": "Granyöz Takoz Izgara",
    "price": 2500,
    "category": "baliklar",
    "description": "Kaya levreği takoz kesim ızgara dilim.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00414",
    "raw_name": "HAMSİ PORSİYON DERİN YAĞDA",
    "name": "Çıtır Hamsi Tava",
    "price": 600,
    "category": "baliklar",
    "description": "Mısır ununa bulanıp nar gibi çıtır kızartılmış Karadeniz hamsisi.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00877",
    "raw_name": "ISTAKOZ",
    "name": "Canlı Deniz Istakozu",
    "price": 3500,
    "category": "baliklar",
    "description": "Buharda veya tereyağında ızgaralanmış lüks deniz ıstakozu ziyafeti.",
    "badge": "Lüks",
    "is_signature": true
  },
  {
    "id": "ST00789",
    "raw_name": "KALKAN",
    "name": "Karadeniz Kalkan Balığı",
    "price": 3000,
    "category": "baliklar",
    "description": "Tavada tereyağında nar gibi pişmiş nefis kalkan balığı.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00790",
    "raw_name": "KALKAN PARÇA",
    "name": "Kalkan Takoz Dilim",
    "price": 3250,
    "category": "baliklar",
    "description": "Kalın etli kalkan takoz tava porsiyonu.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00570",
    "raw_name": "KARADENİZ USULÜ HAMSİ TAVA",
    "name": "Karadeniz Usulü Çıtır Hamsi",
    "price": 600,
    "category": "baliklar",
    "description": "Halka dizilmiş mısır unlu çıtır hamsi tava, roka ve soğanla.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00867",
    "raw_name": "KILIÇ",
    "name": "Kılıç Balığı Şiş / Izgara",
    "price": 2500,
    "category": "baliklar",
    "description": "Ege kılıç balığı kalın takoz ızgara veya defne yapraklı şişte.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00683",
    "raw_name": "KIRLANGIÇ",
    "name": "Kırlangıç Balığı",
    "price": 2500,
    "category": "baliklar",
    "description": "Çorbası ve buğulamasıyla meşhur taptaze kırlangıç balığı.",
    "badge": "Buğulama",
    "is_signature": false
  },
  {
    "id": "ST00850",
    "raw_name": "KIRLANGIÇ LOKUM",
    "name": "Kırlangıç Lokum",
    "price": 2500,
    "category": "baliklar",
    "description": "Tereyağında taze otlarla sotelenmiş kılçıksız kırlangıç lokumu.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00787",
    "raw_name": "KOFANA",
    "name": "Kofana Balığı (Büyük Lüfer)",
    "price": 2500,
    "category": "baliklar",
    "description": "Lüferin en iri ve lezzetli hali Kofana kömür ızgarasında.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00851",
    "raw_name": "KOFANA LOKUM",
    "name": "Kofana Lokum Fileto",
    "price": 3000,
    "category": "baliklar",
    "description": "Kömürde pişirilmiş kofana lokum dilimleri.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00788",
    "raw_name": "KOFANA PARÇA",
    "name": "Kofana Izgara Dilim",
    "price": 2750,
    "category": "baliklar",
    "description": "Kalın kesilmiş kofana ızgara takoz.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00682",
    "raw_name": "LAHOS",
    "name": "Lahos Balığı (Grida)",
    "price": 2500,
    "category": "baliklar",
    "description": "Akdeniz'in beyaz incisi leziz lahos balığı ızgara veya şiş.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00849",
    "raw_name": "LAHOS LOKUM",
    "name": "Lahos Lokum",
    "price": 3000,
    "category": "baliklar",
    "description": "Kılçıksız lahos filetosundan tereyağlı lokum porsiyon.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00740",
    "raw_name": "LAHOS PARÇA",
    "name": "Lahos Izgara Parça",
    "price": 3000,
    "category": "baliklar",
    "description": "Lahos takoz dilim kömür ateşinde ızgara.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00657",
    "raw_name": "LEVREK",
    "name": "Deniz Levreği Izgara",
    "price": 1850,
    "category": "baliklar",
    "description": "Ege deniz levreği kömür ateşinde sulu sulu pişirilir.",
    "badge": "Izgara / Fırın",
    "is_signature": false
  },
  {
    "id": "ST00846",
    "raw_name": "LEVREK LOKUM",
    "name": "Levrek Lokum Fileto",
    "price": 2750,
    "category": "baliklar",
    "description": "Özel marinasyonlu, kılçıksız, tereyağında kızartılmış levrek lokumları.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00847",
    "raw_name": "LEVREK TAKOZ",
    "name": "Levrek Takoz Izgara",
    "price": 2500,
    "category": "baliklar",
    "description": "İri boy levrekten kalın takoz ızgara porsiyon.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00660",
    "raw_name": "LÜFER",
    "name": "Boğaz & Ege Lüferi",
    "price": 2500,
    "category": "baliklar",
    "description": "Mevsimin kraliçesi taze lüfer kömür ızgarasında nar gibi.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00662",
    "raw_name": "MERCAN",
    "name": "Trança / Kırmızı Mercan",
    "price": 2750,
    "category": "baliklar",
    "description": "Ege'nin pembe kabuklu leziz mercan balığı ızgara veya fırında.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00852",
    "raw_name": "MERCAN LOKUM",
    "name": "Mercan Lokum Fileto",
    "price": 3250,
    "category": "baliklar",
    "description": "Temizlenmiş mercan fileto lokumları tereyağında sote.",
    "badge": "Fileto Lokum",
    "is_signature": false
  },
  {
    "id": "ST00661",
    "raw_name": "MIRIMIR",
    "name": "Mırmır Balığı",
    "price": 1700,
    "category": "baliklar",
    "description": "Taze Ege kıyı mırmırı kömür ızgarasında.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00806",
    "raw_name": "ORKİNOS",
    "name": "Orkinos Biftek Izgara",
    "price": 2700,
    "category": "baliklar",
    "description": "Kalın dilim ton balığı / orkinos bifteği ızgara.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00684",
    "raw_name": "PİSİ",
    "name": "Pisi Balığı Tava",
    "price": 2000,
    "category": "baliklar",
    "description": "İnce ve lezzetli beyaz etli pisi balığı tereyağında tavada.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00415",
    "raw_name": "SARDALYA PORSİYON",
    "name": "Ege Sardalya Izgara",
    "price": 600,
    "category": "baliklar",
    "description": "Asma yaprağında veya ızgarada yağlı çıtır Ege sardalyası.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00663",
    "raw_name": "SARI KANAT",
    "name": "Sarıkanat Izgara",
    "price": 1700,
    "category": "baliklar",
    "description": "Taze sarıkanat balığı ızgarada sulu ve lezzetli.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00866",
    "raw_name": "SİNARİT",
    "name": "Sinarit Balığı",
    "price": 2750,
    "category": "baliklar",
    "description": "Ege derin sularının şahı sinarit kömür ızgarasında.",
    "badge": "Izgara / Fırın",
    "is_signature": false
  },
  {
    "id": "ST00793",
    "raw_name": "SOMON",
    "name": "Norveç Somon Izgara",
    "price": 600,
    "category": "baliklar",
    "description": "Omega-3 deposu taze somon fileto ızgara, sebzeler eşliğinde.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00804",
    "raw_name": "TEKİR",
    "name": "Ege Tekir Tava",
    "price": 2500,
    "category": "baliklar",
    "description": "Mısır unlu çıtır Ege tekir balığı tava porsiyonu.",
    "badge": "Tava",
    "is_signature": false
  },
  {
    "id": "ST00472",
    "raw_name": "USKUMRU",
    "name": "Uskumru Izgara",
    "price": 1800,
    "category": "baliklar",
    "description": "Yağlı ve lezzetli uskumru fileto kömür ateşinde ızgara.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00791",
    "raw_name": "YILAN BALIĞI",
    "name": "Yılan Balığı Bütün",
    "price": 2000,
    "category": "baliklar",
    "description": "Yağlı ve besleyici bütün yılan balığı ızgara.",
    "badge": "Özel Balık",
    "is_signature": true
  },
  {
    "id": "ST00792",
    "raw_name": "YILAN BALIĞI PARÇA",
    "name": "Yılan Balığı Parça Izgara",
    "price": 2500,
    "category": "baliklar",
    "description": "Izgarada nar gibi pişmiş dilim yılan balığı.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00210",
    "raw_name": "ANTRİKOT PORSİYON",
    "name": "Dana Antrikot Izgara",
    "price": 800,
    "category": "etler",
    "description": "Özel marine edilmiş 250gr dana antrikot, ızgara sebzeler ve patatesle.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00212",
    "raw_name": "ÇOBAN KAVURMA",
    "name": "Sacda Çoban Kavurma",
    "price": 850,
    "category": "etler",
    "description": "Kuzu eti, arpacık soğan, domates ve biberle sac tavada ağır ağır pişmiş.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00215",
    "raw_name": "DANA BONFİLE PORSİYON",
    "name": "Dana Bonfile Izgara",
    "price": 800,
    "category": "etler",
    "description": "Yumuşacık ızgara dana bonfile dilimleri.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00214",
    "raw_name": "DANA BONFİLE LOKUM TEREYAĞLI",
    "name": "Tereyağlı Dana Bonfile Lokum",
    "price": 850,
    "category": "etler",
    "description": "Cızırdayan tereyağında sotelenmiş lokum kıvamında bonfile dilimleri.",
    "badge": "Şefin İmzası",
    "is_signature": true
  },
  {
    "id": "ST00217",
    "raw_name": "DANA BONFİLE MANTARLI",
    "name": "Mantarlı Dana Bonfile",
    "price": 850,
    "category": "etler",
    "description": "Kremalı taze mantar sosu eşliğinde dana bonfile ızgara.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00218",
    "raw_name": "EKMEK ARASI KÖFTE",
    "name": "Ekmek Arası Kasap Köfte",
    "price": 350,
    "category": "etler",
    "description": "Çıtır ekmek arasında ızgara köfte, domates, soğan ve yeşillik.",
    "badge": "Hızlı & Doyurucu",
    "is_signature": false
  },
  {
    "id": "ST00219",
    "raw_name": "ET SOTE",
    "name": "Tereyağlı Et Sote",
    "price": 850,
    "category": "etler",
    "description": "Küp doğranmış dana eti sebzelerle tavada sotelenmiş.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00220",
    "raw_name": "KABURGA PRS",
    "name": "Kuzu Kaburga (Porsiyon)",
    "price": 425,
    "category": "etler",
    "description": "Kömür ateşinde nar gibi kızarmış kuzu kaburga.",
    "badge": "Kuzu",
    "is_signature": false
  },
  {
    "id": "ST00221",
    "raw_name": "KABURGA PRS 1.5",
    "name": "Kuzu Kaburga (1.5 Porsiyon)",
    "price": 600,
    "category": "etler",
    "description": "Bol porsiyon kuzu kaburga ziyafeti.",
    "badge": "Kuzu",
    "is_signature": false
  },
  {
    "id": "ST00223",
    "raw_name": "KASAP KÖFTE KALEM",
    "name": "Kasap Köfte (Adet)",
    "price": 100,
    "category": "etler",
    "description": "Geleneksel baharatlı ızgara kasap köfte tek kalem.",
    "badge": "Köfte",
    "is_signature": false
  },
  {
    "id": "ST00674",
    "raw_name": "PORSİYON KASAP KÖFTE",
    "name": "Izgara Kasap Köfte (Porsiyon)",
    "price": 450,
    "category": "etler",
    "description": "Közlenmiş domates, biber ve patates eşliğinde tam porsiyon kasap köfte.",
    "badge": "Köfte",
    "is_signature": false
  },
  {
    "id": "ST00745",
    "raw_name": "KAŞARLI KÖFTE PORSİYON",
    "name": "Izgara Kaşarlı Köfte (Porsiyon)",
    "price": 300,
    "category": "etler",
    "description": "İçi erimiş kaşar peyniri dolgulu nefis ızgara köfte porsiyonu.",
    "badge": "Köfte",
    "is_signature": false
  },
  {
    "id": "ST00226",
    "raw_name": "KÖFTE PATATES",
    "name": "Köfte & Çıtır Patates Tabağı",
    "price": 475,
    "category": "etler",
    "description": "Izgara köfteler ve bol altın sarısı patates kızartması tabağı.",
    "badge": "Köfte",
    "is_signature": false
  },
  {
    "id": "ST00227",
    "raw_name": "KUZU BEYTİ KALEM",
    "name": "Kuzu Beyti",
    "price": 450,
    "category": "etler",
    "description": "Zırhta çekilmiş kuzu kıyması, lavaş sarma ve tereyağlı domates sosuyla.",
    "badge": "Kebap",
    "is_signature": false
  },
  {
    "id": "ST00228",
    "raw_name": "KUZU KOKOREÇ KALEM",
    "name": "Kuzu Kokoreç Şiş",
    "price": 350,
    "category": "etler",
    "description": "Özel baharatlı kuzu kokoreç kömür ateşinde şişte çıtır pişmiş.",
    "badge": "Sakatat",
    "is_signature": false
  },
  {
    "id": "ST00229",
    "raw_name": "KUZU KÜŞLEME KALEM",
    "name": "Kuzu Küşleme",
    "price": 600,
    "category": "etler",
    "description": "Kuzunun en yumuşak yeri küşleme, kömür ateşinde pembe ızgaralanmış.",
    "badge": "Kuzu",
    "is_signature": false
  },
  {
    "id": "ST00231",
    "raw_name": "KUZU PİRZOLA PRS",
    "name": "Kuzu Pirzola (Porsiyon)",
    "price": 800,
    "category": "etler",
    "description": "Kömür ızgarasında terbiye edilmiş taptaze kuzu pirzola.",
    "badge": "Kuzu",
    "is_signature": false
  },
  {
    "id": "ST00232",
    "raw_name": "KUZU ŞİŞ KALEM",
    "name": "Kuzu Şiş",
    "price": 375,
    "category": "etler",
    "description": "Marine edilmiş yumuşacık kuzu but etleri şişte köz biber ve domatesle.",
    "badge": "Kuzu",
    "is_signature": false
  },
  {
    "id": "ST00233",
    "raw_name": "LAHMACUN",
    "name": "Taş Fırın Çıtır Lahmacun",
    "price": 325,
    "category": "etler",
    "description": "İncecik çıtır hamur, zırh kıyması ve yeşilliklerle.",
    "badge": "Fırından",
    "is_signature": false
  },
  {
    "id": "ST00225",
    "raw_name": "KASAP SUCUK ŞİŞ",
    "name": "Izgara Kasap Sucuk Şiş",
    "price": 350,
    "category": "etler",
    "description": "Kömürde ızgaralanmış ev yapımı kasap sucuğu.",
    "badge": "Izgara",
    "is_signature": false
  },
  {
    "id": "ST00235",
    "raw_name": "ŞAŞLIK",
    "name": "Dana Şaşlık Izgara",
    "price": 800,
    "category": "etler",
    "description": "Krema ve soğan marinasyonlu dana biftek dilimleri şişte.",
    "badge": "Kırmızı Et",
    "is_signature": false
  },
  {
    "id": "ST00236",
    "raw_name": "TAVUK BONFİLE",
    "name": "Tavuk Bonfile Izgara",
    "price": 325,
    "category": "etler",
    "description": "Marine tavuk göğsü kömür ızgarasında sulu ve hafif.",
    "badge": "Tavuk",
    "is_signature": false
  },
  {
    "id": "ST00238",
    "raw_name": "TAVUK İNCİK PRS",
    "name": "Tavuk İncik Izgara",
    "price": 325,
    "category": "etler",
    "description": "Kemiğinden sıyrılmış yağlı ve lezzetli tavuk incik.",
    "badge": "Tavuk",
    "is_signature": false
  },
  {
    "id": "ST00239",
    "raw_name": "TAVUK KANAT",
    "name": "Izgara Tavuk Kanat",
    "price": 300,
    "category": "etler",
    "description": "Özel soslu kömür ateşinde nar gibi tavuk kanatları.",
    "badge": "Tavuk",
    "is_signature": false
  },
  {
    "id": "ST00242",
    "raw_name": "TAVUK ŞİŞ",
    "name": "Tavuk Şiş Izgara",
    "price": 275,
    "category": "etler",
    "description": "Küp tavuk parçaları, köz biber ve domates eşliğinde.",
    "badge": "Tavuk",
    "is_signature": false
  },
  {
    "id": "ST00001",
    "raw_name": "ÇOBAN SALATA",
    "name": "Klasik Çoban Salatası",
    "price": 300,
    "category": "salatalar",
    "description": "Küp doğranmış tarla domatesi, salatalık, biber, mor soğan, sızma zeytinyağı ve limon.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00002",
    "raw_name": "ÇOBAN SALATA PEYNİRLİ",
    "name": "Ezine Peynirli Çoban Salatası",
    "price": 325,
    "category": "salatalar",
    "description": "Bol küp Ezine beyaz peyniri ve zeytinyağı ile zenginleştirilmiş çoban salata.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00003",
    "raw_name": "GAVURDAĞ",
    "name": "Cevizli Gavurdağı Salatası",
    "price": 350,
    "category": "salatalar",
    "description": "İncecik kıyılmış domates, bol ceviz içi, nar ekşisi ve sumak harmanı.",
    "badge": "En Çok Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00004",
    "raw_name": "GAVURDAĞ TEK",
    "name": "Gavurdağı Salatası (Tek Kişilik)",
    "price": 250,
    "category": "salatalar",
    "description": "Tek kişilik taze cevizli ve nar ekşili Gavurdağı salatası.",
    "badge": "Tek Kişilik",
    "is_signature": false
  },
  {
    "id": "ST00005",
    "raw_name": "İSTANBUL SALATA",
    "name": "İstanbul Salatası",
    "price": 300,
    "category": "salatalar",
    "description": "Mevsim yeşillikleri, çeri domates, mısır ve özel vinegret sos.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00006",
    "raw_name": "KAŞIK SALATA",
    "name": "Antep Usulü Kaşık Salatası",
    "price": 300,
    "category": "salatalar",
    "description": "Kaşıkla yenecek küçüklükte ince doğranmış taze sebzeler ve nar ekşisi.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00007",
    "raw_name": "KAŞIK SALATA PEYNİRLİ",
    "name": "Peynirli Kaşık Salatası",
    "price": 325,
    "category": "salatalar",
    "description": "İnce kıyım kaşık salatası üzerine rendelenmiş Ezine peyniri.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00008",
    "raw_name": "MEVSİM SALATA",
    "name": "Mevsim Salatası",
    "price": 250,
    "category": "salatalar",
    "description": "Havuç, mor lahana, marul, taze yeşillikler ve limon sosu.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00009",
    "raw_name": "MEVSİM SALATA PEYNİRLİ",
    "name": "Peynirli Mevsim Salatası",
    "price": 300,
    "category": "salatalar",
    "description": "Beyaz peynir dilimleri eşliğinde taptaze mevsim sebzeleri.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00778",
    "raw_name": "R.D.P",
    "name": "Roka Domates Peynir Salatası (R.D.P)",
    "price": 300,
    "category": "salatalar",
    "description": "Çıtır roka yaprakları, çeri domatesler, Ezine peyniri ve balzamik sos.",
    "badge": "Popüler",
    "is_signature": false
  },
  {
    "id": "ST00010",
    "raw_name": "R.D.S.P",
    "name": "Roka Domates Salatalık Peynir (R.D.S.P)",
    "price": 300,
    "category": "salatalar",
    "description": "Roka, çeri domates, çıtır salatalık ve Ezine peyniri küpleri.",
    "badge": "Zengin",
    "is_signature": false
  },
  {
    "id": "ST00011",
    "raw_name": "R.D.S",
    "name": "Roka Domates Salatalık Salatası",
    "price": 250,
    "category": "salatalar",
    "description": "Peynirsiz sade taze roka, domates ve salatalık salatası.",
    "badge": "Sade",
    "is_signature": false
  },
  {
    "id": "ST00012",
    "raw_name": "SALATALIK SÖĞÜŞ",
    "name": "Çengelköy Salatalık Söğüş",
    "price": 100,
    "category": "salatalar",
    "description": "Tuz ve zeytinyağı ile dilimlenmiş çıtır salatalık.",
    "badge": "Söğüş",
    "is_signature": false
  },
  {
    "id": "ST00013",
    "raw_name": "TEK ÇOBAN SALATA",
    "name": "Çoban Salata (Tek Kişilik)",
    "price": 200,
    "category": "salatalar",
    "description": "Tek kişilik porsiyon çoban salatası.",
    "badge": "Tek Kişilik",
    "is_signature": false
  },
  {
    "id": "ST00014",
    "raw_name": "TEK KAŞIK SALATA",
    "name": "Kaşık Salatası (Tek Kişilik)",
    "price": 200,
    "category": "salatalar",
    "description": "Tek kişilik nar ekşili kaşık salatası.",
    "badge": "Tek Kişilik",
    "is_signature": false
  },
  {
    "id": "ST00772",
    "raw_name": "TEK R.D.S.P",
    "name": "Roka Domates Peynir (Tek Kişilik)",
    "price": 200,
    "category": "salatalar",
    "description": "Tek kişilik porsiyon taze roka domates ve peynir.",
    "badge": "Tek Kişilik",
    "is_signature": false
  },
  {
    "id": "ST00015",
    "raw_name": "TEK YEŞİL SALATA",
    "name": "Yeşil Salata (Tek Kişilik)",
    "price": 175,
    "category": "salatalar",
    "description": "Taze körpe yeşillikler, limon ve sızma zeytinyağı.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00016",
    "raw_name": "TEK YEŞİL SALATA PEYNİRLİ",
    "name": "Peynirli Yeşil Salata (Tek Kişilik)",
    "price": 200,
    "category": "salatalar",
    "description": "Beyaz peynirli tek kişilik Akdeniz yeşillikleri.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00017",
    "raw_name": "TON BALIKLI SALATA",
    "name": "Akdeniz Ton Balıklı Salata",
    "price": 400,
    "category": "salatalar",
    "description": "Bol taze yeşillik, mısır, kapari, zeytin ve kaliteli ton balığı parçaları.",
    "badge": "Deniz Mahsulü",
    "is_signature": false
  },
  {
    "id": "ST00018",
    "raw_name": "YEŞİL SALATA",
    "name": "Akdeniz Yeşil Salatası",
    "price": 250,
    "category": "salatalar",
    "description": "Göbek marul, Akdeniz yeşillikleri, nane, dereotu ve zeytinyağı.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00019",
    "raw_name": "YEŞİL SALATA PEYNİRLİ",
    "name": "Peynirli Akdeniz Salatası",
    "price": 300,
    "category": "salatalar",
    "description": "Bol yeşillik üzerine ufalanmış Ezine beyaz peyniri ve zeytinler.",
    "badge": "Peynirli",
    "is_signature": false
  },
  {
    "id": "ST00475",
    "raw_name": "YENİ RAKI 20 CL",
    "name": "Yeni Rakı 20 cl",
    "price": 900,
    "category": "rakilar",
    "description": "Geleneksel anason kokusu ve dengeli tadıyla sofraların vazgeçilmezi.",
    "badge": "Yeni Rakı",
    "is_signature": false
  },
  {
    "id": "ST00477",
    "raw_name": "YENİ RAKI 35 CL",
    "name": "Yeni Rakı 35 cl (35'lik)",
    "price": 1350,
    "category": "rakilar",
    "description": "35'lik klasik Yeni Rakı şişesi.",
    "badge": "Yeni Rakı",
    "is_signature": false
  },
  {
    "id": "ST00476",
    "raw_name": "YENİ RAKI 50 CL",
    "name": "Yeni Rakı 50 cl (50'lik)",
    "price": 1700,
    "category": "rakilar",
    "description": "50'lik klasik Yeni Rakı şişesi.",
    "badge": "Yeni Rakı",
    "is_signature": false
  },
  {
    "id": "ST00478",
    "raw_name": "YENİ RAKI 70 CL",
    "name": "Yeni Rakı 70 cl (Büyük)",
    "price": 2150,
    "category": "rakilar",
    "description": "70'lik klasik Yeni Rakı şişesi.",
    "badge": "Yeni Rakı",
    "is_signature": false
  },
  {
    "id": "ST00479",
    "raw_name": "YENİ RAKI 100 CL",
    "name": "Yeni Rakı 100 cl (1 Litre)",
    "price": 2600,
    "category": "rakilar",
    "description": "Kalabalık dost sofralarına özel 100'lük Yeni Rakı.",
    "badge": "Yeni Rakı",
    "is_signature": false
  },
  {
    "id": "ST00558",
    "raw_name": "YENİ RAKI YENİ SERİ 20 CL",
    "name": "Yeni Rakı Yeni Seri 20 cl",
    "price": 900,
    "category": "rakilar",
    "description": "İlk hasat anason tohumlarıyla zenginleştirilmiş yumuşak içim.",
    "badge": "Yeni Seri",
    "is_signature": false
  },
  {
    "id": "ST00559",
    "raw_name": "YENİ RAKI YENİ SERİ 35CL",
    "name": "Yeni Rakı Yeni Seri 35 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "35'lik Yeni Rakı Yeni Seri.",
    "badge": "Yeni Seri",
    "is_signature": false
  },
  {
    "id": "ST00560",
    "raw_name": "YENİ RAKI YENİ SERİ 50 CL",
    "name": "Yeni Rakı Yeni Seri 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Yeni Rakı Yeni Seri.",
    "badge": "Yeni Seri",
    "is_signature": false
  },
  {
    "id": "ST00561",
    "raw_name": "YENİ RAKI YENİ SERİ 70 CL",
    "name": "Yeni Rakı Yeni Seri 70 cl",
    "price": 2300,
    "category": "rakilar",
    "description": "70'lik Yeni Rakı Yeni Seri.",
    "badge": "Yeni Seri",
    "is_signature": false
  },
  {
    "id": "ST00562",
    "raw_name": "YENİ RAKI YENİ SERİ 100 CL",
    "name": "Yeni Rakı Yeni Seri 100 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "100'lük Yeni Rakı Yeni Seri.",
    "badge": "Yeni Seri",
    "is_signature": false
  },
  {
    "id": "ST00553",
    "raw_name": "YENİ RAKI UZUN DEMLEME 20 CL",
    "name": "Yeni Rakı Uzun Demleme 20 cl",
    "price": 1000,
    "category": "rakilar",
    "description": "Bakır imbiklerde 72 saat damıtılmış, ipeksi yumuşaklık.",
    "badge": "Uzun Demleme",
    "is_signature": false
  },
  {
    "id": "ST00554",
    "raw_name": "YENİ RAKI UZUN DEMLEME 35 CL",
    "name": "Yeni Rakı Uzun Demleme 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "35'lik Yeni Rakı Uzun Demleme.",
    "badge": "Uzun Demleme",
    "is_signature": false
  },
  {
    "id": "ST00555",
    "raw_name": "YENİ RAKI UZUN DEMLEME 50 CL",
    "name": "Yeni Rakı Uzun Demleme 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Yeni Rakı Uzun Demleme.",
    "badge": "Uzun Demleme",
    "is_signature": false
  },
  {
    "id": "ST00556",
    "raw_name": "YENİ RAKI UZUN DEMLEME 70 CL",
    "name": "Yeni Rakı Uzun Demleme 70 cl",
    "price": 2600,
    "category": "rakilar",
    "description": "70'lik Yeni Rakı Uzun Demleme.",
    "badge": "Uzun Demleme",
    "is_signature": false
  },
  {
    "id": "ST00557",
    "raw_name": "YENİ RAKI UZUN DEMLEME 100 CL",
    "name": "Yeni Rakı Uzun Demleme 100 cl",
    "price": 2900,
    "category": "rakilar",
    "description": "100'lük Yeni Rakı Uzun Demleme.",
    "badge": "Uzun Demleme",
    "is_signature": false
  },
  {
    "id": "ST00818",
    "raw_name": "YENİ RAKI GİZ 50 CL",
    "name": "Yeni Rakı Giz 50 cl",
    "price": 3750,
    "category": "rakilar",
    "description": "Meşe fıçılarda yıllandırılmış, altın sarısı rengiyle eşsiz gurme rakı.",
    "badge": "Ultra Premium",
    "is_signature": false
  },
  {
    "id": "ST00819",
    "raw_name": "YENİ RAKI PUS 50 CL",
    "name": "Yeni Rakı Pus 50 cl",
    "price": 3750,
    "category": "rakilar",
    "description": "Özel damıtım serisi, gövdeli ve zengin anason karakteri.",
    "badge": "Ultra Premium",
    "is_signature": false
  },
  {
    "id": "ST00483",
    "raw_name": "BEYLERBEYİ GÖBEK RAKI 20 CL",
    "name": "Beylerbeyi Göbek Rakısı 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "%100 yaş üzüm ve sadece göbek distilatından üretilmiş şekersiz lezzet.",
    "badge": "Beylerbeyi Göbek",
    "is_signature": false
  },
  {
    "id": "ST00484",
    "raw_name": "BEYLERBEYİ GÖBEK RAKI 35 CL",
    "name": "Beylerbeyi Göbek Rakısı 35 cl",
    "price": 1450,
    "category": "rakilar",
    "description": "35'lik Beylerbeyi Göbek Rakısı.",
    "badge": "Beylerbeyi Göbek",
    "is_signature": false
  },
  {
    "id": "ST00485",
    "raw_name": "BEYLERBEYİ GÖBEK RAKI 50 CL",
    "name": "Beylerbeyi Göbek Rakısı 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Beylerbeyi Göbek Rakısı.",
    "badge": "Beylerbeyi Göbek",
    "is_signature": false
  },
  {
    "id": "ST00486",
    "raw_name": "BEYLERBEYİ GÖBEK RAKI 70 CL",
    "name": "Beylerbeyi Göbek Rakısı 70 cl",
    "price": 2450,
    "category": "rakilar",
    "description": "70'lik Beylerbeyi Göbek Rakısı (Çok Tercih Edilen).",
    "badge": "Beylerbeyi Göbek",
    "is_signature": false
  },
  {
    "id": "ST00487",
    "raw_name": "BEYLERBEYİ GÖBEK RAKI 100 CL",
    "name": "Beylerbeyi Göbek Rakısı 100 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "100'lük Beylerbeyi Göbek Rakısı.",
    "badge": "Beylerbeyi Göbek",
    "is_signature": false
  },
  {
    "id": "ST00272",
    "raw_name": "BEYLERBEYİ MAVİ 20 CL",
    "name": "Beylerbeyi Mavi Rakı 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "3 kez damıtılmış yaş üzüm rakısı.",
    "badge": "Beylerbeyi Mavi",
    "is_signature": false
  },
  {
    "id": "ST00704",
    "raw_name": "BEYLERBEYİ MAVİ 35 CL",
    "name": "Beylerbeyi Mavi Rakı 35 cl",
    "price": 1450,
    "category": "rakilar",
    "description": "35'lik Beylerbeyi Mavi Rakı.",
    "badge": "Beylerbeyi Mavi",
    "is_signature": false
  },
  {
    "id": "ST00705",
    "raw_name": "BEYLERBEYİ MAVİ 50 CL",
    "name": "Beylerbeyi Mavi Rakı 50 cl",
    "price": 1700,
    "category": "rakilar",
    "description": "50'lik Beylerbeyi Mavi Rakı.",
    "badge": "Beylerbeyi Mavi",
    "is_signature": false
  },
  {
    "id": "ST00706",
    "raw_name": "BEYLERBEYİ MAVİ 70 CL",
    "name": "Beylerbeyi Mavi Rakı 70 cl",
    "price": 2300,
    "category": "rakilar",
    "description": "70'lik Beylerbeyi Mavi Rakı.",
    "badge": "Beylerbeyi Mavi",
    "is_signature": false
  },
  {
    "id": "ST00707",
    "raw_name": "BEYLERBEYİ MAVİ 100 CL",
    "name": "Beylerbeyi Mavi Rakı 100 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "100'lük Beylerbeyi Mavi Rakı.",
    "badge": "Beylerbeyi Mavi",
    "is_signature": false
  },
  {
    "id": "ST00493",
    "raw_name": "BEYLERBEYİ TERRA GOLD 20 CL",
    "name": "Beylerbeyi Terra Gold 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "Meşe fıçıda dinlendirilmiş hafif altın tonlu göbek rakısı.",
    "badge": "Terra Gold",
    "is_signature": false
  },
  {
    "id": "ST00494",
    "raw_name": "BEYLERBEYİ TERRA GOLD 35 CL",
    "name": "Beylerbeyi Terra Gold 35 cl",
    "price": 1450,
    "category": "rakilar",
    "description": "35'lik Beylerbeyi Terra Gold.",
    "badge": "Terra Gold",
    "is_signature": false
  },
  {
    "id": "ST00495",
    "raw_name": "BEYLERBEYİ TERRA GOLD 50 CL",
    "name": "Beylerbeyi Terra Gold 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Beylerbeyi Terra Gold.",
    "badge": "Terra Gold",
    "is_signature": false
  },
  {
    "id": "ST00496",
    "raw_name": "BEYLERBEYİ TERRA GOLD 75 CL",
    "name": "Beylerbeyi Terra Gold 75 cl",
    "price": 2300,
    "category": "rakilar",
    "description": "75'lik Beylerbeyi Terra Gold.",
    "badge": "Terra Gold",
    "is_signature": false
  },
  {
    "id": "ST00497",
    "raw_name": "BEYLERBEYİ TERRA GOLD 100 CL",
    "name": "Beylerbeyi Terra Gold 100 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "100'lük Beylerbeyi Terra Gold.",
    "badge": "Terra Gold",
    "is_signature": false
  },
  {
    "id": "ST00868",
    "raw_name": "BEYLERBEYİ İNCİRDEN 70 CL",
    "name": "Beylerbeyi İncirden 70 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "Ege incirlerinden damıtılmış özel meyvemsi rakı.",
    "badge": "Özel Seri",
    "is_signature": true
  },
  {
    "id": "ST00274",
    "raw_name": "BEYLERBEYİ KALECİK KARASI 70 CL",
    "name": "Beylerbeyi Kalecik Karası 70 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "Kalecik Karası üzümlerinden distile edilmiş aromatize rakı.",
    "badge": "Özel Seri",
    "is_signature": true
  },
  {
    "id": "ST00753",
    "raw_name": "BEYLERBEYİ MARGAZ 20 CL",
    "name": "Beylerbeyi Margaz 20 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "Butik Kaş Margaz bağları üzümlerinden sınırlı üretim.",
    "badge": "Butik Seri",
    "is_signature": false
  },
  {
    "id": "ST00756",
    "raw_name": "BEYLERBEYİ MARGAZ 70 CL",
    "name": "Beylerbeyi Margaz 70 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "70'lik Beylerbeyi Margaz butik rakı.",
    "badge": "Butik Seri",
    "is_signature": false
  },
  {
    "id": "ST00541",
    "raw_name": "TEKİRDAĞ ALTIN SERİ 20 CL",
    "name": "Tekirdağ Altın Seri 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "Meşe fıçılarda dinlendirilmiş efsanevi sarı altın seri.",
    "badge": "Tekirdağ Altın",
    "is_signature": false
  },
  {
    "id": "ST00542",
    "raw_name": "TEKİRDAĞ ALTIN SERİ 35 CL",
    "name": "Tekirdağ Altın Seri 35 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "35'lik Tekirdağ Altın Seri.",
    "badge": "Tekirdağ Altın",
    "is_signature": false
  },
  {
    "id": "ST00543",
    "raw_name": "TEKİRDAĞ ALTIN SERİ 50 CL",
    "name": "Tekirdağ Altın Seri 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Tekirdağ Altın Seri.",
    "badge": "Tekirdağ Altın",
    "is_signature": false
  },
  {
    "id": "ST00544",
    "raw_name": "TEKİRDAĞ ALTIN SERİ 70 CL",
    "name": "Tekirdağ Altın Seri 70 cl",
    "price": 2350,
    "category": "rakilar",
    "description": "70'lik Tekirdağ Altın Seri.",
    "badge": "Tekirdağ Altın",
    "is_signature": false
  },
  {
    "id": "ST00545",
    "raw_name": "TEKİRDAĞ ALTIN SERİ 100 CL",
    "name": "Tekirdağ Altın Seri 100 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "100'lük Tekirdağ Altın Seri.",
    "badge": "Tekirdağ Altın",
    "is_signature": false
  },
  {
    "id": "ST00869",
    "raw_name": "TEKİRDAĞ GÖBEK RAKI 20 CL",
    "name": "Tekirdağ Göbek Rakısı 20 cl",
    "price": 1050,
    "category": "rakilar",
    "description": "Bakır imbiklerin yalnızca orta akımı olan saf göbek kısmı.",
    "badge": "Tekirdağ Göbek",
    "is_signature": false
  },
  {
    "id": "ST00870",
    "raw_name": "TEKİRDAĞ GÖBEK RAKI 35 CL",
    "name": "Tekirdağ Göbek Rakısı 35 cl",
    "price": 1600,
    "category": "rakilar",
    "description": "35'lik Tekirdağ Göbek Rakısı.",
    "badge": "Tekirdağ Göbek",
    "is_signature": false
  },
  {
    "id": "ST00871",
    "raw_name": "TEKİRDAĞ GÖBEK RAKI 50 CL",
    "name": "Tekirdağ Göbek Rakısı 50 cl",
    "price": 1900,
    "category": "rakilar",
    "description": "50'lik Tekirdağ Göbek Rakısı.",
    "badge": "Tekirdağ Göbek",
    "is_signature": false
  },
  {
    "id": "ST00754",
    "raw_name": "TEKİRDAĞ GÖBEK 70 CL",
    "name": "Tekirdağ Göbek Rakısı 70 cl",
    "price": 2500,
    "category": "rakilar",
    "description": "70'lik Tekirdağ Göbek Rakısı.",
    "badge": "Tekirdağ Göbek",
    "is_signature": false
  },
  {
    "id": "ST00755",
    "raw_name": "TEKİRDAĞ GÖBEK 100 CL",
    "name": "Tekirdağ Göbek Rakısı 100 cl",
    "price": 2900,
    "category": "rakilar",
    "description": "100'lük Tekirdağ Göbek Rakısı.",
    "badge": "Tekirdağ Göbek",
    "is_signature": false
  },
  {
    "id": "ST00536",
    "raw_name": "TEKİRDAĞ 20 CL",
    "name": "Tekirdağ Klasik 20 cl",
    "price": 900,
    "category": "rakilar",
    "description": "Geleneksel Trakya yaş üzüm rakısı.",
    "badge": "Tekirdağ",
    "is_signature": false
  },
  {
    "id": "ST00537",
    "raw_name": "TEKİRDAĞ 35 CL",
    "name": "Tekirdağ Klasik 35 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "35'lik Tekirdağ Klasik.",
    "badge": "Tekirdağ",
    "is_signature": false
  },
  {
    "id": "ST00538",
    "raw_name": "TEKİRDAĞ 50 CL",
    "name": "Tekirdağ Klasik 50 cl",
    "price": 1700,
    "category": "rakilar",
    "description": "50'lik Tekirdağ Klasik.",
    "badge": "Tekirdağ",
    "is_signature": false
  },
  {
    "id": "ST00539",
    "raw_name": "TEKİRDAĞ 70 CL",
    "name": "Tekirdağ Klasik 70 cl",
    "price": 2300,
    "category": "rakilar",
    "description": "70'lik Tekirdağ Klasik.",
    "badge": "Tekirdağ",
    "is_signature": false
  },
  {
    "id": "ST00540",
    "raw_name": "TEKİRDAĞ 100 CL",
    "name": "Tekirdağ Klasik 100 cl",
    "price": 2650,
    "category": "rakilar",
    "description": "100'lük Tekirdağ Klasik.",
    "badge": "Tekirdağ",
    "is_signature": false
  },
  {
    "id": "ST00716",
    "raw_name": "TEKİRDAĞ ÖKÜZ GÖZÜ REZERV 20 CL",
    "name": "Tekirdağ Öküzgözü Rezerv 20 cl",
    "price": 1050,
    "category": "rakilar",
    "description": "Elazığ Öküzgözü üzümlerinden damıtılmış özel seri.",
    "badge": "Rezerv Seri",
    "is_signature": false
  },
  {
    "id": "ST00546",
    "raw_name": "TEKİRDAĞ ÖKÜZ GÖZÜ REZERV 35 CL",
    "name": "Tekirdağ Öküzgözü Rezerv 35 cl",
    "price": 1550,
    "category": "rakilar",
    "description": "35'lik Tekirdağ Öküzgözü Rezerv.",
    "badge": "Rezerv Seri",
    "is_signature": false
  },
  {
    "id": "ST00717",
    "raw_name": "TEKİRDAĞ ÖKÜZ GÖZÜ REZERV 50 CL",
    "name": "Tekirdağ Öküzgözü Rezerv 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Tekirdağ Öküzgözü Rezerv.",
    "badge": "Rezerv Seri",
    "is_signature": false
  },
  {
    "id": "ST00547",
    "raw_name": "TEKİRDAĞ ÖKÜZ GÖZÜ REZERV 70 CL",
    "name": "Tekirdağ Öküzgözü Rezerv 70 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "70'lik Tekirdağ Öküzgözü Rezerv.",
    "badge": "Rezerv Seri",
    "is_signature": false
  },
  {
    "id": "ST00718",
    "raw_name": "TEKİRDAĞ ÖKÜZ GÖZÜ REZERV 100 CL",
    "name": "Tekirdağ Öküzgözü Rezerv 100 cl",
    "price": 2900,
    "category": "rakilar",
    "description": "100'lük Tekirdağ Öküzgözü Rezerv.",
    "badge": "Rezerv Seri",
    "is_signature": false
  },
  {
    "id": "ST00548",
    "raw_name": "TEKİRDAĞ TRAKYA SERİSİ 35 CL",
    "name": "Tekirdağ Trakya Serisi 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "Trakya bağlarının özel seçilmiş üzümleri.",
    "badge": "Trakya Serisi",
    "is_signature": false
  },
  {
    "id": "ST00549",
    "raw_name": "TEKİRDAĞ TRAKYA SERİSİ 70 CL",
    "name": "Tekirdağ Trakya Serisi 70 cl",
    "price": 2550,
    "category": "rakilar",
    "description": "70'lik Tekirdağ Trakya Serisi.",
    "badge": "Trakya Serisi",
    "is_signature": false
  },
  {
    "id": "ST00503",
    "raw_name": "EFE GÖBEK RAKI 20 CL",
    "name": "Efe Göbek Rakısı 20 cl",
    "price": 1000,
    "category": "rakilar",
    "description": "Ege yaş üzümlerinden bakır imbiklerde sadece göbek akımı.",
    "badge": "Efe Göbek",
    "is_signature": false
  },
  {
    "id": "ST00504",
    "raw_name": "EFE GÖBEK RAKI 35 CL",
    "name": "Efe Göbek Rakısı 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "35'lik Efe Göbek Rakısı.",
    "badge": "Efe Göbek",
    "is_signature": false
  },
  {
    "id": "ST00505",
    "raw_name": "EFE GÖBEK RAKI 50 CL",
    "name": "Efe Göbek Rakısı 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Efe Göbek Rakısı.",
    "badge": "Efe Göbek",
    "is_signature": false
  },
  {
    "id": "ST00506",
    "raw_name": "EFE GÖBEK RAKI 70 CL",
    "name": "Efe Göbek Rakısı 70 cl",
    "price": 2500,
    "category": "rakilar",
    "description": "70'lik Efe Göbek Rakısı.",
    "badge": "Efe Göbek",
    "is_signature": false
  },
  {
    "id": "ST00507",
    "raw_name": "EFE GÖBEK RAKI 100 CL",
    "name": "Efe Göbek Rakısı 100 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "100'lük Efe Göbek Rakısı.",
    "badge": "Efe Göbek",
    "is_signature": false
  },
  {
    "id": "ST00498",
    "raw_name": "EFE GOLD RAKI 20 CL",
    "name": "Efe Gold Rakı 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "Meşe fıçılarda olgunlaştırılmış altın renkli Efe Gold.",
    "badge": "Efe Gold",
    "is_signature": false
  },
  {
    "id": "ST00499",
    "raw_name": "EFE GOLD RAKI 35 CL",
    "name": "Efe Gold Rakı 35 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "35'lik Efe Gold.",
    "badge": "Efe Gold",
    "is_signature": false
  },
  {
    "id": "ST00500",
    "raw_name": "EFE GOLD RAKI 50 CL",
    "name": "Efe Gold Rakı 50 cl",
    "price": 1700,
    "category": "rakilar",
    "description": "50'lik Efe Gold.",
    "badge": "Efe Gold",
    "is_signature": false
  },
  {
    "id": "ST00501",
    "raw_name": "EFE GOLD RAKI 70 CL",
    "name": "Efe Gold Rakı 70 cl",
    "price": 2350,
    "category": "rakilar",
    "description": "70'lik Efe Gold.",
    "badge": "Efe Gold",
    "is_signature": false
  },
  {
    "id": "ST00502",
    "raw_name": "EFE GOLD RAKI 100 CL",
    "name": "Efe Gold Rakı 100 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "100'lük Efe Gold.",
    "badge": "Efe Gold",
    "is_signature": false
  },
  {
    "id": "ST00508",
    "raw_name": "EFE TEK İMBİK 20 CL",
    "name": "Efe Tek İmbik 20 cl",
    "price": 1050,
    "category": "rakilar",
    "description": "Tek bir bakır imbikte geleneksel zanaatle damıtılmış.",
    "badge": "Tek İmbik",
    "is_signature": false
  },
  {
    "id": "ST00509",
    "raw_name": "EFE TEK İMBİK 35 CL",
    "name": "Efe Tek İmbik 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "35'lik Efe Tek İmbik.",
    "badge": "Tek İmbik",
    "is_signature": false
  },
  {
    "id": "ST00510",
    "raw_name": "EFE TEK İMBİK 50 CL",
    "name": "Efe Tek İmbik 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Efe Tek İmbik.",
    "badge": "Tek İmbik",
    "is_signature": false
  },
  {
    "id": "ST00511",
    "raw_name": "EFE TEK İMBİK 70 CL",
    "name": "Efe Tek İmbik 70 cl",
    "price": 2500,
    "category": "rakilar",
    "description": "70'lik Efe Tek İmbik.",
    "badge": "Tek İmbik",
    "is_signature": false
  },
  {
    "id": "ST00512",
    "raw_name": "EFE TEK İMBİK 100 CL",
    "name": "Efe Tek İmbik 100 cl",
    "price": 2800,
    "category": "rakilar",
    "description": "100'lük Efe Tek İmbik.",
    "badge": "Tek İmbik",
    "is_signature": false
  },
  {
    "id": "ST00513",
    "raw_name": "EFE YEŞİL RAKI 20 CL",
    "name": "Efe Yeşil Rakı 20 cl",
    "price": 950,
    "category": "rakilar",
    "description": "%100 taze yaş üzüm distilesi.",
    "badge": "Efe Yeşil",
    "is_signature": false
  },
  {
    "id": "ST00514",
    "raw_name": "EFE YEŞİL RAKI 35 CL",
    "name": "Efe Yeşil Rakı 35 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "35'lik Efe Yeşil.",
    "badge": "Efe Yeşil",
    "is_signature": false
  },
  {
    "id": "ST00515",
    "raw_name": "EFE YEŞİL RAKI 50 CL",
    "name": "Efe Yeşil Rakı 50 cl",
    "price": 1700,
    "category": "rakilar",
    "description": "50'lik Efe Yeşil.",
    "badge": "Efe Yeşil",
    "is_signature": false
  },
  {
    "id": "ST00516",
    "raw_name": "EFE YEŞİL RAKI 70 CL",
    "name": "Efe Yeşil Rakı 70 cl",
    "price": 2300,
    "category": "rakilar",
    "description": "70'lik Efe Yeşil.",
    "badge": "Efe Yeşil",
    "is_signature": false
  },
  {
    "id": "ST00517",
    "raw_name": "EFE YEŞİL RAKI 100 CL",
    "name": "Efe Yeşil Rakı 100 cl",
    "price": 2650,
    "category": "rakilar",
    "description": "100'lük Efe Yeşil.",
    "badge": "Efe Yeşil",
    "is_signature": false
  },
  {
    "id": "ST00817",
    "raw_name": "EFE 5 YILLIK 70 CL",
    "name": "Efe 5 Yıllık Meşe Fıçı 70 cl",
    "price": 8000,
    "category": "rakilar",
    "description": "Fransız meşe fıçılarda 5 yıl dinlendirilmiş koleksiyonluk başyapıt.",
    "badge": "Koleksiyonluk",
    "is_signature": false
  },
  {
    "id": "ST00532",
    "raw_name": "SARI ZEYBEK 3 MEŞE 20 CL",
    "name": "Sarı Zeybek 3 Meşe 20 cl",
    "price": 975,
    "category": "rakilar",
    "description": "3 farklı meşe fıçıda olgunlaştırılmış, vanilya ve anason aromalı.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00533",
    "raw_name": "SARI ZEYBEK 3 MEŞE 35 CL",
    "name": "Sarı Zeybek 3 Meşe 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "35'lik Sarı Zeybek 3 Meşe.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00676",
    "raw_name": "SARI ZEYBEK 3 MEŞE 50 CL",
    "name": "Sarı Zeybek 3 Meşe 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Sarı Zeybek 3 Meşe.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00288",
    "raw_name": "SARI ZEYBEK 3 MEŞE 70 CL",
    "name": "Sarı Zeybek 3 Meşe 70 cl",
    "price": 2450,
    "category": "rakilar",
    "description": "70'lik Sarı Zeybek 3 Meşe.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00715",
    "raw_name": "SARI ZEYBEK 3 MEŞE 100 CL",
    "name": "Sarı Zeybek 3 Meşe 100 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "100'lük Sarı Zeybek 3 Meşe.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00713",
    "raw_name": "SARI ZEYBEK YAŞ ÜZÜM 20 CL",
    "name": "Sarı Zeybek Yaş Üzüm 20 cl",
    "price": 1000,
    "category": "rakilar",
    "description": "Ege yaş üzümlerinden üretilmiş yumuşak Sarı Zeybek.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00534",
    "raw_name": "SARI ZEYBEK YAŞ ÜZÜM 35 CL",
    "name": "Sarı Zeybek Yaş Üzüm 35 cl",
    "price": 1500,
    "category": "rakilar",
    "description": "35'lik Sarı Zeybek Yaş Üzüm.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00675",
    "raw_name": "SARI ZEYBEK YAŞ ÜZÜM 50 CL",
    "name": "Sarı Zeybek Yaş Üzüm 50 cl",
    "price": 1750,
    "category": "rakilar",
    "description": "50'lik Sarı Zeybek Yaş Üzüm.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00535",
    "raw_name": "SARI ZEYBEK YAŞ ÜZÜM 70 CL",
    "name": "Sarı Zeybek Yaş Üzüm 70 cl",
    "price": 2450,
    "category": "rakilar",
    "description": "70'lik Sarı Zeybek Yaş Üzüm.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00714",
    "raw_name": "SARI ZEYBEK YAŞ ÜZÜM 100 CL",
    "name": "Sarı Zeybek Yaş Üzüm 100 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "100'lük Sarı Zeybek Yaş Üzüm.",
    "badge": "Sarı Zeybek",
    "is_signature": false
  },
  {
    "id": "ST00523",
    "raw_name": "SAKİ GOLD RAKI 20 CL",
    "name": "Saki Gold Rakı 20 cl",
    "price": 1000,
    "category": "rakilar",
    "description": "Manisa Salihli yeraltı kaynak sularıyla filtrelenmiş yumuşak içim.",
    "badge": "Saki Gold",
    "is_signature": false
  },
  {
    "id": "ST00524",
    "raw_name": "SAKİ GOLD RAKI 35 CL",
    "name": "Saki Gold Rakı 35 cl",
    "price": 1450,
    "category": "rakilar",
    "description": "35'lik Saki Gold Rakı.",
    "badge": "Saki Gold",
    "is_signature": false
  },
  {
    "id": "ST00525",
    "raw_name": "SAKİ GOLD RAKI 50 CL",
    "name": "Saki Gold Rakı 50 cl",
    "price": 1800,
    "category": "rakilar",
    "description": "50'lik Saki Gold Rakı.",
    "badge": "Saki Gold",
    "is_signature": false
  },
  {
    "id": "ST00526",
    "raw_name": "SAKİ GOLD RAKI 70 CL",
    "name": "Saki Gold Rakı 70 cl",
    "price": 2500,
    "category": "rakilar",
    "description": "70'lik Saki Gold Rakı.",
    "badge": "Saki Gold",
    "is_signature": false
  },
  {
    "id": "ST00527",
    "raw_name": "SAKİ GOLD RAKI 100 CL",
    "name": "Saki Gold Rakı 100 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "100'lük Saki Gold Rakı.",
    "badge": "Saki Gold",
    "is_signature": false
  },
  {
    "id": "ST00750",
    "raw_name": "SAKİ RAKI DELÜX 35 CL",
    "name": "Saki Deluxe 35 cl",
    "price": 1600,
    "category": "rakilar",
    "description": "Özel gümüş filtreli damıtım Saki Deluxe.",
    "badge": "Saki",
    "is_signature": false
  },
  {
    "id": "ST00680",
    "raw_name": "SAKİ SİYAH ÜZÜM 18 AY 20 CL",
    "name": "Saki Siyah Üzüm 18 Ay 20 cl",
    "price": 975,
    "category": "rakilar",
    "description": "Ege siyah üzümlerinden 18 ay dinlendirilmiş zengin gövdeli rakı.",
    "badge": "Siyah Üzüm",
    "is_signature": false
  },
  {
    "id": "ST00528",
    "raw_name": "SAKİ SİYAH ÜZÜM 18 AY 35 CL",
    "name": "Saki Siyah Üzüm 18 Ay 35 cl",
    "price": 1450,
    "category": "rakilar",
    "description": "35'lik Saki Siyah Üzüm 18 Ay.",
    "badge": "Siyah Üzüm",
    "is_signature": false
  },
  {
    "id": "ST00529",
    "raw_name": "SAKİ SİYAH ÜZÜM 18 AY 50 CL",
    "name": "Saki Siyah Üzüm 18 Ay 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Saki Siyah Üzüm 18 Ay.",
    "badge": "Siyah Üzüm",
    "is_signature": false
  },
  {
    "id": "ST00530",
    "raw_name": "SAKİ SİYAH ÜZÜM 18 AY 70 CL",
    "name": "Saki Siyah Üzüm 18 Ay 70 cl",
    "price": 2450,
    "category": "rakilar",
    "description": "70'lik Saki Siyah Üzüm 18 Ay.",
    "badge": "Siyah Üzüm",
    "is_signature": false
  },
  {
    "id": "ST00531",
    "raw_name": "SAKİ SİYAH ÜZÜM 18 AY 100 CL",
    "name": "Saki Siyah Üzüm 18 Ay 100 cl",
    "price": 2800,
    "category": "rakilar",
    "description": "100'lük Saki Siyah Üzüm 18 Ay.",
    "badge": "Siyah Üzüm",
    "is_signature": false
  },
  {
    "id": "ST00708",
    "raw_name": "KULÜP RAKI 35 CL",
    "name": "Kulüp Rakısı 35 cl",
    "price": 1650,
    "category": "rakilar",
    "description": "1930'lardan günümüze Mengü Ertel tasarımı etiketli efsane rakı.",
    "badge": "Kulüp Rakı",
    "is_signature": false
  },
  {
    "id": "ST00283",
    "raw_name": "KULÜP RAKI 70 CL",
    "name": "Kulüp Rakısı 70 cl (Büyük)",
    "price": 2700,
    "category": "rakilar",
    "description": "%50 alkol derecesi ve yoğun anasonuyla nostaljik meyhane klasiği.",
    "badge": "Kulüp Rakı",
    "is_signature": false
  },
  {
    "id": "ST00709",
    "raw_name": "KULÜP RAKI DELUXE 35 CL",
    "name": "Kulüp Deluxe 35 cl",
    "price": 1650,
    "category": "rakilar",
    "description": "Özel harman Kulüp Deluxe.",
    "badge": "Kulüp Rakı",
    "is_signature": false
  },
  {
    "id": "ST00710",
    "raw_name": "KULÜP RAKI DELUXE 70 CL",
    "name": "Kulüp Deluxe 70 cl",
    "price": 2700,
    "category": "rakilar",
    "description": "70'lik Kulüp Deluxe.",
    "badge": "Kulüp Rakı",
    "is_signature": false
  },
  {
    "id": "ST00711",
    "raw_name": "MERCAN GÖBEK RAKISI 20 CL",
    "name": "Mercan Göbek Rakısı 20 cl",
    "price": 1100,
    "category": "rakilar",
    "description": "Balık sofralarına yakışır göbek distilesi.",
    "badge": "Mercan",
    "is_signature": false
  },
  {
    "id": "ST00712",
    "raw_name": "MERCAN GÖBEK RAKISI 35 CL",
    "name": "Mercan Göbek Rakısı 35 cl",
    "price": 1650,
    "category": "rakilar",
    "description": "35'lik Mercan Göbek Rakısı.",
    "badge": "Mercan",
    "is_signature": false
  },
  {
    "id": "ST00518",
    "raw_name": "MERCAN GÖBEK RAKISI 50 CL",
    "name": "Mercan Göbek Rakısı 50 cl",
    "price": 1950,
    "category": "rakilar",
    "description": "50'lik Mercan Göbek Rakısı.",
    "badge": "Mercan",
    "is_signature": false
  },
  {
    "id": "ST00519",
    "raw_name": "MERCAN GÖBEK RAKISI 70 CL",
    "name": "Mercan Göbek Rakısı 70 cl",
    "price": 2650,
    "category": "rakilar",
    "description": "70'lik Mercan Göbek Rakısı.",
    "badge": "Mercan",
    "is_signature": false
  },
  {
    "id": "ST00520",
    "raw_name": "MERCAN GÖBEK RAKISI 100 CL",
    "name": "Mercan Göbek Rakısı 100 cl",
    "price": 2950,
    "category": "rakilar",
    "description": "100'lük Mercan Göbek Rakısı.",
    "badge": "Mercan",
    "is_signature": false
  },
  {
    "id": "ST00719",
    "raw_name": "USTALARIN KARIŞIMI 20 CL",
    "name": "Ustaların Karışımı 20 cl",
    "price": 1050,
    "category": "rakilar",
    "description": "Yeni Rakı, Tekirdağ ve Altın Seri göbeklerinin usta harmanı.",
    "badge": "Özel Harman",
    "is_signature": true
  },
  {
    "id": "ST00550",
    "raw_name": "USTALARIN KARIŞIMI 35 CL",
    "name": "Ustaların Karışımı 35 cl",
    "price": 1550,
    "category": "rakilar",
    "description": "35'lik Ustaların Karışımı.",
    "badge": "Özel Harman",
    "is_signature": true
  },
  {
    "id": "ST00551",
    "raw_name": "USTALARIN KARIŞIMI 50 CL",
    "name": "Ustaların Karışımı 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Ustaların Karışımı.",
    "badge": "Özel Harman",
    "is_signature": true
  },
  {
    "id": "ST00552",
    "raw_name": "USTALARIN KARIŞIMI 70 CL",
    "name": "Ustaların Karışımı 70 cl",
    "price": 2600,
    "category": "rakilar",
    "description": "70'lik Ustaların Karışımı.",
    "badge": "Özel Harman",
    "is_signature": true
  },
  {
    "id": "ST00720",
    "raw_name": "USTALARIN KARIŞIMI 100 CL",
    "name": "Ustaların Karışımı 100 cl",
    "price": 2900,
    "category": "rakilar",
    "description": "100'lük Ustaların Karışımı.",
    "badge": "Özel Harman",
    "is_signature": true
  },
  {
    "id": "ST00480",
    "raw_name": "ALA RAKI 20 CL",
    "name": "Âlâ Rakı 20 cl",
    "price": 1000,
    "category": "rakilar",
    "description": "Kurutulmuş üzümlerin meşe fıçılarda yıllanmasıyla üretilen lezzet.",
    "badge": "Âlâ",
    "is_signature": false
  },
  {
    "id": "ST00481",
    "raw_name": "ALA RAKI 35 CL",
    "name": "Âlâ Rakı 35 cl",
    "price": 1550,
    "category": "rakilar",
    "description": "35'lik Âlâ Rakı.",
    "badge": "Âlâ",
    "is_signature": false
  },
  {
    "id": "ST00703",
    "raw_name": "ALA RAKI 50 CL",
    "name": "Âlâ Rakı 50 cl",
    "price": 1850,
    "category": "rakilar",
    "description": "50'lik Âlâ Rakı.",
    "badge": "Âlâ",
    "is_signature": false
  },
  {
    "id": "ST00482",
    "raw_name": "ALA RAKI 70 CL",
    "name": "Âlâ Rakı 70 cl",
    "price": 2600,
    "category": "rakilar",
    "description": "70'lik Âlâ Rakı.",
    "badge": "Âlâ",
    "is_signature": false
  },
  {
    "id": "ST00269",
    "raw_name": "ALTINBAŞ 24 AYAR 70 CL",
    "name": "Altınbaş 24 Ayar 70 cl",
    "price": 2650,
    "category": "rakilar",
    "description": "Cumhuriyet geleneğinin en prestijli sek içilen rakısı.",
    "badge": "Prestij",
    "is_signature": false
  },
  {
    "id": "ST00270",
    "raw_name": "ALTINBAŞ 70CL SİYAH",
    "name": "Altınbaş Siyah Seri 70 cl",
    "price": 2650,
    "category": "rakilar",
    "description": "70'lik Altınbaş Klasik Siyah Şişe.",
    "badge": "Prestij",
    "is_signature": false
  },
  {
    "id": "ST00751",
    "raw_name": "PROTOTİP RAKI 70 CL",
    "name": "Prototip No:1 Rakı 70 cl",
    "price": 3250,
    "category": "rakilar",
    "description": "Butik damıtım ustalarının imza gurme rakısı.",
    "badge": "Koleksiyonluk",
    "is_signature": false
  },
  {
    "id": "ST00521",
    "raw_name": "NO:10 35 CL",
    "name": "No:10 Rakı 35 cl",
    "price": 1800,
    "category": "rakilar",
    "description": "Bakır imbik no 10'da damıtılmış seçkin lezzet.",
    "badge": "Premium",
    "is_signature": false
  },
  {
    "id": "ST00522",
    "raw_name": "NO:10 70 CL",
    "name": "No:10 Rakı 70 cl",
    "price": 2750,
    "category": "rakilar",
    "description": "70'lik No:10 Rakı.",
    "badge": "Premium",
    "is_signature": false
  },
  {
    "id": "ST00757",
    "raw_name": "MTAILAT ARAK 20 CL",
    "name": "Mtailat Arak 20 cl",
    "price": 1400,
    "category": "rakilar",
    "description": "Geleneksel Ortadoğu arak distilasyonu.",
    "badge": "Arak",
    "is_signature": false
  },
  {
    "id": "ST00752",
    "raw_name": "MTAILAT ARAK RAKI 70 CL",
    "name": "Mtailat Arak Rakı 70 cl",
    "price": 3250,
    "category": "rakilar",
    "description": "70'lik Mtailat Arak Rakı.",
    "badge": "Arak",
    "is_signature": false
  },
  {
    "id": "ST00290",
    "raw_name": "TEK RAKI",
    "name": "Tek Kadeh Rakı (Tek)",
    "price": 300,
    "category": "rakilar",
    "description": "Buz ve soğuk su eşliğinde tek kadeh servis.",
    "badge": "Kadeh",
    "is_signature": false
  },
  {
    "id": "ST00277",
    "raw_name": "DUBLE RAKI",
    "name": "Duble Kadeh Rakı (Duble)",
    "price": 400,
    "category": "rakilar",
    "description": "Buz ve soğuk su eşliğinde duble kadeh servis.",
    "badge": "Kadeh",
    "is_signature": false
  },
  {
    "id": "ST00282",
    "raw_name": "KARAR RAKI",
    "name": "Karar Kadeh Rakı",
    "price": 350,
    "category": "rakilar",
    "description": "Tam kararında servis edilen kadeh rakı.",
    "badge": "Kadeh",
    "is_signature": false
  },
  {
    "id": "ST00307",
    "raw_name": "KADEH BEYAZ ŞARAP",
    "name": "Kadeh Beyaz Şarap",
    "price": 400,
    "category": "saraplar",
    "description": "Mevsimin ferahlatıcı sek beyaz şarabı kadeh servis.",
    "badge": "Kadeh Şarap",
    "is_signature": false
  },
  {
    "id": "ST00308",
    "raw_name": "KADEH KIRMIZI ŞARAP",
    "name": "Kadeh Kırmızı Şarap",
    "price": 400,
    "category": "saraplar",
    "description": "Gövdesi dengeli sek kırmızı şarap kadeh servis.",
    "badge": "Kadeh Şarap",
    "is_signature": false
  },
  {
    "id": "ST00728",
    "raw_name": "KADEH ROSE ŞARAP",
    "name": "Kadeh Roze / Blush Şarap",
    "price": 400,
    "category": "saraplar",
    "description": "Meyvemsi ferahlatıcı pembe şarap kadeh servis.",
    "badge": "Kadeh Şarap",
    "is_signature": false
  },
  {
    "id": "ST00810",
    "raw_name": "KAYRA VİNTAGE CHARDONNAY BEYAZ",
    "name": "Kayra Vintage Chardonnay Beyaz 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Şarköy bağları, meşe fıçı dokunuşlu kremamsı gövde.",
    "badge": "Kayra Vintage",
    "is_signature": false
  },
  {
    "id": "ST00811",
    "raw_name": "KAYRA VİNTAGE NARİNCE BEYAZ",
    "name": "Kayra Vintage Narince Beyaz 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Tokat bağlarının narin ve çiçeksi beyaz üzümü.",
    "badge": "Kayra Vintage",
    "is_signature": false
  },
  {
    "id": "ST00829",
    "raw_name": "KAYRA VİNTAGE CABERNET KIRMIZI",
    "name": "Kayra Vintage Cabernet Sauvignon 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Koyu yakut renkli, vanilya ve böğürtlen notaları.",
    "badge": "Kayra Vintage",
    "is_signature": false
  },
  {
    "id": "ST00840",
    "raw_name": "KAYRA VINTAGE ÖKÜZGÖZÜ ROSE",
    "name": "Kayra Vintage Öküzgözü Roze 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Taze ahududu ve çilek aromalı zarif roze şarap.",
    "badge": "Kayra Vintage",
    "is_signature": false
  },
  {
    "id": "ST00309",
    "raw_name": "KAYRA VİNTAGE ŞİŞE GRUBU 75 CL",
    "name": "Kayra Vintage Rezerv 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Özel seçki Kayra Vintage şişesi.",
    "badge": "Kayra Vintage",
    "is_signature": false
  },
  {
    "id": "ST00813",
    "raw_name": "KAYRA ALLURE SAUVIGNON BEYAZ",
    "name": "Kayra Allure Sauvignon Blanc 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Taze kesilmiş çimen, yeşil elma ve turunçgil tazeliği.",
    "badge": "Kayra Allure",
    "is_signature": false
  },
  {
    "id": "ST00812",
    "raw_name": "KAYRA ALLURE CHARDONNAY BEYAZ",
    "name": "Kayra Allure Chardonnay 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Diri asidite ve ferahlatıcı tropik meyve notaları.",
    "badge": "Kayra Allure",
    "is_signature": false
  },
  {
    "id": "ST00828",
    "raw_name": "KAYRA ALLURE ŞARAP KIRMIZI",
    "name": "Kayra Allure Kırmızı 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Meyvemsi ve yumuşak tanenli zarif kırmızı.",
    "badge": "Kayra Allure",
    "is_signature": false
  },
  {
    "id": "ST00832",
    "raw_name": "KAYRA MERLOT KIRMIZI",
    "name": "Kayra Merlot Kırmızı 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Kadifemsi dokuda olgun mürdüm eriği tatları.",
    "badge": "Kayra",
    "is_signature": false
  },
  {
    "id": "ST00724",
    "raw_name": "SARAFİN ŞİŞE GRUBU 75 CL",
    "name": "Sarafin Özel Rezerv 75 cl",
    "price": 2900,
    "category": "saraplar",
    "description": "Saroz Körfezi bağlarının seçkin Fransız meşe fıçı şarabı.",
    "badge": "Sarafin",
    "is_signature": false
  },
  {
    "id": "ST00833",
    "raw_name": "SARAFİN CABERNET KIRMIZI",
    "name": "Sarafin Cabernet Sauvignon 75 cl",
    "price": 2900,
    "category": "saraplar",
    "description": "Zengin gövdeli, sedir ağacı ve frenk üzümü bukeli.",
    "badge": "Sarafin",
    "is_signature": false
  },
  {
    "id": "ST00834",
    "raw_name": "SARAFİN MERLOT KIRMIZI",
    "name": "Sarafin Merlot 75 cl",
    "price": 2900,
    "category": "saraplar",
    "description": "Yumuşak tanenli, vişne ve bitter çikolata aromalı.",
    "badge": "Sarafin",
    "is_signature": false
  },
  {
    "id": "ST00305",
    "raw_name": "CONSENSUS ŞİŞE GRUBU 75 CL",
    "name": "Consensus Kırmızı / Beyaz 75 cl",
    "price": 3500,
    "category": "saraplar",
    "description": "İzmir Urla bağlarının ödüllü zirve kupajı.",
    "badge": "Consensus",
    "is_signature": false
  },
  {
    "id": "ST00316",
    "raw_name": "YANIK ÜLKE ŞİŞE GRUBU 75 CL",
    "name": "Yanık Ülke Kula Bağları 75 cl",
    "price": 3250,
    "category": "saraplar",
    "description": "Volkanik Kula topraklarında yetişen üzümlerden mineral zenginliği.",
    "badge": "Yanık Ülke",
    "is_signature": false
  },
  {
    "id": "ST00808",
    "raw_name": "CİELO CHARDONNAY BEYAZ",
    "name": "Cielo Chardonnay Beyaz 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "İtalyan Veneto bölgesinden taze ve canlı beyaz şarap.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00809",
    "raw_name": "CİELO PİNOT BEYAZ",
    "name": "Cielo Pinot Grigio Beyaz 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Deniz ürünleriyle kusursuz uyum sağlayan İtalyan klasiği.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00841",
    "raw_name": "CİELO PİNOT GRİGİO ROSE",
    "name": "Cielo Pinot Grigio Blush / Rose 75 cl",
    "price": 2100,
    "category": "saraplar",
    "description": "Pembe yansımalı, çiçeksi ve ferah İtalyan roze.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00831",
    "raw_name": "CİELO CABERNET KIRMIZI",
    "name": "Cielo Cabernet Sauvignon 75 cl",
    "price": 2100,
    "category": "saraplar",
    "description": "Kırmızı meyve aromalı İtalyan sofralık kırmızı.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00826",
    "raw_name": "CİELO MERLOT KIRMIZI",
    "name": "Cielo Merlot 75 cl",
    "price": 2100,
    "category": "saraplar",
    "description": "Yumuşak içimli İtalyan Merlot.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00802",
    "raw_name": "CİELO PRIMASOLE 75CL",
    "name": "Cielo Primasole Primitivo 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Güney İtalya güneşiyle olgunlaşmış Primitivo zenginliği.",
    "badge": "Cielo İtalya",
    "is_signature": false
  },
  {
    "id": "ST00301",
    "raw_name": "AMATORE ROSE ŞİŞE GRUBU 75 CL",
    "name": "Amatore Verona Rose 75 cl",
    "price": 2500,
    "category": "saraplar",
    "description": "Verona bağlarının zarif ve romantik roze şarabı.",
    "badge": "İthal Roze",
    "is_signature": false
  },
  {
    "id": "ST00310",
    "raw_name": "LEONA BLUSH 75 CL",
    "name": "Leona Blush 75 cl",
    "price": 2100,
    "category": "saraplar",
    "description": "Kalecik Karası ve Shiraz üzümlerinden taze pembe şarap.",
    "badge": "Blush",
    "is_signature": false
  },
  {
    "id": "ST00313",
    "raw_name": "SMYRNA BLUSH 75 CL",
    "name": "Smyrna Blush 75 cl",
    "price": 2100,
    "category": "saraplar",
    "description": "İzmir yöresi üzümlerinden üretilmiş yerel ferah blush.",
    "badge": "Blush",
    "is_signature": false
  },
  {
    "id": "ST00727",
    "raw_name": "MON REVE 75 CL",
    "name": "Mon Rêve Şişe 75 cl",
    "price": 2200,
    "category": "saraplar",
    "description": "Fransız esintili dengeli ve zarif sofra şarabı.",
    "badge": "Mon Rêve",
    "is_signature": false
  },
  {
    "id": "ST00311",
    "raw_name": "PREMATURE SOLE 75 CL",
    "name": "Premature Sole 75 cl",
    "price": 2500,
    "category": "saraplar",
    "description": "Güneşli Akdeniz bağlarının özel kupajı.",
    "badge": "Özel Seri",
    "is_signature": true
  },
  {
    "id": "ST00800",
    "raw_name": "PRINZ HESSEN 75CL",
    "name": "Prinz von Hessen Riesling 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Alman Rheingau bölgesinin seçkin mineral beyaz Riesling şarabı.",
    "badge": "İthal Beyaz",
    "is_signature": false
  },
  {
    "id": "ST00801",
    "raw_name": "KAVAKLIDERE EMİR 75CL",
    "name": "Kavaklıdere Emir Beyaz 75 cl",
    "price": 2400,
    "category": "saraplar",
    "description": "Kapadokya volkanik topraklarının gevrek ve diri beyaz üzümü.",
    "badge": "Kavaklıdere",
    "is_signature": false
  },
  {
    "id": "ST00838",
    "raw_name": "KAV ÖKÜZGÖZÜ KIRMIZI",
    "name": "Kav Öküzgözü Kırmızı 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Doğu Anadolu Öküzgözü üzümlerinin meşe fıçı rezervi.",
    "badge": "Kav Rezerv",
    "is_signature": false
  },
  {
    "id": "ST00725",
    "raw_name": "KAV ŞİŞE GRUBU 75 CL",
    "name": "Kav Boğazkere / Öküzgözü 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Zengin tanenli geleneksel Kav şarabı.",
    "badge": "Kav Rezerv",
    "is_signature": false
  },
  {
    "id": "ST00723",
    "raw_name": "DLC ŞİŞE GRUBU 75 CL",
    "name": "DLC (Doluca) Şişe 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Doluca'nın dengeli sek sofra şarapları serisi.",
    "badge": "Doluca",
    "is_signature": false
  },
  {
    "id": "ST00839",
    "raw_name": "DOLUCA MERLOT KIRMIZI",
    "name": "Doluca Merlot Kırmızı 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Meyvemsi ve yuvarlak gövdeli kırmızı.",
    "badge": "Doluca",
    "is_signature": false
  },
  {
    "id": "ST00827",
    "raw_name": "DOLUCA ÖKÜZGÖZÜ KIRMIZI",
    "name": "Doluca Öküzgözü Kırmızı 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Milli üzümümüz Öküzgözü'nün canlı yakut tonu.",
    "badge": "Doluca",
    "is_signature": false
  },
  {
    "id": "ST00722",
    "raw_name": "DOLUCA ŞİŞE GRUBU 75 CL",
    "name": "Doluca Klasik Şişe 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Yılların güvenilir şarap klasiği.",
    "badge": "Doluca",
    "is_signature": false
  },
  {
    "id": "ST00726",
    "raw_name": "VİLLA DOLUCA 75 CL",
    "name": "Villa Doluca Klasik 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Türkiye'nin en köklü sofra şarabı.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00721",
    "raw_name": "BUZBAĞ ŞİŞE GRUBU 75 CL",
    "name": "Buzbağ Rezerv 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Elazığ Öküzgözü ve Boğazkere efsanesi.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00315",
    "raw_name": "YAKUT ŞİŞE GRUBU 75 CL",
    "name": "Yakut Kırmızı 75 cl",
    "price": 2300,
    "category": "saraplar",
    "description": "Kavaklıdere'nin en sevilen kırmızı kupajı.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00306",
    "raw_name": "İDOL ŞİŞE GRUBU 75 CL",
    "name": "İdol Ege Bağları 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Ege bağlarının taze sofralık şarabı.",
    "badge": "Ege",
    "is_signature": false
  },
  {
    "id": "ST00314",
    "raw_name": "TERRA ŞİŞE GRUBU 75 CL",
    "name": "Terra Bağları 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Kayra Terra serisi dengeli sofra şarapları.",
    "badge": "Terra",
    "is_signature": false
  },
  {
    "id": "ST00816",
    "raw_name": "TERRA NARİNCE BEYAZ",
    "name": "Terra Narince Beyaz 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Taze narenciye ve beyaz çiçek bukeli beyaz şarap.",
    "badge": "Terra",
    "is_signature": false
  },
  {
    "id": "ST00824",
    "raw_name": "TERRA ÖKÜZGÖZÜ KIRMIZI",
    "name": "Terra Öküzgözü Kırmızı 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Canlı meyve asiditesiyle et yemeklerine ideal.",
    "badge": "Terra",
    "is_signature": false
  },
  {
    "id": "ST00843",
    "raw_name": "TERRA CABERNET KIRMIZI",
    "name": "Terra Cabernet Sauvignon 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Gövdesi oturmuş koyu kırmızı şarap.",
    "badge": "Terra",
    "is_signature": false
  },
  {
    "id": "ST00836",
    "raw_name": "ANTİK KIRMIZI ŞARAP",
    "name": "Doluca Antik Kırmızı 75 cl",
    "price": 2000,
    "category": "saraplar",
    "description": "Meşe fıçıda yıllandırılmış köklü kupaj.",
    "badge": "Doluca",
    "is_signature": false
  },
  {
    "id": "ST00327",
    "raw_name": "EFES ŞİŞE 50 CL",
    "name": "Efes Pilsen Şişe 50 cl",
    "price": 250,
    "category": "biralar",
    "description": "%100 Türk maltı ile üretilmiş geleneksel lager bira.",
    "badge": "Klasik Bira",
    "is_signature": false
  },
  {
    "id": "ST00325",
    "raw_name": "EFES MALT 50 CL",
    "name": "Efes Malt 50 cl",
    "price": 250,
    "category": "biralar",
    "description": "%100 arpa maltından yumuşak ve dolgun içim.",
    "badge": "Malt Bira",
    "is_signature": false
  },
  {
    "id": "ST00326",
    "raw_name": "EFES ÖZEL SERİ 50 CL",
    "name": "Efes Özel Seri 50 cl",
    "price": 300,
    "category": "biralar",
    "description": "Uzun dinlendirilmiş, ekstra gövdeli özel seri.",
    "badge": "Özel Seri",
    "is_signature": true
  },
  {
    "id": "ST00334",
    "raw_name": "TUBORG",
    "name": "Tuborg Gold 50 cl",
    "price": 250,
    "category": "biralar",
    "description": "%100 malt, Alman saflık yasasına uygun sarı bira.",
    "badge": "Malt Bira",
    "is_signature": false
  },
  {
    "id": "ST00335",
    "raw_name": "TUBORG AMBER 50 CL",
    "name": "Tuborg Amber 50 cl",
    "price": 300,
    "category": "biralar",
    "description": "Kavrulmuş malt aromaları ve kehribar rengiyle zengin lezzet.",
    "badge": "Amber Bira",
    "is_signature": false
  },
  {
    "id": "ST00336",
    "raw_name": "TUBORG FİLTRESİZ",
    "name": "Tuborg Filtresiz 50 cl",
    "price": 300,
    "category": "biralar",
    "description": "Filtrelenmemiş doğal buğulu kıvam ve yoğun malt tadı.",
    "badge": "Filtresiz",
    "is_signature": false
  },
  {
    "id": "ST00799",
    "raw_name": "TUBORG ICE",
    "name": "Tuborg Ice 50 cl",
    "price": 250,
    "category": "biralar",
    "description": "Buz gibi ferahlatıcı hafif içimli soğuk bira.",
    "badge": "Hafif Bira",
    "is_signature": false
  },
  {
    "id": "ST00320",
    "raw_name": "BOMONTİ",
    "name": "Bomonti Filtresiz 50 cl",
    "price": 300,
    "category": "biralar",
    "description": "Türkiye'nin ilk bira fabrikasından yumuşak içimli filtresiz lager.",
    "badge": "Filtresiz",
    "is_signature": false
  },
  {
    "id": "ST00321",
    "raw_name": "CARLSBERG 50 CL",
    "name": "Carlsberg 50 cl",
    "price": 250,
    "category": "biralar",
    "description": "Danimarka klasiği, ferahlatıcı dengeli pilsner.",
    "badge": "İthal / Lisanslı",
    "is_signature": false
  },
  {
    "id": "ST00322",
    "raw_name": "CARLSBERG LUNA 50 CL",
    "name": "Carlsberg Luna 50 cl",
    "price": 300,
    "category": "biralar",
    "description": "Soğuk şerbetçiotu aromasıyla zenginleştirilmiş lager.",
    "badge": "Özel Seri",
    "is_signature": true
  },
  {
    "id": "ST00323",
    "raw_name": "CORONA",
    "name": "Corona Extra 33 cl",
    "price": 400,
    "category": "biralar",
    "description": "Meksika'nın ikonik birası, taze misket limonu dilimiyle servis edilir.",
    "badge": "Meksika Birası",
    "is_signature": false
  },
  {
    "id": "ST00317",
    "raw_name": "AMSTERDAM",
    "name": "Amsterdam Navigator 50 cl",
    "price": 400,
    "category": "biralar",
    "description": "Yüksek alkollü ve gövdeli Hollanda klasiği.",
    "badge": "Yoğun Bira",
    "is_signature": false
  },
  {
    "id": "ST00328",
    "raw_name": "GUINNESS",
    "name": "Guinness Draught 44 cl",
    "price": 400,
    "category": "biralar",
    "description": "İrlanda'nın kadifemsi kremalı köpüğe sahip meşhur siyah stout birası.",
    "badge": "İrlanda Stout",
    "is_signature": false
  },
  {
    "id": "ST00329",
    "raw_name": "HEİNEKEN",
    "name": "Heineken 33 cl",
    "price": 300,
    "category": "biralar",
    "description": "Karakteristik A-mayasıyla ferahlatıcı birinci sınıf Hollanda lagerı.",
    "badge": "Hollanda Birası",
    "is_signature": false
  },
  {
    "id": "ST00319",
    "raw_name": "BLANC",
    "name": "Kronenbourg 1664 Blanc 33 cl",
    "price": 300,
    "category": "biralar",
    "description": "Kişniş ve turunçgil notalarına sahip zarif Fransız buğday birası.",
    "badge": "Buğday Birası",
    "is_signature": false
  },
  {
    "id": "ST00318",
    "raw_name": "BECKS",
    "name": "Beck's 33 cl",
    "price": 300,
    "category": "biralar",
    "description": "Bremen menşeili, şerbetçiotu belirgin Alman pilsneri.",
    "badge": "Alman Birası",
    "is_signature": false
  },
  {
    "id": "ST00331",
    "raw_name": "MİLLER",
    "name": "Miller Genuine Draft 33 cl",
    "price": 300,
    "category": "biralar",
    "description": "Dört kez filtrelenmiş ekstra yumuşak Amerikan lagerı.",
    "badge": "Amerikan",
    "is_signature": false
  },
  {
    "id": "ST00332",
    "raw_name": "MİLLER KÜÇÜK",
    "name": "Miller Küçük Şişe",
    "price": 250,
    "category": "biralar",
    "description": "Hafif ve serinletici küçük boy Miller.",
    "badge": "Amerikan",
    "is_signature": false
  },
  {
    "id": "ST00333",
    "raw_name": "SOL",
    "name": "Sol Cerveza 33 cl",
    "price": 350,
    "category": "biralar",
    "description": "Meksika güneşiyle demlenmiş açık renkli ferah bira.",
    "badge": "Meksika",
    "is_signature": false
  },
  {
    "id": "ST00324",
    "raw_name": "DESPERADOS",
    "name": "Desperados Tekila Aromalı Bira",
    "price": 350,
    "category": "biralar",
    "description": "Tekila ve limon aromalarıyla taçlandırılmış çılgın parti birası.",
    "badge": "Aromalı Bira",
    "is_signature": false
  },
  {
    "id": "ST00337",
    "raw_name": "WEİHENSTEPHANNER 33CL",
    "name": "Weihenstephaner Hefe Weissbier 33 cl",
    "price": 350,
    "category": "biralar",
    "description": "Dünyanın en eski bira fabrikasından muz ve karanfil aromalı buğday birası.",
    "badge": "Alman Buğday",
    "is_signature": false
  },
  {
    "id": "ST00392",
    "raw_name": "CİN TONİK",
    "name": "Klasik Gin & Tonic",
    "price": 350,
    "category": "ithal-ickiler",
    "description": "Premium cin, taze salatalık şeritleri veya limon dilimi ve buzlu tonik.",
    "badge": "Kokteyl",
    "is_signature": false
  },
  {
    "id": "ST00398",
    "raw_name": "LYNCHBURH LEMONADE",
    "name": "Lynchburg Lemonade",
    "price": 400,
    "category": "ithal-ickiler",
    "description": "Jack Daniel's Tennessee viskisi, portakal likörü ve taze limonata.",
    "badge": "Kokteyl",
    "is_signature": false
  },
  {
    "id": "ST00822",
    "raw_name": "APEROL 7O CL",
    "name": "Aperol Şişe 70 cl (Spritz Servisi)",
    "price": 1800,
    "category": "ithal-ickiler",
    "description": "İtalyan aperitifi; Prosecco, soda ve portakal dilimiyle hazırlanır.",
    "badge": "Aperitif",
    "is_signature": false
  },
  {
    "id": "ST00879",
    "raw_name": "BAİLEYS KADEH",
    "name": "Baileys Irish Cream Kadeh",
    "price": 550,
    "category": "ithal-ickiler",
    "description": "İrlanda viskisi ve taze sütün kadifemsi kremalı likörü buzla servis edilir.",
    "badge": "Likör",
    "is_signature": false
  },
  {
    "id": "ST00878",
    "raw_name": "BAİLEYS 70 CL",
    "name": "Baileys Irish Cream 70 cl",
    "price": 2750,
    "category": "ithal-ickiler",
    "description": "70'lik Baileys şişesi.",
    "badge": "Likör",
    "is_signature": false
  },
  {
    "id": "ST00402",
    "raw_name": "TEKİLA SHOT",
    "name": "Olmeca Tekila Shot",
    "price": 300,
    "category": "ithal-ickiler",
    "description": "Tuz ve taze limon dilimi eşliğinde sek tekila shot.",
    "badge": "Shot",
    "is_signature": false
  },
  {
    "id": "ST00694",
    "raw_name": "OLMECA 70 CL",
    "name": "Olmeca Blanco / Gold 70 cl",
    "price": 2450,
    "category": "ithal-ickiler",
    "description": "Meksika'nın en sevilen tekilası.",
    "badge": "Tekila",
    "is_signature": false
  },
  {
    "id": "ST00692",
    "raw_name": "OLMECA 35 CL",
    "name": "Olmeca Tekila 35 cl",
    "price": 1450,
    "category": "ithal-ickiler",
    "description": "35'lik Olmeca Tekila.",
    "badge": "Tekila",
    "is_signature": false
  },
  {
    "id": "ST00695",
    "raw_name": "OLMECA 100 CL",
    "name": "Olmeca Tekila 100 cl",
    "price": 2800,
    "category": "ithal-ickiler",
    "description": "100'lük Olmeca Tekila.",
    "badge": "Tekila",
    "is_signature": false
  },
  {
    "id": "ST00396",
    "raw_name": "JACK DANİELS",
    "name": "Jack Daniel's Old No.7 70 cl",
    "price": 2700,
    "category": "ithal-ickiler",
    "description": "Kömür filtresinden süzülmüş Tennessee viskisi.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00388",
    "raw_name": "CHİVAS REGAL 12 YEAR 100 CL",
    "name": "Chivas Regal 12 Yıl 100 cl",
    "price": 3200,
    "category": "ithal-ickiler",
    "description": "12 yıl dinlendirilmiş İskoç harman viskisi.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00689",
    "raw_name": "CHİVAS REGAL 12 YEAR 70 CL",
    "name": "Chivas Regal 12 Yıl 70 cl",
    "price": 2700,
    "category": "ithal-ickiler",
    "description": "70'lik Chivas Regal 12.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00690",
    "raw_name": "CHİVAS REGAL 12 YEAR 35 CL",
    "name": "Chivas Regal 12 Yıl 35 cl",
    "price": 1650,
    "category": "ithal-ickiler",
    "description": "35'lik Chivas Regal 12.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00389",
    "raw_name": "CHİVAS REGAL 13 YEAR 70 CL",
    "name": "Chivas Regal Extra 13 Yıl 70 cl",
    "price": 2850,
    "category": "ithal-ickiler",
    "description": "Oloroso şeri fıçılarında olgunlaştırılmış.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00390",
    "raw_name": "CHİVAS REGAL 18 YEAR 70 CL",
    "name": "Chivas Regal 18 Yıl 70 cl",
    "price": 3850,
    "category": "ithal-ickiler",
    "description": "85 farklı aroma notasına sahip lüks İskoç viskisi.",
    "badge": "Premium Viski",
    "is_signature": false
  },
  {
    "id": "ST00697",
    "raw_name": "BLACK LABEL 70 CL",
    "name": "Johnnie Walker Black Label 70 cl",
    "price": 2500,
    "category": "ithal-ickiler",
    "description": "12 yıllık İskoç maltlarından isli ve zengin gövde.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00698",
    "raw_name": "BLACK LABEL 100 CL",
    "name": "Johnnie Walker Black Label 100 cl",
    "price": 2900,
    "category": "ithal-ickiler",
    "description": "100'lük Black Label.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00387",
    "raw_name": "BLACK LABEL 35 CL",
    "name": "Johnnie Walker Black Label 35 cl",
    "price": 1500,
    "category": "ithal-ickiler",
    "description": "35'lik Black Label.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00701",
    "raw_name": "RED LABEL 70 CL",
    "name": "Johnnie Walker Red Label 70 cl",
    "price": 2300,
    "category": "ithal-ickiler",
    "description": "Dinamik baharatlı İskoç harmanı.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00699",
    "raw_name": "RED LABEL 35 CL",
    "name": "Johnnie Walker Red Label 35 cl",
    "price": 1350,
    "category": "ithal-ickiler",
    "description": "35'lik Red Label.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00385",
    "raw_name": "BALANTİNES",
    "name": "Ballantine's Finest 70 cl",
    "price": 2300,
    "category": "ithal-ickiler",
    "description": "Yumuşak içimli İskoç klasiği.",
    "badge": "Viski",
    "is_signature": false
  },
  {
    "id": "ST00404",
    "raw_name": "VİSKİ TEK",
    "name": "Viski Tek Kadeh",
    "price": 250,
    "category": "ithal-ickiler",
    "description": "Buz veya sade servis tek kadeh viski.",
    "badge": "Kadeh Viski",
    "is_signature": false
  },
  {
    "id": "ST00403",
    "raw_name": "VİSKİ DUBLE",
    "name": "Viski Duble Kadeh",
    "price": 400,
    "category": "ithal-ickiler",
    "description": "Buzlu veya sek duble viski porsiyonu.",
    "badge": "Kadeh Viski",
    "is_signature": false
  },
  {
    "id": "ST00864",
    "raw_name": "BEEFEATER GİN 70 CL",
    "name": "Beefeater London Dry Gin 70 cl",
    "price": 2400,
    "category": "ithal-ickiler",
    "description": "9 botanikle damıtılmış Londra kuru cini.",
    "badge": "Cin",
    "is_signature": false
  },
  {
    "id": "ST00865",
    "raw_name": "BEEFEATER GİN 35 CL",
    "name": "Beefeater London Dry Gin 35 cl",
    "price": 1300,
    "category": "ithal-ickiler",
    "description": "35'lik Beefeater Cin.",
    "badge": "Cin",
    "is_signature": false
  },
  {
    "id": "ST00394",
    "raw_name": "GORDON CİN",
    "name": "Gordon's London Dry Gin 70 cl",
    "price": 2300,
    "category": "ithal-ickiler",
    "description": "Ardıç meyvesi ağırlıklı klasik İngiliz cini.",
    "badge": "Cin",
    "is_signature": false
  },
  {
    "id": "ST00391",
    "raw_name": "CİN",
    "name": "Kadeh Cin",
    "price": 600,
    "category": "ithal-ickiler",
    "description": "Buzlu veya tonikli kadeh cin servisi.",
    "badge": "Kadeh",
    "is_signature": false
  },
  {
    "id": "ST00384",
    "raw_name": "ABSOLUT",
    "name": "Absolut Vodka 70 cl",
    "price": 2400,
    "category": "ithal-ickiler",
    "description": "%100 kış buğdayından İsveç'in saf votkası.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00688",
    "raw_name": "SMİRNOFF 70 CL",
    "name": "Smirnoff Red Vodka 70 cl",
    "price": 2300,
    "category": "ithal-ickiler",
    "description": "3 kez damıtılmış, 10 kez kömürden filtrelenmiş votka.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00401",
    "raw_name": "SMİRNOFF 35 CL",
    "name": "Smirnoff Vodka 35 cl",
    "price": 1350,
    "category": "ithal-ickiler",
    "description": "35'lik Smirnoff.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00820",
    "raw_name": "SMİRNOFF 1 LT",
    "name": "Smirnoff Vodka 100 cl (1 Lt)",
    "price": 2600,
    "category": "ithal-ickiler",
    "description": "1 Litre Smirnoff.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00821",
    "raw_name": "FINLANDIA 70 CL",
    "name": "Finlandia Vodka 70 cl",
    "price": 2400,
    "category": "ithal-ickiler",
    "description": "Saf buzul kaynak suyuyla üretilmiş Finlandiya votkası.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00395",
    "raw_name": "İSTANBLUE VODKA",
    "name": "İstanblue Vodka 70 cl",
    "price": 1800,
    "category": "ithal-ickiler",
    "description": "Klasik yerli votka.",
    "badge": "Votka",
    "is_signature": false
  },
  {
    "id": "ST00406",
    "raw_name": "VODKA DUBLE",
    "name": "Votka Duble Kadeh",
    "price": 350,
    "category": "ithal-ickiler",
    "description": "Buz ve meyve suyu veya enerji ile kadeh servis.",
    "badge": "Kadeh",
    "is_signature": false
  },
  {
    "id": "ST00405",
    "raw_name": "VODKA ENERJİ",
    "name": "Votka Red Bull",
    "price": 400,
    "category": "ithal-ickiler",
    "description": "Kadehte buzlu votka ve Red Bull enerjisi.",
    "badge": "Kokteyl",
    "is_signature": false
  },
  {
    "id": "ST00386",
    "raw_name": "ADİYOS NIGHT",
    "name": "Adios Motherf***er (AMF Kokteyl)",
    "price": 350,
    "category": "ithal-ickiler",
    "description": "Cin, votka, tekila, rom, blue curacao ve limonata karışımı güçlü kokteyl.",
    "badge": "Kokteyl",
    "is_signature": false
  },
  {
    "id": "ST00346",
    "raw_name": "DONDURMALI FIRIN HELVA",
    "name": "Fırında Dondurmalı Sıcak Helva",
    "price": 325,
    "category": "tatlilar",
    "description": "Toprak güveçte fırınlanmış dumanı tüten tahin helvası, üzerinde Maraş kesme dondurma.",
    "badge": "Balık Sonrası",
    "is_signature": false
  },
  {
    "id": "ST00352",
    "raw_name": "FIRIN HELVA",
    "name": "Fırında Sıcak Tahin Helvası",
    "price": 300,
    "category": "tatlilar",
    "description": "Balık ziyafetinin geleneksel kapanışı; fırında sıcak güveç helva.",
    "badge": "Balık Sonrası",
    "is_signature": false
  },
  {
    "id": "ST00353",
    "raw_name": "FIRIN HELVA CEVİZLİ",
    "name": "Cevizli Fırın Helva",
    "price": 300,
    "category": "tatlilar",
    "description": "Kavrulmuş bol cevizle fırınlanmış sıcak tahin helvası.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00347",
    "raw_name": "DONDURMALI İRMİK",
    "name": "Dondurmalı Sıcak İrmik Helvası",
    "price": 300,
    "category": "tatlilar",
    "description": "Tereyağlı sıcak irmik helvası içinde saklı kaymaklı dondurma sürprizi.",
    "badge": "Sevilen",
    "is_signature": true
  },
  {
    "id": "ST00348",
    "raw_name": "DONDURMALI KATMER",
    "name": "Gaziantep Dondurmalı Çıtır Katmer",
    "price": 325,
    "category": "tatlilar",
    "description": "Fırından yeni çıkmış bol fıstıklı çıtır katmer, Maraş dondurması ile.",
    "badge": "Çıtır",
    "is_signature": false
  },
  {
    "id": "ST00356",
    "raw_name": "HASIR KADAYIF",
    "name": "Sıcak Hasır Kadayıf",
    "price": 275,
    "category": "tatlilar",
    "description": "Çıtır çıtır tereyağlı tel kadayıf, şerbet ve Antep fıstığı.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00861",
    "raw_name": "EKMEK KADAYIFI",
    "name": "Kaymaklı Ekmek Kadayıfı",
    "price": 300,
    "category": "tatlilar",
    "description": "Karamelize şerbetli yumuşacık ekmek kadayıfı ve manda kaymağı.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00656",
    "raw_name": "HÖŞMERİM",
    "name": "Balıkesir Höşmerim Tatlısı",
    "price": 200,
    "category": "tatlilar",
    "description": "Taze peynir ve irmiğin eşsiz uyumu, hafif ılık servis.",
    "badge": "Yöresel",
    "is_signature": false
  },
  {
    "id": "ST00862",
    "raw_name": "SÜTLÜ İNCİR",
    "name": "Sütlü İncir Tatlısı (İncir Uyutması)",
    "price": 300,
    "category": "tatlilar",
    "description": "Kuru Ege incirlerinin sütün sıcaklığında mayalanmasıyla hazırlanan hafif tatlı.",
    "badge": "Ege Tatlısı",
    "is_signature": false
  },
  {
    "id": "ST00774",
    "raw_name": "İNCİR TATLISI KALEM",
    "name": "Cevizli İncir Tatlısı (Adet)",
    "price": 150,
    "category": "tatlilar",
    "description": "Karanfilli şerbette pişmiş ceviz dolgulu incir.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00358",
    "raw_name": "KABAK TATLISI",
    "name": "Tahinli Cevizli Bal Kabağı",
    "price": 300,
    "category": "tatlilar",
    "description": "Ağır ateşte lokum gibi pişirilmiş bal kabağı, bol tahin ve ceviz ile.",
    "badge": "Kış Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00359",
    "raw_name": "KABAK TATLISI KAYMAKLI",
    "name": "Kaymaklı Bal Kabağı Tatlısı",
    "price": 325,
    "category": "tatlilar",
    "description": "Tahin, ceviz ve taze manda kaymağı eşliğinde fırın bal kabağı.",
    "badge": "Kış Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00339",
    "raw_name": "AYVA TATLISI KAYMAKLI - CEVİZLİ",
    "name": "Kaymaklı Cevizli Ayva Tatlısı",
    "price": 300,
    "category": "tatlilar",
    "description": "Kendi renginde fırınlanmış karamelize ayva, manda kaymağı ve ceviz.",
    "badge": "Mevsim Klasiği",
    "is_signature": false
  },
  {
    "id": "ST00362",
    "raw_name": "KAŞIK AYVA",
    "name": "Kaşık Ayva Tatlısı",
    "price": 250,
    "category": "tatlilar",
    "description": "Hafif şerbetli kaşık ayvası.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00354",
    "raw_name": "FIRIN SÜTLAÇ",
    "name": "Hamsiköy Usulü Fırın Sütlaç",
    "price": 250,
    "category": "tatlilar",
    "description": "Üzeri nar gibi fırınlanmış, bol sütlü geleneksel toprak kase sütlaç.",
    "badge": "Sütlü Tatlı",
    "is_signature": false
  },
  {
    "id": "ST00355",
    "raw_name": "FIRIN SÜTLAÇ DONDURMALI",
    "name": "Dondurmalı Fırın Sütlaç",
    "price": 300,
    "category": "tatlilar",
    "description": "Fırın sütlaç üzerinde vanilyalı dondurma lezzeti.",
    "badge": "Sütlü Tatlı",
    "is_signature": false
  },
  {
    "id": "ST00363",
    "raw_name": "KAZANDİBİ",
    "name": "Karamelize Kazandibi",
    "price": 250,
    "category": "tatlilar",
    "description": "Dibi hafif yanık karamelli geleneksel sütlü kazandibi tatlısı.",
    "badge": "Sütlü Tatlı",
    "is_signature": false
  },
  {
    "id": "ST00364",
    "raw_name": "KAZANDİBİ DONDURMALI",
    "name": "Dondurmalı Kazandibi",
    "price": 300,
    "category": "tatlilar",
    "description": "Kaymaklı dondurma ile taçlandırılmış kazandibi.",
    "badge": "Sütlü Tatlı",
    "is_signature": false
  },
  {
    "id": "ST00372",
    "raw_name": "SAKIZLI MUHALLEBİ",
    "name": "Çeşme Sakızlı Muhallebi",
    "price": 250,
    "category": "tatlilar",
    "description": "Gerçek Sakız Adası damla sakızıyla pişirilmiş ipeksi muhallebi.",
    "badge": "Ege Tatlısı",
    "is_signature": false
  },
  {
    "id": "ST00340",
    "raw_name": "BAKLAVA KALEM",
    "name": "Gaziantep Havuç Dilim Baklava",
    "price": 275,
    "category": "tatlilar",
    "description": "Bol fıstıklı çıtır çıtır el açması Gaziantep baklavası.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00345",
    "raw_name": "DONDURMA",
    "name": "Maraş Dondurması (Top)",
    "price": 100,
    "category": "tatlilar",
    "description": "Hakiki keçi sütü ve salep ile dövülmüş Maraş dondurması.",
    "badge": "Serinletici",
    "is_signature": false
  },
  {
    "id": "ST00341",
    "raw_name": "BAL BADEM",
    "name": "Bal Badem Tatlısı",
    "price": 300,
    "category": "tatlilar",
    "description": "Kavrulmuş badem ve süzme çiçek balı eşliğinde nefis tatlı.",
    "badge": "Hafif",
    "is_signature": false
  },
  {
    "id": "ST00343",
    "raw_name": "BALLI CEVİZLİ MUZ",
    "name": "Ballı Cevizli Muz Tabağı",
    "price": 250,
    "category": "tatlilar",
    "description": "Dilimlenmiş taze muz, süzme bal ve ceviz parçaları.",
    "badge": "Meyveli Tatlı",
    "is_signature": false
  },
  {
    "id": "ST00361",
    "raw_name": "KARIŞIK TATLI",
    "name": "Karışık Ziyafet Tatlı Tabağı",
    "price": 350,
    "category": "tatlilar",
    "description": "Fırın helva, irmik, kabak veya mevsim tatlılarından oluşan zengin tadım tabağı.",
    "badge": "Paylaşımlık",
    "is_signature": false
  },
  {
    "id": "ST00367",
    "raw_name": "MEYVE TABAĞI",
    "name": "Mevsim Meyveleri Tabağı",
    "price": 250,
    "category": "tatlilar",
    "description": "Mevsimine göre özenle soyulup dilimlenmiş ferahlatıcı meyve seçkisi.",
    "badge": "Meyve",
    "is_signature": false
  },
  {
    "id": "ST00373",
    "raw_name": "SERPME MEYVE",
    "name": "Buz Üstünde Serpme Meyve",
    "price": 250,
    "category": "tatlilar",
    "description": "Buz dağının üzerinde renk renk sergilenen zengin meyve şöleni.",
    "badge": "Meyve",
    "is_signature": false
  },
  {
    "id": "ST00338",
    "raw_name": "ANANAS",
    "name": "Taze Dilimlenmiş Ananas",
    "price": 250,
    "category": "tatlilar",
    "description": "Tropikal tatlı ve sulu ananas dilimleri.",
    "badge": "Meyve",
    "is_signature": false
  },
  {
    "id": "ST00370",
    "raw_name": "PASTA",
    "name": "Özel Kutlama & Doğum Günü Pastası",
    "price": 750,
    "category": "tatlilar",
    "description": "Masadaki kutlamalar için taze hazırlanan çikolatalı/meyveli yaş pasta.",
    "badge": "Kutlama",
    "is_signature": false
  },
  {
    "id": "ST00244",
    "raw_name": "B. ŞALGAM ACILI",
    "name": "Adana Şalgamı (Büyük - Acılı)",
    "price": 250,
    "category": "mesrubatlar",
    "description": "Rakı sofralarının can yoldaşı acılı mor havuç şalgam suyu.",
    "badge": "Şalgam",
    "is_signature": false
  },
  {
    "id": "ST00733",
    "raw_name": "B. ŞALGAM ACISIZ",
    "name": "Adana Şalgamı (Büyük - Acısız)",
    "price": 250,
    "category": "mesrubatlar",
    "description": "Ferahlatıcı geleneksel acısız şalgam suyu.",
    "badge": "Şalgam",
    "is_signature": false
  },
  {
    "id": "ST00252",
    "raw_name": "K. ŞALGAM ACILI",
    "name": "Küçük Şalgam (Acılı)",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Küçük boy acılı şalgam suyu.",
    "badge": "Şalgam",
    "is_signature": false
  },
  {
    "id": "ST00734",
    "raw_name": "K. ŞALGAM ACISIZ",
    "name": "Küçük Şalgam (Acısız)",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Küçük boy acısız şalgam suyu.",
    "badge": "Şalgam",
    "is_signature": false
  },
  {
    "id": "ST00249",
    "raw_name": "CHURCİLL",
    "name": "Churchill",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Maden suyu, taze sıkılmış limon suyu ve tuzun mükemmel ferahlatıcı karışımı.",
    "badge": "Popüler",
    "is_signature": false
  },
  {
    "id": "ST00256",
    "raw_name": "LİMONATA",
    "name": "Ev Yapımı Taze Nane Limonata",
    "price": 150,
    "category": "mesrubatlar",
    "description": "Taze sıkılmış limon, nane yaprakları ve az şekerle hazırlanan ev yapımı limonata.",
    "badge": "Ev Yapımı",
    "is_signature": false
  },
  {
    "id": "ST00253",
    "raw_name": "KARAF LİMON",
    "name": "Karaf Taze Limon Suyu",
    "price": 200,
    "category": "mesrubatlar",
    "description": "Masada balık ve mezeler için karaf limon suyu.",
    "badge": "Karaf",
    "is_signature": false
  },
  {
    "id": "ST00261",
    "raw_name": "SODA",
    "name": "Doğal Maden Suyu (Kızılay / Beypazarı)",
    "price": 75,
    "category": "mesrubatlar",
    "description": "Cam şişede zengin mineralli doğal maden suyu.",
    "badge": "Soda",
    "is_signature": false
  },
  {
    "id": "ST00262",
    "raw_name": "SODA - LİMON",
    "name": "Maden Suyu & Taze Limon",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Buzlu bardakta limon dilimli maden suyu.",
    "badge": "Soda",
    "is_signature": false
  },
  {
    "id": "ST00254",
    "raw_name": "KOLA",
    "name": "Coca-Cola (Kutu / Cam)",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Buz ve limon eşliğinde.",
    "badge": "Soğuk İçecek",
    "is_signature": false
  },
  {
    "id": "ST00255",
    "raw_name": "KOLA ZERO",
    "name": "Coca-Cola Zero Sugar",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Şekersiz kutu veya cam kola.",
    "badge": "Soğuk İçecek",
    "is_signature": false
  },
  {
    "id": "ST00250",
    "raw_name": "FANTA",
    "name": "Fanta Portakal",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Ferahlatıcı portakal lezzeti.",
    "badge": "Soğuk İçecek",
    "is_signature": false
  },
  {
    "id": "ST00263",
    "raw_name": "SPRİTE",
    "name": "Sprite Limon & Misket Limonu",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Buz gibi gazoz.",
    "badge": "Soğuk İçecek",
    "is_signature": false
  },
  {
    "id": "ST00251",
    "raw_name": "ICE TEA",
    "name": "Fuse Tea Soğuk Çay",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Şeftali veya limon aromalı soğuk çay.",
    "badge": "Soğuk İçecek",
    "is_signature": false
  },
  {
    "id": "ST00248",
    "raw_name": "CAPPY M. SUYU",
    "name": "Cappy Meyve Suyu",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Vişne, şeftali, kayısı seçenekleriyle.",
    "badge": "Meyve Suyu",
    "is_signature": false
  },
  {
    "id": "ST00247",
    "raw_name": "BÜYÜK M. SUYU",
    "name": "Büyük Meyve Suyu Karaf",
    "price": 300,
    "category": "mesrubatlar",
    "description": "Karaf servis meyve suyu.",
    "badge": "Meyve Suyu",
    "is_signature": false
  },
  {
    "id": "ST00245",
    "raw_name": "BÜYÜK ELMA SUYU",
    "name": "Büyük Elma Suyu Karaf",
    "price": 300,
    "category": "mesrubatlar",
    "description": "Taze elma aromalı karaf meyve suyu.",
    "badge": "Meyve Suyu",
    "is_signature": false
  },
  {
    "id": "ST00243",
    "raw_name": "AYRAN",
    "name": "Köy Usulü Yayık Ayranı",
    "price": 125,
    "category": "mesrubatlar",
    "description": "Köpüklü soğuk yayık ayranı.",
    "badge": "Geleneksel",
    "is_signature": false
  },
  {
    "id": "ST00264",
    "raw_name": "SU",
    "name": "Kaynak Suyu (Cam Şişe)",
    "price": 50,
    "category": "mesrubatlar",
    "description": "Doğal kaynak suyu.",
    "badge": "Su",
    "is_signature": false
  },
  {
    "id": "ST00258",
    "raw_name": "RED BULL",
    "name": "Red Bull Enerji İçeceği 250 ml",
    "price": 250,
    "category": "mesrubatlar",
    "description": "Klasik Red Bull enerji içeceği.",
    "badge": "Enerji",
    "is_signature": false
  },
  {
    "id": "ST00246",
    "raw_name": "BÜYÜK ENERJİ İÇECEĞİ",
    "name": "Büyük Enerji İçeceği",
    "price": 300,
    "category": "mesrubatlar",
    "description": "Büyük boy enerji içeceği.",
    "badge": "Enerji",
    "is_signature": false
  },
  {
    "id": "ST00260",
    "raw_name": "SCHWEPPES 1 LT",
    "name": "Schweppes Mandalin / Bitter Lemon 1 Lt",
    "price": 200,
    "category": "mesrubatlar",
    "description": "Serinletici aromalı gazlı içecek.",
    "badge": "Tonik",
    "is_signature": false
  },
  {
    "id": "ST00266",
    "raw_name": "ULUDAĞ TONİK 33CL",
    "name": "Uludağ Premium Tonik 33 cl",
    "price": 150,
    "category": "mesrubatlar",
    "description": "Cin ve kokteyller için kaliteli tonik.",
    "badge": "Tonik",
    "is_signature": false
  },
  {
    "id": "ST00265",
    "raw_name": "TÜRK KAHVESİ",
    "name": "Geleneksel Közde Türk Kahvesi",
    "price": 100,
    "category": "mesrubatlar",
    "description": "Lokum ve su eşliğinde bakır cezvede pişmiş bol köpüklü Türk kahvesi.",
    "badge": "Sıcak İçecek",
    "is_signature": false
  },
  {
    "id": "ST00257",
    "raw_name": "NESCAFE",
    "name": "Sıcak Filtre Kahve / Nescafe",
    "price": 100,
    "category": "mesrubatlar",
    "description": "Sütlü veya sade sıcak kahve servisi.",
    "badge": "Sıcak İçecek",
    "is_signature": false
  },
  {
    "id": "ST00407",
    "raw_name": "ANTEP FISTIĞI",
    "name": "Gaziantep Çifte Kavrulmuş Fıstık",
    "price": 300,
    "category": "cerezler",
    "description": "Birinci sınıf çıtır Antep fıstığı tabağı.",
    "badge": "Rakı Yanı",
    "is_signature": false
  },
  {
    "id": "ST00409",
    "raw_name": "SICAK ANTEP FISTIĞI",
    "name": "Tavada Sıcak Antep Fıstığı",
    "price": 350,
    "category": "cerezler",
    "description": "Tavada ısıtılarak sıcak sıcak servis edilen tuzlu Antep fıstığı.",
    "badge": "Sıcak Çerez",
    "is_signature": false
  },
  {
    "id": "ST00408",
    "raw_name": "BADEM",
    "name": "Datça Çıtır Bademi",
    "price": 300,
    "category": "cerezler",
    "description": "Özel kavrulmuş iri Datça bademleri.",
    "badge": "Çerez",
    "is_signature": false
  },
  {
    "id": "ST00686",
    "raw_name": "BEYAZ LEBLEBİ",
    "name": "Tavşanlı Beyaz Leblebisi",
    "price": 225,
    "category": "cerezler",
    "description": "Rakı kadehinin yanında mideyi rahatlatan gevrek leblebi.",
    "badge": "Klasik",
    "is_signature": false
  },
  {
    "id": "ST00410",
    "raw_name": "TUZLU FISTIK",
    "name": "Tuzlu Yer Fıstığı",
    "price": 225,
    "category": "cerezler",
    "description": "Kavrulmuş çıtır yer fıstığı.",
    "badge": "Çerez",
    "is_signature": false
  },
  {
    "id": "ST00681",
    "raw_name": "ÇEREZ",
    "name": "Lüks Karışık Kuruyemiş Tabağı",
    "price": 250,
    "category": "cerezler",
    "description": "Badem, fındık, kaju ve fıstıktan oluşan zengin meze çerezi.",
    "badge": "Karışık Çerez",
    "is_signature": false
  }
];

if (typeof window !== "undefined") {
  window.MENU_CATEGORIES = MENU_CATEGORIES;
  window.MENU_ITEMS = MENU_ITEMS;
}
