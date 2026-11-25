const { getStore } = require("@netlify/blobs");

const store = getStore("tuzla-balik-data");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    try {
      const saved = await store.get("settings", { type: "json" });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(saved ?? {})
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Ayarlar okunamadı" })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const parsed = JSON.parse(event.body || "{}");
      await store.setJSON("settings", parsed);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Ayarlar kalıcı olarak kaydedildi"
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Geçersiz JSON veya kayıt hatası" })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" })
  };
};
