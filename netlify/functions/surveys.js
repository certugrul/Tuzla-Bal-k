const { getStore } = require("@netlify/blobs");

const store = getStore("tuzla-balik-data");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  let list = [];
  try {
    const saved = await store.get("reservations", { type: "json" });
    if (Array.isArray(saved)) list = saved;
  } catch (_) {}

  // GET: Specific survey info or all completed
  if (event.httpMethod === "GET") {
    const params = event.queryStringParameters || {};
    const surveyId = params.id;

    if (surveyId) {
      const item = list.find(r => r.id === surveyId);
      if (!item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Rezervasyon bulunamadı" }) };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          date: item.date,
          time: item.time,
          already_completed: item.survey_status === "completed",
          survey_data: item.survey_data
        })
      };
    }

    const completed = list
      .filter(r => r.survey_data !== null)
      .map(r => ({
        id: r.id,
        name: r.name,
        date: r.date,
        created_at: r.created_at,
        ...r.survey_data
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(completed)
    };
  }

  // POST: Submit survey response
  if (event.httpMethod === "POST") {
    try {
      const payload = JSON.parse(event.body || "{}");
      if (!payload.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "id eksik" }) };
      }

      const item = list.find(r => r.id === payload.id);
      if (!item) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Rezervasyon bulunamadı" }) };
      }

      item.survey_data = {
        score_overall: Number(payload.score_overall) || 5,
        score_food: Number(payload.score_food) || 5,
        score_service: Number(payload.score_service) || 5,
        score_ambience: Number(payload.score_ambience) || 5,
        comment: (payload.comment || "").trim(),
        google_review_clicked: Boolean(payload.google_review_clicked),
        submitted_at: new Date().toISOString()
      };
      item.survey_status = "completed";

      await store.setJSON("reservations", list);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: "Değerlendirmeniz için teşekkür ederiz!" })
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Anket kaydedilemedi", details: err.message })
      };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
