/* =====================================================================
 *  MODDACHECK — Moslashtirish moduli (TaqiqMatcher)
 *  ---------------------------------------------------------------------
 *  Vazifasi: matn / rasm / qidiruvdan kelgan nomlarni bazadagi moddalar
 *  bilan XAVFSIZ va ANIQ solishtirish. Soxta aniqlashlarni (false positive)
 *  oldini olish uchun:
 *    • so'z chegarasi bo'yicha moslashtirish (qism-satr emas)
 *    • 1–3 harfli atamalar faqat BOSH HARFLI qisqartma bo'lsa (LSD, DMT…)
 *    • ko'cha jargonlari / oddiy so'zlar ("qora", "oq", "acid"…) avtomatik
 *      moslashtirishdan chiqarilgan (faqat ko'rsatish uchun qoladi)
 *    • fuzzy (xato yozilgan) moslashtirish uzunlikka bog'liq va faqat
 *      6+ harfli atamalar uchun
 *    • kirill ↔ lotin transliteratsiya, apostrof/diakritik normalizatsiya
 *
 *  Brauzerda: window.TaqiqMatcher ;  Node (testlar): module.exports
 * ===================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.TaqiqMatcher = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  // ---------- Transliteratsiya (kirill -> lotin, o'zbek/rus) ----------
  const CYR = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sh','ъ':'','ы':'i','ь':'',
    'э':'e','ю':'yu','я':'ya','ў':'o','қ':'q','ғ':'g','ҳ':'h','ҷ':'j','ӯ':'u','ї':'i','і':'i','є':'e'
  };
  function translit(s) {
    let out = '';
    for (const ch of s) out += (CYR[ch] !== undefined ? CYR[ch] : ch);
    return out;
  }

  // ---------- Normalizatsiya ----------
  // kichik harf, kirill->lotin, apostroflarni olib tashlash, diakritiklarni
  // olib tashlash, harf/raqamdan boshqasini bo'shliqqa aylantirish.
  const APOSTROPHES = /[‘’ʻʼ`´'′]/g;
  function normalize(s) {
    if (!s) return '';
    let t = String(s).toLowerCase();
    t = translit(t);
    t = t.replace(APOSTROPHES, '');
    t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    t = t.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
    return t;
  }
  const words = (norm) => (norm ? norm.split(' ') : []);

  // ---------- Jargon / oddiy so'zlar (avtomatik moslashtirilmaydi) ----------
  // Normalizatsiya qilingan ko'rinishda (apostrofsiz).
  const SLANG_STOPLIST = new Set([
    // o'zbek/rus oddiy so'zlari
    'qora','oq','tosh','yem','ot','plan','chim','gera','slow','koka','gash','xat','qat',
    'yaxshi','non','choy','suv','dori','tuzlar','tuz','kristall','shisha','pechene',
    // ingliz ko'cha jargoni
    'acid','pot','weed','eden','nihon','murka','serotoni','molly','speed','ice','snow',
    'coke','crystal','dope','smack','horse','grass','hash','pills','salt','salts',
    'bath salts','vitamin r','vitamin k','special k','china white','oq xitoylik',
    'beliy kitayets','blackstuff','hanka','kuknar','roofies','oxy','hillbilly heroin',
    'qishloq geroini','krokodil','tram','loras','j','a2'
  ]);

  // Bosh harfli qisqartma: faqat A-Z, 0-9, '-', ',' ; kamida bitta harf; 3–6 belgi
  function isAbbrev(original) {
    const t = String(original).trim();
    return /^[A-Z0-9][A-Z0-9,\-]{1,5}$/.test(t) && /[A-Z]/.test(t);
  }

  // ---------- Damerau-Levenshtein (OSA) ----------
  function editDistance(a, b, max) {
    if (a === b) return 0;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    const d = [];
    for (let i = 0; i <= la; i++) { d[i] = [i]; }
    for (let j = 0; j <= lb; j++) { d[0][j] = j; }
    for (let i = 1; i <= la; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= lb; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
        d[i][j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1; // erta to'xtash
    }
    return d[la][lb];
  }
  // Uzunlikka bog'liq ruxsat etilgan xato soni
  function fuzzyBudget(len) {
    if (len < 6) return 0;
    if (len <= 8) return 1;
    return 2;
  }

  // ---------- Indeks ----------
  // Har bir yozuv uchun atamalar: {text, norm, words, auto, fuzzy}
  //   auto  – avtomatik (chat/rasm) moslashtirishda ishlatiladimi
  //   fuzzy – xato yozilganini ham qidirish mumkinmi
  function termMeta(text, brand) {
    const norm = normalize(text);
    const w = words(norm);
    const compact = norm.replace(/ /g, '');
    const slang = SLANG_STOPLIST.has(norm);
    const abbrev = isAbbrev(text);
    const longEnough = compact.length >= 4;
    const auto = !slang && (longEnough || abbrev) && norm.length > 0;
    // fuzzy: faqat bitta so'zli, 6+ harfli, jargon bo'lmagan, qisqartma bo'lmagan
    const fuzzy = auto && !abbrev && w.length === 1 && compact.length >= 6;
    return { text, norm, words: w, compact, auto, fuzzy, abbrev, slang, brand: !!brand };
  }

  function buildIndex(db) {
    const items = db.map((item) => {
      const seen = new Set();
      const terms = [];
      const push = (r, brand) => {
        const m = termMeta(r, brand);
        if (!m.norm || seen.has(m.norm)) return;
        seen.add(m.norm);
        terms.push(m);
      };
      [item.name].concat(item.aliases || []).forEach((r) => push(r, false));
      (item.medicines || []).forEach((r) => push(r, true));
      return { item, terms, nameNorm: normalize(item.name) };
    });
    return { items, size: items.length };
  }

  // Atama (so'zlar ketma-ketligi) tokenning so'zlari ichida so'z chegarasida bormi?
  function phraseInWords(termWords, tokenWords) {
    const n = termWords.length;
    if (n === 0 || n > tokenWords.length) return false;
    outer: for (let i = 0; i + n <= tokenWords.length; i++) {
      for (let k = 0; k < n; k++) if (tokenWords[i + k] !== termWords[k]) continue outer;
      return true;
    }
    return false;
  }

  // Tuz/shakl so'zlari: "Kodein fosfat" = "kodein" + shakl so'zi. Teskari
  // moslashtirish (aniqlangan nom atama ichida) FAQAT qolgan so'zlar shu
  // ro'yxatdan bo'lsa ruxsat etiladi ("Nurofen" ≠ "Nurofen Plus").
  const FORM_WORDS = new Set(['gidroxlorid', 'hydrochloride', 'hcl', 'fosfat', 'phosphate', 'sulfat', 'sulfate',
    'tartrat', 'tartrate', 'sitrat', 'citrate', 'asetat', 'acetate', 'natriy', 'sodium', 'kaliy', 'potassium',
    'kombinatsiyalari', 'combinations', 'preparatlar', 'preparations', 'oksid', 'oxide', 'n', 'gidrobromid',
    'hydrobromide', 'maleat', 'maleate', 'metilbromid', 'methylbromide', 'bitartrat', 'bitartrate']);
  function reverseAllowed(tokW, termWords) {
    const set = new Set(tokW);
    for (const w of termWords) if (!set.has(w) && !FORM_WORDS.has(w)) return false;
    return true;
  }

  // ---------- 1) RASM: AI aniqlagan bitta nomni bazaga solishtirish ----------
  // Natija: {item, tier:'exact'|'fuzzy', term} yoki null
  // Aniq mosliklar ichida ENG UZUN (eng aniq) atama ustun: "Codeine phosphate"
  // -> "Kodein fosfat" (umumiy "Kodein" emas).
  function matchDetected(index, detected) {
    const norm = normalize(detected);
    if (!norm) return null;
    const tokW = words(norm);
    const compactTok = norm.replace(/ /g, '');
    let bestExact = null;
    for (const entry of index.items) {
      for (const t of entry.terms) {
        if (!t.auto) continue;
        let hit = false;
        // aniq: to'liq tenglik yoki so'z chegarasida ichida
        if (t.norm === norm || t.compact === compactTok || phraseInWords(t.words, tokW)) hit = true;
        // teskari: aniqlangan nom (5+ harf) atama ichida, qolgani faqat shakl so'zlari
        else if (!t.brand && compactTok.length >= 5 && phraseInWords(tokW, t.words) && reverseAllowed(tokW, t.words)) hit = true;
        if (hit) {
          const len = t.compact.length;
          const isName = t.norm === entry.nameNorm;
          if (!bestExact || len > bestExact.len || (len === bestExact.len && isName && !bestExact.isName)) {
            bestExact = { item: entry.item, term: t.text, len, isName };
          }
        }
      }
    }
    if (bestExact) return { item: bestExact.item, tier: 'exact', term: bestExact.term };
    // fuzzy: faqat bitta so'zli atamalar; tokenning har bir so'zi bilan
    let best = null;
    for (const entry of index.items) {
      for (const t of entry.terms) {
        if (!t.fuzzy) continue;
        const budget = fuzzyBudget(t.compact.length);
        if (!budget) continue;
        for (const w of tokW) {
          if (w.length < 6 || w[0] !== t.compact[0]) continue; // birinchi harf teng bo'lsin
          const d = editDistance(w, t.compact, budget);
          if (d <= budget) {
            if (!best || d < best.d) best = { item: entry.item, tier: 'fuzzy', term: t.text, d };
          }
        }
      }
    }
    return best ? { item: best.item, tier: 'fuzzy', term: best.term } : null;
  }

  // Bir nechta aniqlangan nomlar -> noyob natijalar (eng yaxshi daraja bilan)
  function matchDetectedList(index, names) {
    const out = new Map();
    for (const n of names || []) {
      const m = matchDetected(index, n);
      if (!m) continue;
      const prev = out.get(m.item.id);
      if (!prev || (prev.tier === 'fuzzy' && m.tier === 'exact')) {
        out.set(m.item.id, { item: m.item, tier: m.tier, term: m.term, detected: n });
      }
    }
    return Array.from(out.values());
  }

  // ---------- 2) CHAT: erkin matn ichidan moddalarni topish (faqat aniq) ----------
  function findInText(index, text, limit) {
    const norm = normalize(text);
    if (!norm) return [];
    const tokW = words(norm);
    const found = [];
    for (const entry of index.items) {
      for (const t of entry.terms) {
        if (!t.auto) continue;
        if (phraseInWords(t.words, tokW)) { found.push(entry.item); break; }
      }
      if (limit && found.length >= limit) break;
    }
    return found;
  }

  // ---------- 3) QIDIRUV: foydalanuvchi so'rovi (erkinroq, saralangan) ----------
  // Qaytaradi: [{item, score}] eng yaxshisi birinchi
  function search(index, query, limit) {
    const q = normalize(query);
    if (!q) return [];
    const qc = q.replace(/ /g, '');
    const results = [];
    for (const entry of index.items) {
      let score = 0, term = null;
      for (const t of entry.terms) {
        let s = 0;
        if (t.norm === q || t.compact === qc) s = 100;
        else if (t.norm.startsWith(q)) s = 80;
        else if (t.words.some((w) => w.startsWith(q))) s = 60;
        else if (t.compact.includes(qc) && qc.length >= 3) s = 40;
        else if (t.norm.includes(q) && q.length >= 2) s = 30;
        if (s && t.norm === entry.nameNorm) s += 5; // asosiy nom ustunroq
        if (s > score) { score = s; term = t; }
      }
      // term: agar asosiy nom emas, sinonim/brend orqali topilgan bo'lsa — ko'rsatish uchun
      if (score) results.push({ item: entry.item, score, term: term && term.norm !== entry.nameNorm ? term.text : null });
    }
    results.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
    return limit ? results.slice(0, limit) : results;
  }

  return {
    normalize, translit, editDistance, fuzzyBudget, isAbbrev, termMeta,
    buildIndex, matchDetected, matchDetectedList, findInText, search,
    SLANG_STOPLIST
  };
});
