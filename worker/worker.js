// =============================================================
//  MODDACHECK — Anthropic API proxy (Cloudflare Worker) — QATTIQLASHTIRILGAN
// =============================================================
//  Maqsad: API kalitini brauzerga ko'rsatmasdan AI so'rovlarini uzatish va
//  proxy'ni suiiste'moldan himoya qilish.
//
//  Cloudflare sozlamalari (Settings → Variables and Secrets):
//    ANTHROPIC_API_KEY  (Secret, majburiy)
//    ALLOWED_ORIGIN     (Text, tavsiya) — vergul bilan bir nechta:
//                       "https://nshakhobiddin.github.io,http://localhost:8000"
//                       Bo'sh bo'lsa: faqat GitHub Pages manzili ruxsat etiladi.
//    MODEL              (Text, ixtiyoriy) — standart: claude-sonnet-4-6
//    MAX_TOKENS         (Text, ixtiyoriy) — standart: 1024 (yuqori chegara)
//    RATE_PER_MINUTE    (Text, ixtiyoriy) — IP uchun daqiqasiga so'rov, standart 20
//    APP_TOKEN          (Secret, ixtiyoriy) — o'rnatilsa, `x-app-token` sarlavhasi talab qilinadi
//
//  Himoya: origin ro'yxati, model va max_tokens serverda majburlanadi, so'rov
//  shakli tekshiriladi (faqat ruxsat etilgan maydonlar, hajm chegaralari),
//  oddiy rate-limit, 60 s timeout. Qo'shimcha: Cloudflare → Security → WAF →
//  Rate limiting rules bilan kuchliroq cheklov qo'yish tavsiya etiladi.
// =============================================================

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_ORIGINS = ['https://nshakhobiddin.github.io'];
const ALLOWED_MEDIA = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const LIMITS = { system: 8000, messages: 24, text: 12000, imageB64: 7_000_000, body: 9_000_000, tools: 4 };

// Oddiy, izolyatsiya darajasidagi rate-limit (eng yaxshi harakat)
const buckets = new Map();
function rateLimited(ip, perMinute) {
  const now = Date.now(), win = 60_000;
  let b = buckets.get(ip);
  if (!b || now - b.start > win) { b = { start: now, n: 0 }; buckets.set(ip, b); }
  b.n++;
  if (buckets.size > 5000) buckets.clear();
  return b.n > perMinute;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-app-token',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
const json = (obj, status, cors) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors } });
const err = (message, status, cors, type) => json({ type: 'error', error: { type: type || 'proxy_error', message } }, status, cors);

function isPlainObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

// So'rov tanasini tekshirish va tozalash. Faqat ruxsat etilgan maydonlar qoladi.
function sanitize(body, env) {
  if (!isPlainObject(body)) throw new Error('JSON obyekt kutilgan');
  const out = {};
  out.model = env.MODEL || DEFAULT_MODEL; // mijoz modelni tanlay olmaydi
  const cap = Math.max(64, Math.min(4096, parseInt(env.MAX_TOKENS || '1024', 10) || 1024));
  const want = Number.isFinite(body.max_tokens) ? body.max_tokens : cap;
  out.max_tokens = Math.max(16, Math.min(cap, Math.floor(want)));
  if (body.system !== undefined) {
    if (typeof body.system !== 'string') throw new Error('system satr bo\'lishi kerak');
    out.system = body.system.slice(0, LIMITS.system);
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) throw new Error('messages bo\'sh');
  if (body.messages.length > LIMITS.messages) throw new Error('messages juda ko\'p');
  out.messages = body.messages.map((m) => {
    if (!isPlainObject(m) || (m.role !== 'user' && m.role !== 'assistant')) throw new Error('role noto\'g\'ri');
    if (typeof m.content === 'string') return { role: m.role, content: m.content.slice(0, LIMITS.text) };
    if (!Array.isArray(m.content) || m.content.length === 0 || m.content.length > 6) throw new Error('content noto\'g\'ri');
    const blocks = m.content.map((b) => {
      if (!isPlainObject(b)) throw new Error('block noto\'g\'ri');
      if (b.type === 'text') return { type: 'text', text: String(b.text || '').slice(0, LIMITS.text) };
      if (b.type === 'image') {
        const s = b.source;
        if (!isPlainObject(s) || s.type !== 'base64' || !ALLOWED_MEDIA.has(s.media_type)) throw new Error('rasm formati qo\'llab-quvvatlanmaydi');
        if (typeof s.data !== 'string' || s.data.length > LIMITS.imageB64) throw new Error('rasm juda katta');
        return { type: 'image', source: { type: 'base64', media_type: s.media_type, data: s.data } };
      }
      if (b.type === 'tool_use' || b.type === 'tool_result') return b; // ko'p qadamli tool oqimi uchun
      throw new Error('block turi ruxsat etilmagan: ' + b.type);
    });
    return { role: m.role, content: blocks };
  });
  if (body.temperature !== undefined) {
    const t = Number(body.temperature);
    if (Number.isFinite(t)) out.temperature = Math.max(0, Math.min(1, t));
  }
  if (body.tools !== undefined) {
    if (!Array.isArray(body.tools) || body.tools.length > LIMITS.tools) throw new Error('tools noto\'g\'ri');
    for (const t of body.tools) if (!isPlainObject(t) || typeof t.name !== 'string' || !isPlainObject(t.input_schema)) throw new Error('tool shakli noto\'g\'ri');
    out.tools = body.tools;
    if (body.tool_choice !== undefined) out.tool_choice = body.tool_choice;
  }
  return out;
}

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN.split(',') : DEFAULT_ORIGINS).map((s) => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const originOk = allowed.includes('*') || allowed.includes(origin);
    const cors = corsHeaders(originOk ? (allowed.includes('*') ? '*' : origin) : allowed[0]);

    if (request.method === 'OPTIONS') return new Response(null, { status: originOk ? 204 : 403, headers: cors });
    if (request.method !== 'POST') return err('Faqat POST so\'rovlar qabul qilinadi.', 405, cors);

    // Kelib chiqish tekshiruvi: brauzer bo'lmagan mijozlar faqat APP_TOKEN bilan
    if (env.APP_TOKEN) {
      if (request.headers.get('x-app-token') !== env.APP_TOKEN) return err('Ruxsat yo\'q (token).', 403, cors, 'permission_error');
    } else if (!originOk) {
      return err('Ruxsat yo\'q (origin).', 403, cors, 'permission_error');
    }

    if (!env.ANTHROPIC_API_KEY) return err('Server xatosi: ANTHROPIC_API_KEY sozlanmagan.', 500, cors, 'config_error');

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const perMin = Math.max(1, parseInt(env.RATE_PER_MINUTE || '20', 10) || 20);
    if (rateLimited(ip, perMin)) return err('So\'rovlar ko\'payib ketdi. Bir daqiqadan so\'ng urinib ko\'ring.', 429, cors, 'rate_limit_error');

    const len = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (len > LIMITS.body) return err('So\'rov hajmi juda katta.', 413, cors);

    let body;
    try { body = await request.json(); } catch { return err('JSON o\'qib bo\'lmadi.', 400, cors, 'invalid_request_error'); }
    let payload;
    try { payload = sanitize(body, env); } catch (e) { return err('So\'rov noto\'g\'ri: ' + e.message, 400, cors, 'invalid_request_error'); }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60_000);
    try {
      const upstream = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': ANTHROPIC_VERSION },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      const text = await upstream.text();
      return new Response(text, { status: upstream.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors } });
    } catch (e) {
      const aborted = e && e.name === 'AbortError';
      return err(aborted ? 'Vaqt tugadi (60 s).' : 'Anthropic API\'ga ulanib bo\'lmadi: ' + e.message, aborted ? 504 : 502, cors, 'api_error');
    } finally {
      clearTimeout(timer);
    }
  },
};
