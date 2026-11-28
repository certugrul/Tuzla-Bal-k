/**
 * Tuzla Balık Soyak - Hafif Yerel Web Sunucusu & Backoffice API
 * Hiçbir harici kütüphane (npm) gerektirmez; Node.js yerleşik modülleriyle çalışır.
 * 
 * Çalıştırmak için terminalde: node server.js
 */

process.env.TZ = 'Europe/Istanbul';

const http = require('http');
const fs = require('fs');
const path = require('path');
const automation = require('./automation');
const whatsappBot = require('./whatsapp-bot');
const db = require('./db');

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
    req.setEncoding('utf8');
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

// Zamanı gelen ve gönderilmeyi bekleyen rezervasyonları veritabanından çek
async function getDueReservations() {
  const list = await db.getReservations();
  const now = new Date();
  return list.filter(r => {
    if (r.survey_status !== 'pending') return false;
    if (!r.survey_scheduled_at) return true;
    return new Date(r.survey_scheduled_at) <= now;
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
  // 0. VERİTABANI DURUMU (/api/db-status)
  // ==========================================
  if (pathname === '/api/db-status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      database: db.isDatabaseActive() ? 'MySQL (Hostinger Aktif)' : 'JSON (Yerel Dosya Modu)',
      is_db_ready: db.isDatabaseActive(),
      db_name: process.env.DB_NAME || null,
      db_user: process.env.DB_USER || null
    }));
    return;
  }

  // ==========================================
  // 1. AYARLAR API (/api/settings)
  // ==========================================
  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      try {
        const settings = await db.getSettings();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(settings));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ayarlar okunamadı', details: err.message }));
      }
      return;
    }

    if (req.method === 'POST') {
      try {
        const parsed = await readJsonBody(req);
        await db.saveSettings(parsed);
        
        // Eğer zamanlayıcı ayarları değiştirildiyse bekleyen rezervasyonların anket saatlerini otomatik güncelle
        if (parsed.surveyDelayDays !== undefined || parsed.surveySendTime !== undefined) {
          automation.reschedulePendingSurveys(parsed.surveyDelayDays, parsed.surveySendTime);
        }

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
    const menuAppPath = path.join(BASE_DIR, 'menu-app', 'menu-data.js');
    const rootMenuPath = path.join(BASE_DIR, 'menu-data.js');
    const activePath = fs.existsSync(menuAppPath) ? menuAppPath : rootMenuPath;

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(fs.readFileSync(activePath, 'utf8'));
      return;
    }

    if (req.method === 'POST') {
      try {
        const { items, categories } = await readJsonBody(req);
        
        // Write to menu-app/menu-data.js
        const menuAppJs = `/**\n * TUZLA BALIK RESTAURANT - VERIFIED MENU DATA\n * Total Active Items: ${items.length}\n * Optimized with high-efficiency WebP photography.\n * Sorted A-Z within each category with authentic restaurant course hierarchy.\n */\n\nwindow.MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};\n\nwindow.MENU_ITEMS = ${JSON.stringify(items, null, 2)};\n`;
        fs.writeFileSync(menuAppPath, menuAppJs, 'utf8');

        // Also sync root menu-data.js
        const rootJs = `// Tuzla Balık Soyak - Dinamik Menü Veritabanı\n// Backoffice üzerinden güncellendi\n\nvar MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};\n\nvar MENU_ITEMS = ${JSON.stringify(items, null, 2)};\n\nif (typeof window !== "undefined") {\n  window.MENU_CATEGORIES = MENU_CATEGORIES;\n  window.MENU_ITEMS = MENU_ITEMS;\n}\n`;
        fs.writeFileSync(rootMenuPath, rootJs, 'utf8');

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
  // 2.1 GÖRSEL YÜKLEME VE GALERİ API
  // ==========================================
  if (pathname === '/api/upload-image' && req.method === 'POST') {
    try {
      const { filename, dataUrl } = await readJsonBody(req);
      if (!filename || !dataUrl) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'filename ve dataUrl gereklidir' }));
        return;
      }

      // Base64 çözümleme
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      if (matches && matches.length === 3) {
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(dataUrl, 'base64');
      }

      // Güvenli dosya ismi üretme
      const ext = path.extname(filename).toLowerCase() || '.webp';
      const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9_\-]/g, '_');
      const safeFilename = `dish_${Date.now()}_${baseName}${ext}`;

      const uploadDir = path.join(BASE_DIR, 'menu-app', 'images', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const targetPath = path.join(uploadDir, safeFilename);
      fs.writeFileSync(targetPath, buffer);

      const relPath = `images/uploads/${safeFilename}`;
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        imagePath: relPath,
        url: `/menu-app/${relPath}`,
        filename: safeFilename
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Görsel yüklenemedi', details: err.message }));
    }
    return;
  }

  if (pathname === '/api/images/gallery' && req.method === 'GET') {
    try {
      const imgBase = path.join(BASE_DIR, 'menu-app', 'images');
      function scanDir(dir, relPrefix = '') {
        let results = [];
        if (!fs.existsSync(dir)) return results;
        const list = fs.readdirSync(dir);
        for (const item of list) {
          const full = path.join(dir, item);
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            results = results.concat(scanDir(full, (relPrefix ? relPrefix + '/' : '') + item));
          } else {
            const ext = path.extname(item).toLowerCase();
            if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
              if (!item.includes('default') && !item.includes('logo')) {
                const imgPath = `images/${relPrefix ? relPrefix + '/' : ''}${item}`;
                results.push({
                  filename: item,
                  category: relPrefix || 'genel',
                  path: imgPath,
                  url: `/menu-app/${imgPath}`
                });
              }
            }
          }
        }
        return results;
      }
      const gallery = scanDir(imgBase);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, count: gallery.length, images: gallery }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Galeri listelenemedi', details: err.message }));
    }
    return;
  }

  // ==========================================
  // 3. REZERVASYONLAR API (/api/reservations)
  // ==========================================
  if (pathname === '/api/reservations/export' && req.method === 'GET') {
    const list = automation.loadReservations();
    const format = (url.searchParams.get('format') || 'csv').toLowerCase();
    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'json') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="tuzla_balik_rezervasyonlar_${dateStr}.json"`
      });
      res.end(JSON.stringify(list, null, 2));
      return;
    }

    // Default: Excel uyumlu UTF-8 CSV with BOM
    const bom = '\uFEFF';
    const header = ['ID', 'Müşteri Adı', 'Telefon', 'Kişi Sayısı', 'Masa / Alan', 'Tarih', 'Saat', 'Notlar', 'Kayıt Zamanı', 'Anket Durumu', 'Anket Puanı', 'Google Yorum Tıklandı Mı'];
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = list.map(item => {
      const score = (item.survey_data && item.survey_data.score) ? item.survey_data.score : '';
      const gReview = (item.survey_data && item.survey_data.clicked_google_review) ? 'Evet' : 'Hayır';
      return [
        escapeCsv(item.id),
        escapeCsv(item.name),
        escapeCsv(item.phone),
        escapeCsv(item.guests),
        escapeCsv(item.area),
        escapeCsv(item.date),
        escapeCsv(item.time),
        escapeCsv(item.notes),
        escapeCsv(item.created_at),
        escapeCsv(item.survey_status),
        escapeCsv(score),
        escapeCsv(gReview)
      ].join(';');
    });

    const csvContent = bom + [header.join(';'), ...rows].join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tuzla_balik_rezervasyonlar_${dateStr}.csv"`
    });
    res.end(csvContent);
    return;
  }

  if (pathname === '/api/reservations/restore' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      if (Array.isArray(data)) {
        automation.saveReservations(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, count: data.length, message: `${data.length} rezervasyon başarıyla geri yüklendi` }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Geçersiz veri: dizi bekleniyor' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Geri yükleme hatası', details: err.message }));
    }
    return;
  }

  if (pathname === '/api/reservations') {
    if (req.method === 'GET') {
      const list = await db.getReservations();
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

        await db.upsertReservation(newReservation);

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
      const list = await db.getReservations();
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

      await db.upsertReservation(target);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, reservation: target }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Durum güncellenemedi', details: err.message }));
    }
    return;
  }

  // 4.1 TEKİL REZERVASYON ANKET ZAMANINI GÜNCELLEME (/api/reservations/reschedule)
  if (pathname === '/api/reservations/reschedule' && req.method === 'POST') {
    try {
      const { id, scheduled_at } = await readJsonBody(req);
      if (!id || !scheduled_at) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'id ve scheduled_at zorunludur' }));
        return;
      }
      const list = await db.getReservations();
      const target = list.find(r => r.id === id);
      if (!target) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Rezervasyon bulunamadı' }));
        return;
      }

      let cleanInput = String(scheduled_at).trim().replace(' ', 'T');
      if (!cleanInput.includes('+') && !cleanInput.endsWith('Z')) {
        if (cleanInput.length === 16) cleanInput += ':00';
        cleanInput += '+03:00';
      }
      target.survey_scheduled_at = new Date(cleanInput).toISOString();
      await db.upsertReservation(target);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, reservation: target }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Zaman güncellenemedi', details: err.message }));
    }
    return;
  }

  // ==========================================
  // 5. REZERVASYON SİLME (/api/reservations/delete)
  // ==========================================
  if (pathname === '/api/reservations/delete' && req.method === 'POST') {
    try {
      const { id } = await readJsonBody(req);
      const list = await db.getReservations();
      const target = list.find(r => r.id === id);
      if (!target) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Kayıt bulunamadı' }));
        return;
      }
      await db.deleteReservation(id);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Rezervasyon silindi' }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Silme işlemi başarısız', details: err.message }));
    }
    return;
  }

  // ==========================================
  // 5.1 REZERVASYONLARI DIŞA AKTAR (/api/reservations/export)
  // ==========================================
  if (pathname === '/api/reservations/export' && req.method === 'GET') {
    const list = automation.loadReservations();
    const format = (url.searchParams.get('format') || 'csv').toLowerCase();
    const dateStr = new Date().toISOString().slice(0, 10);

    if (format === 'json') {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="tuzla_balik_rezervasyonlar_${dateStr}.json"`
      });
      res.end(JSON.stringify(list, null, 2));
      return;
    }

    // Excel Uyumlu CSV (UTF-8 BOM + noktalı virgül)
    const bom = '\uFEFF';
    const headers = [
      'ID',
      'Müşteri Adı',
      'Telefon',
      'Kişi Sayısı',
      'Masa/Bölüm',
      'Rezervasyon Tarihi',
      'Saat',
      'Özel Notlar',
      'Kayıt Zamanı',
      'Anket Durumu',
      'Anket Zamanlaması',
      'Gönderim Zamanı',
      'Anket Puanı (1-5)',
      'Google Yorum Tıklandı Mı'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${s}"`;
    };

    const rows = list.map(item => {
      const score = (item.survey_data && item.survey_data.score) ? item.survey_data.score : '';
      const gReview = (item.survey_data && item.survey_data.clicked_google_review) ? 'Evet' : 'Hayır';
      return [
        escapeCsv(item.id),
        escapeCsv(item.name),
        escapeCsv(item.phone),
        escapeCsv(item.guests),
        escapeCsv(item.area),
        escapeCsv(item.date),
        escapeCsv(item.time),
        escapeCsv(item.notes),
        escapeCsv(item.created_at),
        escapeCsv(item.survey_status),
        escapeCsv(item.survey_scheduled_at),
        escapeCsv(item.survey_sent_at),
        escapeCsv(score),
        escapeCsv(gReview)
      ].join(';');
    });

    const csvContent = bom + [headers.join(';'), ...rows].join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tuzla_balik_rezervasyonlar_${dateStr}.csv"`
    });
    res.end(csvContent);
    return;
  }

  // ==========================================
  // 5.2 REZERVASYONLARI GERİ YÜKLE (/api/reservations/restore)
  // ==========================================
  if (pathname === '/api/reservations/restore' && req.method === 'POST') {
    try {
      const data = await readJsonBody(req);
      if (Array.isArray(data)) {
        await db.saveAllReservations(data);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, count: data.length, message: 'Rezervasyonlar başarıyla geri yüklendi' }));
        return;
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Geçersiz veri formatı, dizi bekleniyor' }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ==========================================
  // 6. ANKET API (/api/surveys)
  // ==========================================
  if (pathname === '/api/surveys') {
    if (req.method === 'GET') {
      const list = await db.getReservations();
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

        const list = await db.getReservations();
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

        await db.upsertReservation(item);

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
    const dueRaw = await getDueReservations();
    const domainUrl = process.env.PUBLIC_URL || (process.env.DB_NAME ? 'https://tuzlabaliksoyak.com' : hostUrl);
    const dueList = dueRaw.map(item => ({
      ...item,
      wa_direct_url: automation.getWhatsAppDirectUrl(item, domainUrl)
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

  if (pathname === '/api/bot/reset' && req.method === 'POST') {
    await whatsappBot.logoutBot();
    whatsappBot.startWhatsAppBot();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, message: 'WhatsApp oturumu sıfırlandı ve yeni QR kod hazırlanıyor' }));
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
    const dueList = await getDueReservations();
    const results = [];
    const domainUrl = process.env.PUBLIC_URL || (process.env.DB_NAME ? 'https://tuzlabaliksoyak.com' : hostUrl);

    for (const item of dueList) {
      try {
        const rawMsg = automation.generateRawSurveyMessage(item, domainUrl);
        await whatsappBot.sendTextMessage(item.phone, rawMsg);
        
        item.survey_status = 'sent';
        item.survey_sent_via = 'bot';
        item.survey_sent_at = new Date().toISOString();
        await db.upsertReservation(item);

        results.push({ id: item.id, name: item.name, success: true });
      } catch (err) {
        results.push({ id: item.id, name: item.name, success: false, error: err.message });
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, processed: results.length, results }));
    return;
  }

  // ==========================================
  // 9. GEL-AL MENÜ VE STATİK DOSYA SUNUCUSU
  // ==========================================
  // /gelal kısayol yönlendirmesi
  if (pathname === '/gelal' || pathname === '/gelal/') {
    res.writeHead(302, { 'Location': '/gelal-menu-app/' });
    res.end();
    return;
  }

  // Gel-Al Menu App görsellerini menu-app/images/ klasöründen ortak sunma
  if (pathname.startsWith('/gelal-menu-app/images/')) {
    const subPath = pathname.replace('/gelal-menu-app/images/', '');
    const sharedImgFile = path.join(BASE_DIR, 'menu-app', 'images', subPath);
    if (fs.existsSync(sharedImgFile)) {
      const ext = path.extname(sharedImgFile).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(sharedImgFile));
      return;
    }
  }

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

// Veritabanını başlat (MySQL / JSON fallback)
db.initDatabase().catch(err => {
  console.warn('[DB] Veritabanı başlatma hatası:', err.message);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🐟 TUZLA BALIK SOYAK WEB SUNUCUSU AKTİF!`);
  console.log(`------------------------------------------------------`);
  console.log(`🌐 Ana Web Sitesi:    http://localhost:${PORT}/`);
  console.log(`📱 Menü App:          http://localhost:${PORT}/menu-app/`);
  console.log(`🛍️  Gel-Al Menü App:   http://localhost:${PORT}/gelal-menu-app/`);
  console.log(`⚙️  Backoffice Paneli: http://localhost:${PORT}/admin.html`);
  console.log(`📊 Anket Sayfası:     http://localhost:${PORT}/anket.html?id=res_demo_01`);
  console.log(`======================================================\n`);

  // Zamanı gelen anketleri otomatik gönderen arka plan servisi (5 saniyede bir tarar)
  let isAutoSending = false;
  setInterval(async () => {
    if (isAutoSending) return;
    try {
      const settings = await db.getSettings();
      if (settings.surveyAutoSend === false) return;

      const botState = whatsappBot.getBotStatus();
      if (!botState.isConnected) return; // WhatsApp bağlı değilse bekle

      const dueList = await getDueReservations();
      if (!dueList || dueList.length === 0) return;

      isAutoSending = true;
      const domainUrl = process.env.PUBLIC_URL || (process.env.DB_NAME ? 'https://tuzlabaliksoyak.com' : `http://localhost:${PORT}`);
      console.log(`[AutoSend] Zamanı gelmiş ${dueList.length} adet anket bulundu, WhatsApp üzerinden otomatik gönderiliyor...`);

      for (const item of dueList) {
        try {
          const rawMsg = automation.generateRawSurveyMessage(item, domainUrl);
          await whatsappBot.sendTextMessage(item.phone, rawMsg);

          item.survey_status = 'sent';
          item.survey_sent_via = 'bot';
          item.survey_sent_at = new Date().toISOString();
          await db.upsertReservation(item);

          console.log(`[AutoSend] ✅ ${item.name} (${item.phone}) kişisine anket WhatsApp ile otomatik gönderildi!`);
        } catch (err) {
          console.error(`[AutoSend] ❌ ${item.name} (${item.phone}) anket gönderimi başarısız:`, err.message);
        }
      }
    } catch (err) {
      console.error('[AutoSend] Otomatik gönderim hatası:', err.message);
    } finally {
      isAutoSending = false;
    }
  }, 5000);

  // WhatsApp botunu başlat
  whatsappBot.startWhatsAppBot();
});
