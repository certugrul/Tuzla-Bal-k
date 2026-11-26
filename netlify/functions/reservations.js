const { getStore } = require("@netlify/blobs");

const store = getStore("tuzla-balik-data");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Load existing reservations
  let list = [];
  try {
    const saved = await store.get("reservations", { type: "json" });
    if (Array.isArray(saved)) list = saved;
  } catch (_) {}

  // Load settings
  let settings = { surveyDelayDays: 1, surveySendTime: "12:00" };
  try {
    const savedSettings = await store.get("settings", { type: "json" });
    if (savedSettings) settings = { ...settings, ...savedSettings };
  } catch (_) {}

  const host = event.headers.host ? `https://${event.headers.host}` : "";

  // Helper: scheduled time
  function calculateScheduledTime(dateStr) {
    const delayDays = settings.surveyDelayDays !== undefined ? Number(settings.surveyDelayDays) : 1;
    const sendTime = settings.surveySendTime || "12:00";
    let [hour, minute] = sendTime.split(':').map(v => parseInt(v, 10));
    if (isNaN(hour)) hour = 12;
    if (isNaN(minute)) minute = 0;

    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        d.setDate(d.getDate() + delayDays);
        d.setHours(hour, minute, 0, 0);
        return d.toISOString();
      }
    } catch (_) {}
    const fallback = new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000);
    fallback.setHours(hour, minute, 0, 0);
    return fallback.toISOString();
  }

  function normalizePhone(phone) {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "9" + clean;
    else if (clean.startsWith("5")) clean = "90" + clean;
    return clean;
  }

  function getWhatsAppDirectUrl(resItem) {
    const phone = normalizePhone(resItem.phone);
    const surveyUrl = `${host}/anket.html?id=${resItem.id}`;
    let template = settings.surveyMessageTemplate || `Merhaba Sayın *{name}*,\n\nTuzla Balık Soyak'ta ağırlamaktan büyük mutluluk duyduk. 🐟✨\n\nSizlere daima en taze ve özenli lezzetleri sunabilmemiz için 30 saniyelik kısa değerlendirme anketimize katılırsanız çok mutlu oluruz:\n👉 {survey_url}\n\nAfiyetle ve sevgiyle kalın, tekrar bekleriz! 🥂`;
    const text = template.replace(/{name}/g, resItem.name || 'Misafirimiz').replace(/{survey_url}/g, surveyUrl);
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  // GET: All reservations
  if (event.httpMethod === "GET") {
    const enriched = list.map(item => ({
      ...item,
      wa_direct_url: getWhatsAppDirectUrl(item)
    }));
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(enriched)
    };
  }

  // POST: Add reservation OR update status
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");

      // Status update
      if (body.action === "update_status" && body.id) {
        const target = list.find(r => r.id === body.id);
        if (!target) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: "Rezervasyon bulunamadı" }) };
        }
        if (body.survey_status) target.survey_status = body.survey_status;
        if (body.survey_status === "sent") {
          target.survey_sent_at = new Date().toISOString();
          target.survey_sent_via = body.survey_sent_via || "manual_whatsapp";
        }
        await store.setJSON("reservations", list);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, reservation: target }) };
      }

      // Delete action
      if (body.action === "delete" && body.id) {
        list = list.filter(r => r.id !== body.id);
        await store.setJSON("reservations", list);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Silindi" }) };
      }

      // Create new reservation
      if (!body.name || !body.phone) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "İsim ve telefon zorunludur" }) };
      }

      const dateStr = body.date || new Date().toISOString().slice(0, 10);
      const newReservation = {
        id: "res_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        name: body.name.trim(),
        phone: body.phone.trim(),
        guests: body.guests || "2",
        area: body.area || "Fark etmez",
        date: dateStr,
        time: body.time || "20:00",
        notes: body.notes || "",
        created_at: new Date().toISOString(),
        survey_scheduled_at: calculateScheduledTime(dateStr),
        survey_status: "pending",
        survey_sent_at: null,
        survey_sent_via: null,
        survey_data: null
      };

      list.unshift(newReservation);
      await store.setJSON("reservations", list);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          reservation: newReservation,
          wa_direct_url: getWhatsAppDirectUrl(newReservation)
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "İşlem başarısız", details: err.message })
      };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
