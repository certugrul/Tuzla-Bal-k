/**
 * Tuzla Balık Soyak - Rezervasyon & Anket Otomasyon Motoru
 * Rezervasyondan belirtilen gün sonra (varsayılan 1 gün) ve belirlenen saatte (varsayılan 12:00)
 * anket gönderimini dinamik olarak yönetir.
 */

const fs = require('fs');
const path = require('path');

const RESERVATIONS_PATH = path.join(__dirname, 'reservations.json');
const SETTINGS_PATH = path.join(__dirname, 'site-settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
    }
  } catch (err) {
    console.warn('[Automation] Ayarlar okunamadı:', err.message);
  }
  return {
    surveyDelayDays: 1,
    surveySendTime: '12:00',
    surveyAutoSend: true
  };
}

function loadReservations() {
  try {
    if (!fs.existsSync(RESERVATIONS_PATH)) {
      fs.writeFileSync(RESERVATIONS_PATH, '[]', 'utf8');
      return [];
    }
    return JSON.parse(fs.readFileSync(RESERVATIONS_PATH, 'utf8'));
  } catch (err) {
    console.error('[Automation] Rezervasyonlar okunamadı:', err.message);
    return [];
  }
}

function saveReservations(data) {
  try {
    fs.writeFileSync(RESERVATIONS_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[Automation] Rezervasyonlar kaydedilemedi:', err.message);
    return false;
  }
}

/**
 * Dinamik Zamanlayıcı Hesabı:
 * Rezervasyon tarihinden X gün sonra (delayDays) ve belirlenen saatte (HH:mm) zaman damgası üretir
 * @param {string} dateStr 'YYYY-MM-DD'
 * @param {number} [customDelayDays] İsteğe bağlı gün gecikmesi
 * @param {string} [customSendTime] İsteğe bağlı saat (Örn: '12:00')
 * @returns {string} ISO date string
 */
function calculateScheduledTime(dateStr, customDelayDays, customSendTime) {
  const settings = loadSettings();
  const delayDays = customDelayDays !== undefined 
    ? Number(customDelayDays) 
    : (settings.surveyDelayDays !== undefined ? Number(settings.surveyDelayDays) : 1);
    
  const sendTime = customSendTime || settings.surveySendTime || '12:00';
  let [hour, minute] = sendTime.split(':').map(v => parseInt(v, 10));
  if (isNaN(hour)) hour = 12;
  if (isNaN(minute)) minute = 0;

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const target = new Date(year, month, day);
      target.setDate(target.getDate() + delayDays);
      target.setHours(hour, minute, 0, 0);
      return target.toISOString();
    }
  } catch (_) {}
  
  const fallback = new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000);
  fallback.setHours(hour, minute, 0, 0);
  return fallback.toISOString();
}

/**
 * Telefon numarasını WhatsApp uluslararası formatına (905xxxxxxxxx) normalize eder
 */
function normalizePhone(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) clean = '9' + clean;
  else if (clean.startsWith('5')) clean = '90' + clean;
  return clean;
}

/**
 * Müşteriye özel WhatsApp anket davet mesajı ve linki üretir (Özelleştirilebilir Şablon Destekli)
 */
function generateRawSurveyMessage(resItem, hostUrl = '') {
  const settings = loadSettings();
  const base = hostUrl ? hostUrl.replace(/\/$/, '') : '';
  const surveyUrl = `${base}/anket.html?id=${resItem.id}`;
  
  let template = settings.surveyMessageTemplate || 
`Merhaba Sayın *{name}*, 

Tuzla Balık Soyak'ta ağırlamaktan büyük mutluluk duyduk. 🐟✨

Sizlere daima en taze ve özenli lezzetleri sunabilmemiz için 30 saniyelik kısa değerlendirme anketimize katılırsanız çok mutlu oluruz:
👉 {survey_url}

Afiyetle ve sevgiyle kalın, tekrar bekleriz! 🥂`;

  return template
    .replace(/{name}/g, resItem.name || 'Misafirimiz')
    .replace(/{survey_url}/g, surveyUrl);
}

function generateSurveyMessage(resItem, hostUrl = '') {
  return encodeURIComponent(generateRawSurveyMessage(resItem, hostUrl));
}

/**
 * 1-Tık WhatsApp Açma URL'si üretir
 */
function getWhatsAppDirectUrl(resItem, hostUrl = '') {
  const phone = normalizePhone(resItem.phone);
  const msg = generateSurveyMessage(resItem, hostUrl);
  return `https://wa.me/${phone}?text=${msg}`;
}

/**
 * Zamanı gelmiş (veya geçmiş) ve henüz gönderilmemiş anketleri listeler
 */
function getDueSurveys() {
  const all = loadReservations();
  const now = new Date();
  return all.filter(r => {
    if (r.survey_status !== 'pending') return false;
    if (!r.survey_scheduled_at) return true;
    return new Date(r.survey_scheduled_at) <= now;
  });
}

/**
 * Otomasyon döngüsü: Ayarlanan saat ve dakikayı kontrol eder
 */
let automationInterval = null;
let lastCheckMinuteKey = null;

function startAutomationScheduler(options = {}) {
  if (automationInterval) clearInterval(automationInterval);

  const initialSettings = loadSettings();
  console.log(`[Automation] Zamanlayıcı aktif: Rezervasyondan ${initialSettings.surveyDelayDays || 1} gün sonra saat ${initialSettings.surveySendTime || '12:00'}'de çalışacak şekilde ayarlandı.`);

  automationInterval = setInterval(() => {
    const settings = loadSettings();
    if (settings.surveyAutoSend === false) return;

    const sendTime = settings.surveySendTime || '12:00';
    let [targetHour, targetMinute] = sendTime.split(':').map(v => parseInt(v, 10));
    if (isNaN(targetHour)) targetHour = 12;
    if (isNaN(targetMinute)) targetMinute = 0;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const minuteKey = `${now.toISOString().slice(0, 10)}_${currentHour}:${currentMinute}`;

    // Ayarlanan saat ve dakikada sadece 1 kez tetiklenir
    if (currentHour === targetHour && currentMinute === targetMinute && lastCheckMinuteKey !== minuteKey) {
      lastCheckMinuteKey = minuteKey;
      const dueList = getDueSurveys();
      console.log(`[Automation - ${now.toLocaleTimeString()}] ${sendTime} Zamanlayıcısı Tetiklendi: Gönderilmeyi bekleyen ${dueList.length} anket kuyrukta.`);
      
      if (options.onDueSurveys) {
        options.onDueSurveys(dueList);
      }
    }
  }, 25000); // 25 saniyede bir kontrol
}

module.exports = {
  loadSettings,
  loadReservations,
  saveReservations,
  calculateScheduledTime,
  normalizePhone,
  generateRawSurveyMessage,
  generateSurveyMessage,
  getWhatsAppDirectUrl,
  getDueSurveys,
  startAutomationScheduler
};
