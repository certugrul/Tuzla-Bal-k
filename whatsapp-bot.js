/**
 * Tuzla Balık Soyak - Otomatik WhatsApp Web Bot Servisi
 * Baileys kütüphanesi kullanarak WhatsApp Web oturumunu yönetir.
 * Tek seferlik QR kod okutulduktan sonra arka planda otomatik mesaj atabilir.
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const AUTH_FOLDER = path.join(__dirname, '.whatsapp_auth');

let sock = null;
let currentQR = null;
let currentQRDataUrl = null;
let botStatus = 'disconnected'; // 'disconnected' | 'connecting' | 'qr_ready' | 'connected'
let connectedUser = null;
let isStarting = false;

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

    sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['Tuzla Balık Soyak Bot', 'Chrome', '1.0.0']
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
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[WhatsApp Bot] Bağlantı kapandı (Kod: ${statusCode}). Yeniden bağlanılıyor mu: ${shouldReconnect}`);
        
        botStatus = 'disconnected';
        currentQR = null;
        currentQRDataUrl = null;
        connectedUser = null;
        isStarting = false;

        if (shouldReconnect) {
          setTimeout(() => startWhatsAppBot(), 3000);
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

module.exports = {
  startWhatsAppBot,
  requestPairingCode,
  sendTextMessage,
  getBotStatus,
  logoutBot,
  normalizePhone
};
