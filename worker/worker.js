// =============================================================
//  MODDACHECK / TAQIQCHECK — Anthropic API proxy (Cloudflare Worker)
// =============================================================
//  Maqsad: Anthropic API kalitini brauzerga ko'rsatmasdan, AI so'rovlarini
//  xavfsiz uzatish. Kalit faqat shu Worker ichida (maxfiy) saqlanadi.
//
//  Kerakli sozlamalar (Cloudflare):
//    - Secret: ANTHROPIC_API_KEY   (majburiy)  -> `wrangler secret put ANTHROPIC_API_KEY`
//    - Var:    ALLOWED_ORIGIN      (ixtiyoriy) -> masalan "https://USERNAME.github.io"
//                                                 (bo'sh bo'lsa "*" — hammaga ochiq)
// =============================================================

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin",
    };

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const json = (obj, status) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    if (request.method !== "POST") {
      return json({ error: { message: "Faqat POST so'rovlar qabul qilinadi." } }, 405);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: { message: "Server xatosi: ANTHROPIC_API_KEY sozlanmagan." } }, 500);
    }

    let bodyText;
    try {
      bodyText = await request.text();
    } catch (e) {
      return json({ error: { message: "So'rov tanasini o'qib bo'lmadi." } }, 400);
    }

    // (ixtiyoriy himoya) — juda katta so'rovlarni rad etamiz (~12 MB)
    if (bodyText.length > 12 * 1024 * 1024) {
      return json({ error: { message: "So'rov hajmi juda katta." } }, 413);
    }

    try {
      const upstream = await fetch(ANTHROPIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: bodyText,
      });

      const respText = await upstream.text();
      return new Response(respText, {
        status: upstream.status,
        headers: { "Content-Type": "application/json", ...cors },
      });
    } catch (e) {
      return json({ error: { message: "Anthropic API'ga ulanib bo'lmadi: " + e.message } }, 502);
    }
  },
};
