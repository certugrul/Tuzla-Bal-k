/**
 * Tuzla Balık Soyak - Hafif Yerel Web Sunucusu & Backoffice API
 * Hiçbir harici kütüphane (npm) gerektirmez; Node.js yerleşik modülleriyle çalışır.
 * 
 * Çalıştırmak için terminalde: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

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

const server = http.createServer((req, res) => {
  // Disable aggressive caching so updates reflect instantly in all browsers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Enable CORS for flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // API Endpoints
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
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFileSync(settingsPath, JSON.stringify(parsed, null, 2), 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, message: 'Ayarlar başarıyla kaydedildi' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Geçersiz JSON', details: err.message }));
        }
      });
      return;
    }
  }

  if (pathname === '/api/menu') {
    const menuDataPath = path.join(BASE_DIR, 'menu-data.js');
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(fs.readFileSync(menuDataPath, 'utf8'));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const { items, categories } = JSON.parse(body);
          const newJsContent = `// Tuzla Balık Soyak - Dinamik Menü Veritabanı\n// Backoffice üzerinden güncellendi\n\nvar MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};\n\nvar MENU_ITEMS = ${JSON.stringify(items, null, 2)};\n\nif (typeof window !== "undefined") {\n  window.MENU_CATEGORIES = MENU_CATEGORIES;\n  window.MENU_ITEMS = MENU_ITEMS;\n}\n`;
          fs.writeFileSync(menuDataPath, newJsContent, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, count: items.length, message: 'Menü başarıyla diske kaydedildi' }));
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Menü kaydedilemedi', details: err.message }));
        }
      });
      return;
    }
  }

  // Static File Serving
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
  console.log(`======================================================\n`);
});
