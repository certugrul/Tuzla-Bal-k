const { getStore } = require("@netlify/blobs");

const store = getStore("tuzla-balik-data");

function makeMenuScript(data) {
  const categories = Array.isArray(data.categories) ? data.categories : [];
  const items = Array.isArray(data.items) ? data.items : [];

  return `// Tuzla Balık Soyak - Dinamik Menü Veritabanı
// Netlify Blobs üzerinden sunulur

var MENU_CATEGORIES = ${JSON.stringify(categories, null, 2)};
var MENU_ITEMS = ${JSON.stringify(items, null, 2)};

if (typeof window !== "undefined") {
  window.MENU_CATEGORIES = MENU_CATEGORIES;
  window.MENU_ITEMS = MENU_ITEMS;
}
`;
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    try {
      const saved = await store.get("menu", { type: "json" });
      if (saved) {
        return { statusCode: 200, headers, body: makeMenuScript(saved) };
      }

      // İlk açılışta depoda kayıt yoksa mevcut menu-data.js dosyası kullanılır.
      // Netlify function çalışma dizininde bu dosyanın bulunması garanti değildir;
      // ilk menüyü aşağıdaki POST endpoint'ine kaydetmek önerilir.
      return {
        statusCode: 404,
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Menü henüz kalıcı depoya kaydedilmedi" })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Menü okunamadı" })
      };
    }
  }

  if (event.httpMethod === "POST") {
    try {
      const parsed = JSON.parse(event.body || "{}");
      if (!Array.isArray(parsed.items) || !Array.isArray(parsed.categories)) {
        return {
          statusCode: 400,
          headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ error: "items ve categories dizileri zorunludur" })
        };
      }

      await store.setJSON("menu", {
        items: parsed.items,
        categories: parsed.categories
      });

      return {
        statusCode: 200,
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          success: true,
          count: parsed.items.length,
          message: "Menü kalıcı olarak kaydedildi"
        })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ error: "Menü kaydedilemedi; JSON biçimini kontrol edin" })
      };
    }
  }

  return {
    statusCode: 405,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ error: "Method not allowed" })
  };
};
