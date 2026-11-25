Tuzla Balık Soyak — Netlify uyarlama dosyaları

İçerik:
- netlify/functions/settings.js: /api/settings GET/POST işlevi
- netlify/functions/menu.js: /api/menu GET/POST işlevi
- netlify.toml: Netlify yayın ve API yönlendirmeleri
- package.json: Netlify Blobs bağımlılığı

Kurulum:
1. Bu dosyaları sitenin repo köküne kopyalayın/ekleyin.
2. Mevcut package.json varsa bağımlılığı onun dependencies bölümüne ekleyin; dosyanın tamamını üzerine yazmayın.
3. Netlify'da siteyi yeniden deploy edin.
4. Netlify Blobs desteğinin etkin olduğundan emin olun.
5. Yönetim panelinden menüyü bir kez kaydedin; ardından menü Blobs'a kalıcı yazılır.

Önemli:
- Bu dosyalar API altyapısını Netlify'a taşır; admin panelinin istemci kodu ve canlı sitedeki menü yükleme mantığı ayrıca kontrol edilmelidir.
- İlk GET /api/menu, Blobs'ta henüz menü yoksa 404 döndürür. İlk menüyü admin panelinden POST ederek kaydedin.
- Yönetim paneli herkese açık bırakılmamalıdır. Kimlik doğrulama/yetkilendirme eklenmeden POST uçları korunmuş sayılmaz.
