/**
 * Tuzla Balık Soyak - Otomatik WhatsApp Web Bot Servisi
 * Baileys kütüphanesi kullanarak WhatsApp Web oturumunu yönetir.
 * Tek seferlik QR kod okutulduktan sonra arka planda otomatik mesaj atabilir.
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

// Linux/Hostinger sunucusunda oturumu kalıcı home dizininde sakla (deploy'larda sıfırlanmaz)
const AUTH_FOLDER = (process.platform === 'linux' && process.env.HOME)
  ? path.join(process.env.HOME, '.tuzla_whatsapp_auth')
  : path.join(__dirname, '.whatsapp_auth');

let sock = null;
let currentQR = null;
let currentQRDataUrl = null;
let botStatus = 'disconnected'; // 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
let connectedUser = null;
let isStarting = false;

// "Mesaj bekleniyor..." (Waiting for this message) hatasını önlemek için son mesaj önbelleği
const sentMessagesCache = new Map();

function normalizePhone(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '9' + clean;
  else if (clean.startsWith('5')) clean = '90' + clean;
  return clean;
}

async function startWhatsAppBot() {
  if (isStarting || botStatus === 'connected') return;
  isStarting = true;
  botStatus = 'connecting';

  try {
    if (!fs.existsSync(AUTH_FOLDER)) {
      fs.mkdirSync(AUTH_FOLDER, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
    const silentLogger = pino({ level: 'silent' });

    sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogger)
      },
      logger: silentLogger,
      printQRInTerminal: false,
      browser: Browsers.macOS('Desktop'),
      syncFullHistory: false,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: false,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 15000,
      defaultQueryTimeoutMs: 60000,
      retryRequestDelayMs: 250,
      getMessage: async (key) => {
        if (key && key.id && sentMessagesCache.has(key.id)) {
          return sentMessagesCache.get(key.id);
        }
        return { conversation: 'Tuzla Balık Soyak Bildirimi' };
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        currentQR = qr;
        try {
          currentQRDataUrl = await QRCode.toDataURL(qr, { margin: 2, width: 280 });
          botStatus = 'qr_ready';
          console.log('[WhatsApp Bot] Yeni QR Kod hazırlandı. Admin panelinden okutabilirsiniz.');
        } catch (err) {
          console.error('[WhatsApp Bot] QR oluşturulamadı:', err.message);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
        const isRestartRequired = statusCode === DisconnectReason.restartRequired || statusCode === 515;
        const shouldReconnect = !isLoggedOut;
        console.log(`[WhatsApp Bot] Bağlantı kapandı (Kod: ${statusCode}). Yeniden bağlanılıyor mu: ${shouldReconnect}`);
        
        botStatus = 'disconnected';
        currentQR = null;
        currentQRDataUrl = null;
        connectedUser = null;
        isStarting = false;
        sock = null;

        if (isLoggedOut) {
          console.log('[WhatsApp Bot] Oturum süresi dolmuş veya cihaz çıkış yapmış. Eski kimlik bilgileri temizleniyor...');
          try {
            if (fs.existsSync(AUTH_FOLDER)) {
              fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
            }
          } catch (_) {}
          // Temizledikten sonra taze bir oturum ile QR/Kod için yeniden başlat
          setTimeout(() => startWhatsAppBot(), 1500);
        } else if (isRestartRequired) {
          console.log('[WhatsApp Bot] Eşleşme başarılı! Cihaz oturumu için anında yeniden bağlanılıyor...');
          setTimeout(() => startWhatsAppBot(), 500);
        } else if (shouldReconnect) {
          setTimeout(() => startWhatsAppBot(), 2000);
        }
      } else if (connection === 'open') {
        botStatus = 'connected';
        currentQR = null;
        currentQRDataUrl = null;
        isStarting = false;
        
        const rawUser = sock?.user?.id || '';
        connectedUser = rawUser.split(':')[0] || rawUser;
        console.log(`[WhatsApp Bot] ✅ BAŞARIYLA BAĞLANDI! Aktif Numara: +${connectedUser}`);
      }
    });

  } catch (err) {
    console.error('[WhatsApp Bot] Başlatma hatası:', err.message);
    botStatus = 'disconnected';
    isStarting = false;
  }
}

/**
 * Mesaj Gönderme
 */
async function sendTextMessage(targetPhone, messageText) {
  if (botStatus !== 'connected' || !sock) {
    throw new Error('WhatsApp botu bağlı değil. Lütfen önce QR kodu okutun.');
  }

  const cleanPhone = normalizePhone(targetPhone);
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error(`Geçersiz telefon numarası: ${targetPhone}`);
  }

  const jid = `${cleanPhone}@s.whatsapp.net`;
  
  const result = await sock.sendMessage(jid, {
    text: messageText
  });

  if (result && result.key && result.key.id) {
    sentMessagesCache.set(result.key.id, result.message || { conversation: messageText });
    if (sentMessagesCache.size > 500) {
      const oldestKey = sentMessagesCache.keys().next().value;
      sentMessagesCache.delete(oldestKey);
    }
  }

  console.log(`[WhatsApp Bot] Mesaj başarıyla iletildi: +${cleanPhone}`);
  return { success: true, messageId: result?.key?.id };
}

/**
 * Durum Bilgisi
 */
function getBotStatus() {
  return {
    status: botStatus,
    isConnected: botStatus === 'connected',
    connectedPhone: connectedUser ? `+${connectedUser}` : null,
    qrDataUrl: currentQRDataUrl
  };
}

/**
 * Oturumu Kapat / Sıfırla
 */
async function logoutBot() {
  try {
    if (sock) {
      await sock.logout();
    }
  } catch (_) {}

  try {
    if (fs.existsSync(AUTH_FOLDER)) {
      fs.rmSync(AUTH_FOLDER, { recursive: true, force: true });
    }
  } catch (_) {}

  botStatus = 'disconnected';
  currentQR = null;
  currentQRDataUrl = null;
  connectedUser = null;
  sock = null;
  isStarting = false;

  console.log('[WhatsApp Bot] Oturum sıfırlandı.');
}

/**
 * WhatsApp Telefon Numarası ile Eşleşme Kodu (Pairing Code) İsteği
 */
async function requestPairingCode(targetPhone) {
  const cleanPhone = normalizePhone(targetPhone);
  if (!cleanPhone || cleanPhone.length < 10) {
    throw new Error('Lütfen geçerli bir telefon numarası girin (Örn: 0530 606 35 17 veya 905306063517)');
  }

  // Eğer bot açık değilse başlat
  if (!sock) {
    await startWhatsAppBot();
  }

  // Socket'in hazır olması için kısa bir bekleme (eğer yeni başlatıldıysa)
  let tries = 0;
  while ((!sock || botStatus === 'connecting') && tries < 20) {
    await new Promise(r => setTimeout(r, 300));
    tries++;
  }

  if (!sock) {
    throw new Error('WhatsApp servisi başlatılamadı, lütfen tekrar deneyin.');
  }

  if (sock.authState?.creds?.registered) {
    throw new Error('Bu oturum zaten bir cihaza bağlı.');
  }

  console.log(`[WhatsApp Bot] +${cleanPhone} için Eşleşme Kodu (Pairing Code) isteniyor...`);
  const rawCode = await sock.requestPairingCode(cleanPhone);
  
  // Format code e.g. 1234-5678
  let formatted = rawCode;
  if (rawCode && rawCode.length === 8) {
    formatted = `${rawCode.slice(0, 4)}-${rawCode.slice(4)}`;
  }

  console.log(`[WhatsApp Bot] Eşleşme Kodu üretildi: ${formatted}`);
  return {
    success: true,
    code: formatted,
    rawCode: rawCode,
    phone: cleanPhone
  };
}

// Otomatik Canlı Tutma / Watchdog Bekçisi:
// Her 20 saniyede bir oturumu denetler. Eğer bağlantı kopmuşsa ve kimlik bilgileri varsa anında otomatik yeniden ayağa kaldırır.
setInterval(() => {
  if (botStatus !== 'connected' && !isStarting) {
    const credsPath = path.join(AUTH_FOLDER, 'creds.json');
    if (fs.existsSync(credsPath)) {
      console.log('[WhatsApp Watchdog] Bağlantı boşta/kopuk, otomatik yeniden bağlanılıyor...');
      startWhatsAppBot().catch(err => console.warn('[WhatsApp Watchdog] Yeniden bağlanma uyarısı:', err.message));
    }
  }
}, 20000);

module.exports = {
  startWhatsAppBot,
  requestPairingCode,
  sendTextMessage,
  getBotStatus,
  logoutBot,
  normalizePhone
};
