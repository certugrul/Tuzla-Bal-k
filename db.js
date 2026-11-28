/**
 * Tuzla Balık Soyak - Hibrit Veritabanı Katmanı (MySQL / JSON Fallback)
 * Hostinger MySQL ortam değişkenleri (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST) varsa
 * doğrudan MySQL veritabanına bağlanır. Yoksa güvenli JSON dosya sistemine geri döner.
 */

const fs = require('fs');
const path = require('path');

const RESERVATIONS_FILE = path.join(__dirname, 'reservations.json');
const SETTINGS_FILE = path.join(__dirname, 'site-settings.json');

let pool = null;
let isDbReady = false;

// MySQL Bağlantısını Başlat
async function initDatabase() {
  if (process.env.DB_NAME && process.env.DB_USER) {
    try {
      const mysql = require('mysql2/promise');
      pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      // Tabloları oluştur
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reservations (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(64) NOT NULL,
          guests VARCHAR(32) DEFAULT '2',
          area VARCHAR(64) DEFAULT 'Fark etmez',
          date VARCHAR(32) NOT NULL,
          time VARCHAR(32) DEFAULT '20:00',
          notes TEXT,
          created_at VARCHAR(64),
          survey_scheduled_at VARCHAR(64),
          survey_status VARCHAR(32) DEFAULT 'pending',
          survey_sent_at VARCHAR(64),
          survey_sent_via VARCHAR(64),
          survey_data LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT PRIMARY KEY DEFAULT 1,
          data LONGTEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS menu_store (
          id INT PRIMARY KEY DEFAULT 1,
          categories LONGTEXT,
          items LONGTEXT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // İlk tohumlama veya Çift Yönlü Senkronizasyon (Hydration)
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM reservations');
      if (rows[0].count === 0 && fs.existsSync(RESERVATIONS_FILE)) {
        try {
          const raw = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
          for (const item of raw) {
            await pool.query(
              `INSERT INTO reservations (id, name, phone, guests, area, date, time, notes, created_at, survey_scheduled_at, survey_status, survey_sent_at, survey_sent_via, survey_data)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                item.id,
                item.name,
                item.phone,
                item.guests || '2',
                item.area || 'Fark etmez',
                item.date,
                item.time || '20:00',
                item.notes || '',
                item.created_at,
                item.survey_scheduled_at,
                item.survey_status || 'pending',
                item.survey_sent_at || null,
                item.survey_sent_via || null,
                item.survey_data ? JSON.stringify(item.survey_data) : null
              ]
            );
          }
          console.log(`[DB] MySQL başlatıldı ve ${raw.length} rezervasyon tohumlandı.`);
        } catch (e) {
          console.warn('[DB] Tohumlama uyarısı:', e.message);
        }
      } else if (rows[0].count > 0) {
        // MySQL'deki taze kayıtları yerel JSON dosyasına yazarak senkronize tut
        const [dbReservations] = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
        const formatted = dbReservations.map(r => ({
          ...r,
          survey_data: r.survey_data ? (typeof r.survey_data === 'string' ? JSON.parse(r.survey_data) : r.survey_data) : null
        }));
        fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(formatted, null, 2), 'utf8');
      }

      // Ayarları tohumla / senkronize et
      const [setRows] = await pool.query('SELECT COUNT(*) as count FROM site_settings');
      if (setRows[0].count === 0 && fs.existsSync(SETTINGS_FILE)) {
        const setJson = fs.readFileSync(SETTINGS_FILE, 'utf8');
        await pool.query('INSERT INTO site_settings (id, data) VALUES (1, ?)', [setJson]);
      } else if (setRows[0].count > 0) {
        const [dbSetRows] = await pool.query('SELECT data FROM site_settings WHERE id = 1');
        if (dbSetRows.length > 0 && dbSetRows[0].data) {
          fs.writeFileSync(SETTINGS_FILE, dbSetRows[0].data, 'utf8');
        }
      }

      isDbReady = true;
      console.log(`[DB] ✅ Hostinger MySQL (${process.env.DB_NAME}) başarıyla bağlandı ve aktif!`);
    } catch (err) {
      console.warn('[DB] MySQL bağlantısı kurulamadı, JSON modunda devam ediliyor:', err.message);
      isDbReady = false;
    }
  } else {
    console.log('[DB] DB ortam değişkenleri bulunamadı. Yerel JSON modunda çalışılıyor.');
    isDbReady = false;
  }
}

// Rezervasyonları Oku
async function getReservations() {
  if (isDbReady && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM reservations ORDER BY created_at DESC');
      return rows.map(r => ({
        ...r,
        survey_data: r.survey_data ? (typeof r.survey_data === 'string' ? JSON.parse(r.survey_data) : r.survey_data) : null
      }));
    } catch (e) {
      console.error('[DB] MySQL okuma hatası:', e.message);
    }
  }

  // Fallback: JSON
  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
    }
  } catch (_) {}
  return [];
}

// Rezervasyon Ekle veya Güncelle
async function upsertReservation(item) {
  if (isDbReady && pool) {
    try {
      await pool.query(
        `INSERT INTO reservations (id, name, phone, guests, area, date, time, notes, created_at, survey_scheduled_at, survey_status, survey_sent_at, survey_sent_via, survey_data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           phone = VALUES(phone),
           guests = VALUES(guests),
           area = VALUES(area),
           date = VALUES(date),
           time = VALUES(time),
           notes = VALUES(notes),
           survey_scheduled_at = VALUES(survey_scheduled_at),
           survey_status = VALUES(survey_status),
           survey_sent_at = VALUES(survey_sent_at),
           survey_sent_via = VALUES(survey_sent_via),
           survey_data = VALUES(survey_data)`,
        [
          item.id,
          item.name,
          item.phone,
          item.guests || '2',
          item.area || 'Fark etmez',
          item.date,
          item.time || '20:00',
          item.notes || '',
          item.created_at,
          item.survey_scheduled_at,
          item.survey_status || 'pending',
          item.survey_sent_at || null,
          item.survey_sent_via || null,
          item.survey_data ? (typeof item.survey_data === 'string' ? item.survey_data : JSON.stringify(item.survey_data)) : null
        ]
      );
    } catch (e) {
      console.error('[DB] MySQL yazma hatası:', e.message);
    }
  }

  // Always mirror to JSON for local persistence/backups
  try {
    let list = [];
    if (fs.existsSync(RESERVATIONS_FILE)) {
      list = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
    }
    const idx = list.findIndex(r => r.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (_) {}
}

// Rezervasyon Sil
async function deleteReservation(id) {
  if (isDbReady && pool) {
    try {
      await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
    } catch (e) {
      console.error('[DB] MySQL silme hatası:', e.message);
    }
  }

  try {
    if (fs.existsSync(RESERVATIONS_FILE)) {
      let list = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
      list = list.filter(r => r.id !== id);
      fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(list, null, 2), 'utf8');
    }
  } catch (_) {}
}

// Tüm Listeyi Kaydet (Toplu işlem)
async function saveAllReservations(list) {
  for (const item of list) {
    await upsertReservation(item);
  }
}

// Ayarları Oku
async function getSettings() {
  if (isDbReady && pool) {
    try {
      const [rows] = await pool.query('SELECT data FROM site_settings WHERE id = 1');
      if (rows.length > 0 && rows[0].data) {
        return JSON.parse(rows[0].data);
      }
    } catch (e) {
      console.error('[DB] MySQL ayar okuma hatası:', e.message);
    }
  }

  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    } catch (_) {}
  }
  return {};
}

// Ayarları Kaydet
async function saveSettings(settingsObj) {
  const jsonStr = JSON.stringify(settingsObj, null, 2);
  if (isDbReady && pool) {
    try {
      await pool.query(
        'INSERT INTO site_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
        [jsonStr]
      );
    } catch (e) {
      console.error('[DB] MySQL ayar yazma hatası:', e.message);
    }
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, jsonStr, 'utf8');
  } catch (_) {}
}

module.exports = {
  initDatabase,
  getReservations,
  upsertReservation,
  deleteReservation,
  saveAllReservations,
  getSettings,
  saveSettings,
  isDatabaseActive: () => isDbReady
};
