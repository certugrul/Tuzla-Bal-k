/**
 * Tuzla Balık Soyak - Hafif Yerel Web Sunucusu & Backoffice API
 * Hiçbir harici kütüphane (npm) gerektirmez; Node.js yerleşik modülleriyle çalışır.
 * 
 * Çalıştırmak için terminalde: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const automation = require('./automation');
const whatsappBot = require('./whatsapp-bot');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: Read JSON body from incoming request
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Disable aggressive caching so updates reflect instantly in all browsers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Enable CORS for flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  let pathname = url.pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (_) {}

  const hostUrl = `http://${req.headers.host}`;

  // ==========================================
  // 1. AYARLAR API (/api/settings)
  // ==========================================
  if (pathname === '/api/settings') {
    const settingsPath = path.join(BASE_DIR, 'site-settings.json');
    if (req.method === 'GET') {
      if (fs.existsSync(settingsPath)) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(fs.readFileSync(settingsPath, 'utf8'));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Settings not found' }));
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const parsed = await readJsonBody(req);
        fs.writeFileSync(settingsPath, JSON.stringify(parsed, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Ayarlar başarıyla kaydedildi' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Geçersiz JSON', details: err.message }));
      }
      return;
    }
  }

  // ==========================================
  // 2. MENÜ API (/api/menu)
  // ==========================================
  if (pathname === '/api/menu') {
    const menuDataPath = path.join(BASE_DIR, 'menu-data.js');
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(fs.readFileSync(menuDataPath, 'utf8'));
      return;
    }

    if (req.method === 'POST') {
      try {
        const { items, categories } = await readJsonBody(req);
        const newJsContent = `// Tuzla Balık Soyak - Dinamik Menü Veritabanı\n// Backoffice üzerinden güncellendi\n\nvar MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};\n\nvar MENU_ITEMS = ${JSON.stringify(items, null, 2)};\n\nif (typeof window !== "undefined") {\n  window.MENU_CATEGORIES = MENU_CATEGORIES;\n  window.MENU_ITEMS = MENU_ITEMS;\n}\n`;
        fs.writeFileSync(menuDataPath, newJsContent, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, count: items.length, message: 'Menü başarıyla diske kaydedildi' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Menü kaydedilemedi', details: err.message }));
      }
      return;
    }
  }

  // ==========================================
  // 3. REZERVASYONLAR API (/api/reservations)
  // ==========================================
  if (pathname === '/api/reservations') {
    const list = automation.loadReservations();

    if (req.method === 'GET') {
      // Her kayda 1-tık doğrudan WhatsApp linkini hesaplayıp ekle
      const enriched = list.map(item => ({
        ...item,
        wa_direct_url: automation.getWhatsAppDirectUrl(item, hostUrl)
      }));
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(enriched));
      return;
    }

    if (req.method === 'POST') {
      try {
        const data = await readJsonBody(req);
        if (!data.name || !data.phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'İsim ve telefon zorunludur' }));
          return;
        }

        const dateStr = data.date || new Date().toISOString().slice(0, 10);
        const scheduledTime = automation.calculateScheduledTime(dateStr);

        const newReservation = {
          id: 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: data.name.trim(),
          phone: data.phone.trim(),
          guests: data.guests || '2',
          area: data.area || 'Fark etmez',
          date: dateStr,
          time: data.time || '20:00',
          notes: data.notes || '',
          created_at: new Date().toISOString(),
          survey_scheduled_at: scheduledTime,
          survey_status: 'pending', // 'pending' | 'sent' | 'completed'
          survey_sent_at: null,
          survey_sent_via: null,
          survey_data: null
        };

        list.unshift(newReservation);
        automation.saveReservations(list);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          reservation: newReservation,
          wa_direct_url: automation.getWhatsAppDirectUrl(newReservation, hostUrl)
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rezervasyon kaydedilemedi', details: err.message }));
      }
      return;
    }
  }

  // ==========================================
  // 4. REZERVASYON DURUMU GÜNCELLEME (/api/reservations/status)
  // ==========================================
  if (pathname === '/api/reservations/status' && req.method === 'POST') {
    try {
      const { id, survey_status, survey_sent_via } = await readJsonBody(req);
      const list = automation.loadReservations();
      const target = list.find(r => r.id === id);
      if (!target) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rezervasyon bulunamadı' }));
        return;
      }

      if (survey_status) target.survey_status = survey_status;
      if (survey_status === 'sent') {
        target.survey_sent_at = new Date().toISOString();
        target.survey_sent_via = survey_sent_via || 'manual_whatsapp';
      }

      automation.saveReservations(list);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, reservation: target }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Durum güncellenemedi', details: err.message }));
    }
    return;
  }

  // ==========================================
  // 5. REZERVASYON SİLME (/api/reservations/delete)
  // ==========================================
  if (pathname === '/api/reservations/delete' && req.method === 'POST') {
    try {
      const { id } = await readJsonBody(req);
      let list = automation.loadReservations();
      const initialLen = list.length;
      list = list.filter(r => r.id !== id);
      if (list.length === initialLen) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Kayıt bulunamadı' }));
        return;
      }
      automation.saveReservations(list);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Rezervasyon silindi' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Silme işlemi başarısız', details: err.message }));
    }
    return;
  }

  // ==========================================
  // 6. ANKET API (/api/surveys)
  // ==========================================
  if (pathname === '/api/surveys') {
    const list = automation.loadReservations();

    if (req.method === 'GET') {
      const surveyId = url.searchParams.get('id');
      if (surveyId) {
        const item = list.find(r => r.id === surveyId);
        if (!item) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Rezervasyon bulunamadı' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          id: item.id,
          name: item.name,
          date: item.date,
          time: item.time,
          already_completed: item.survey_status === 'completed',
          survey_data: item.survey_data
        }));
        return;
      }

      // Tüm tamamlanmış anketleri döndür
      const completed = list
        .filter(r => r.survey_data !== null)
        .map(r => ({
          id: r.id,
          name: r.name,
          date: r.date,
          created_at: r.created_at,
          ...r.survey_data
        }));

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(completed));
      return;
    }

    if (req.method === 'POST') {
      try {
        const payload = await readJsonBody(req);
        if (!payload.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Geçersiz anket referansı (id eksik)' }));
          return;
        }

        const item = list.find(r => r.id === payload.id);
        if (!item) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Rezervasyon kaydı bulunamadı' }));
          return;
        }

        item.survey_data = {
          score_overall: Number(payload.score_overall) || 5,
          score_food: Number(payload.score_food) || 5,
          score_service: Number(payload.score_service) || 5,
          score_ambience: Number(payload.score_ambience) || 5,
          comment: (payload.comment || '').trim(),
          google_review_clicked: Boolean(payload.google_review_clicked),
          submitted_at: new Date().toISOString()
        };
        item.survey_status = 'completed';

        automation.saveReservations(list);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Değerlendirmeniz için teşekkür ederiz!'
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Anket kaydedilemedi', details: err.message }));
      }
      return;
    }
  }

  // ==========================================
  // 7. ZAMANLANMIŞ ANKET KONTROLÜ / TOPLU GÖNDERİM (/api/automation/due)
  // ==========================================
  if (pathname === '/api/automation/due' && req.method === 'GET') {
    const dueList = automation.getDueSurveys().map(item => ({
      ...item,
      wa_direct_url: automation.getWhatsAppDirectUrl(item, hostUrl)
    }));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      count: dueList.length,
      items: dueList
    }));
    return;
  }

  // ==========================================
  // 8. WHATSAPP BOT API (/api/bot/*)
  // ==========================================
  if (pathname === '/api/bot/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(whatsappBot.getBotStatus()));
    return;
  }

  if (pathname === '/api/bot/start' && req.method === 'POST') {
    whatsappBot.startWhatsAppBot();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, message: 'Bot başlatılıyor, QR kod hazırlanıyor...' }));
    return;
  }

  if (pathname === '/api/bot/pairing-code' && req.method === 'POST') {
    try {
      const { phone } = await readJsonBody(req);
      const result = await whatsappBot.requestPairingCode(phone);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/bot/logout' && req.method === 'POST') {
    await whatsappBot.logoutBot();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, message: 'WhatsApp oturumu kapatıldı' }));
    return;
  }

  if (pathname === '/api/bot/test-send' && req.method === 'POST') {
    try {
      const { phone, message } = await readJsonBody(req);
      const sent = await whatsappBot.sendTextMessage(phone, message || 'Tuzla Balık Soyak test mesajıdır! 🐟');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, result: sent }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === '/api/bot/send-due' && req.method === 'POST') {
    const dueList = automation.getDueSurveys();
    const results = [];
    const all = automation.loadReservations();

    for (const item of dueList) {
      try {
        const rawMsg = automation.generateRawSurveyMessage(item, hostUrl);
        await whatsappBot.sendTextMessage(item.phone, rawMsg);
        
        const target = all.find(r => r.id === item.id);
        if (target) {
          target.survey_status = 'sent';
          target.survey_sent_via = 'bot';
          target.survey_sent_at = new Date().toISOString();
        }
        results.push({ id: item.id, name: item.name, success: true });
      } catch (err) {
        results.push({ id: item.id, name: item.name, success: false, error: err.message });
      }
    }
    automation.saveReservations(all);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, processed: results.length, results }));
    return;
  }

  // ==========================================
  // 9. STATIC DOSYA SUNUCUSU
  // ==========================================
  let filePath = path.join(BASE_DIR, pathname === '/' ? 'index.html' : pathname);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Sayfa Bulunamadı</h1><p><a href="/">Ana Sayfaya Dön</a> | <a href="/admin.html">Yönetim Paneli</a></p>');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🐟 TUZLA BALIK SOYAK WEB SUNUCUSU AKTİF!`);
  console.log(`------------------------------------------------------`);
  console.log(`🌐 Ana Web Sitesi:    http://localhost:${PORT}/`);
  console.log(`⚙️  Backoffice Paneli: http://localhost:${PORT}/admin.html`);
  console.log(`📊 Anket Sayfası:     http://localhost:${PORT}/anket.html?id=res_demo_01`);
  console.log(`======================================================\n`);

  // Zamanlayıcıyı başlat ve otomatik bot gönderimini bağla
  automation.startAutomationScheduler({
    onDueSurveys: async (dueList) => {
      const botState = whatsappBot.getBotStatus();
      if (botState.isConnected) {
        console.log(`[Automation] WhatsApp Bot BAĞLI. ${dueList.length} adet anket otomatik gönderiliyor...`);
        const all = automation.loadReservations();
        for (const item of dueList) {
          try {
            const rawMsg = automation.generateRawSurveyMessage(item, `http://localhost:${PORT}`);
            await whatsappBot.sendTextMessage(item.phone, rawMsg);
            const target = all.find(r => r.id === item.id);
            if (target) {
              target.survey_status = 'sent';
              target.survey_sent_via = 'bot';
              target.survey_sent_at = new Date().toISOString();
            }
            console.log(`[Automation] ${item.name} (${item.phone}) kişisine anket otomatik WhatsApp ile iletildi!`);
          } catch (err) {
            console.error(`[Automation] ${item.name} anket gönderimi başarısız:`, err.message);
          }
        }
        automation.saveReservations(all);
      } else {
        console.log(`[Automation] ⚠️ Zamanlayıcı tetiklendi ancak WhatsApp Bot henüz bağlı değil. Lütfen Admin panelinden QR kod okutun veya tek tıkla 'WhatsApp ile Gönder' butonunu kullanın.`);
      }
    }
  });

  // WhatsApp botunu başlat
  whatsappBot.startWhatsAppBot();
});
