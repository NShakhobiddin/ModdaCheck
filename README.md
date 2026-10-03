# MODDACHECK (TAQIQCHECK)

O'zbekiston bojxonasida nazorat ostidagi moddalar va dori vositalarini tekshirish ilovasi:
**qidiruv** (oflayn ishlaydi), **rasm tahlili** va **AI chat** (Claude).

Jonli: https://nshakhobiddin.github.io/ModdaCheck/

> ⚠️ Ma'lumotnoma vosita. Yuridik maslahat emas; yakuniy qaror amaldagi qonun va bojxona xodimiga tegishli.

## Arxitektura

```
Brauzer (GitHub Pages, PWA)  ──POST──►  Cloudflare Worker (proxy)  ──x-api-key──►  Anthropic API
  index.html, app.js, database.js        kalit MAXFIY shu yerda, model/limit         Claude
  matcher.js, sw.js (oflayn)             majburlanadi, origin va rate-limit
```

- **Frontend** — statik PWA. Qidiruv va ma'lumotnoma internetsiz ishlaydi (service worker).
- **Backend proxy** — `worker/worker.js`. Anthropic kaliti faqat Worker secret'ida.

## Loyiha tuzilmasi

| Yo'l | Nima |
|---|---|
| `src/app.jsx` | Ilova (React, JSX) — ekranlar va holat |
| `src/icons.jsx` | Maxsus chizilgan ikonkalar to'plami (24px setka, 1.75 chiziq) + logotip |
| `src/illustrations.jsx` | Intro va skaner illyustratsiyalari (SVG, mavzuga mos) |
| `src/matcher.js` | Moslashtirish: normalizatsiya, kirill↔lotin, so'z chegarasi, fuzzy darajalari |
| `src/i18n.js` | Interfeys matnlari (uz / ru) |
| `src/markdown.js` | Chat uchun xavfsiz Markdown render |
| `src/styles.css` | Dizayn tokenlari (yorug'/qorong'i), animatsiyalar, Tailwind kirish fayli |
| `src/sw.js` | Service worker shabloni (oflayn) |
| `database.js` | Moddalar bazasi (`window.TAQIQ_DATABASE`) |
| `public/` | manifest, ikonkalar |
| `worker/` | Cloudflare Worker + wrangler.toml |
| `scripts/build.mjs` | Build: `dist/` yaratadi |
| `scripts/fix-database.mjs` | Bazani tozalash/formatlash yordamchisi |
| `tests/` | `npm test` — moslashtirish va baza sxemasi testlari |

`dist/` **commit qilinmaydi** — GitHub Actions har push'da o'zi build qilib Pages'ga chiqaradi.

## Dizayn tizimi

- **Ranglar** — `src/styles.css` dagi CSS o'zgaruvchilari (`--canvas`, `--surface`, `--ink`, `--brand`, `--sev1..5`).
  Qorong'i rejim tizim sozlamasiga qarab avtomatik. Tailwind'da: `bg-surface`, `text-ink-2`, `bg-sev3-soft`, `text-sev1-ink`.
- **Toifa ranglari**: I ro'yxat — qizil, II — to'q sariq, III — sariq, IV — moviy, kuchli ta'sir qiluvchi — binafsha.
- **Navigatsiya**: pastki menyu (Qidiruv, Skaner, Yordamchi, Qoidalar); telefonning "orqaga" tugmasi ishlaydi.
- **Intro**: birinchi kirishda 3 ekran (`localStorage: mc_intro_v1`); "Ilova haqida" oynasidan qayta ko'rish mumkin.
- **Til**: asosiy — o'zbekcha. Ruscha faqat "Ilova haqida" (i) oynasidan tanlanadi va eslab qolinadi (`localStorage: mc_lang`).
- **Telegram Mini App**: Telegram ichida ochilganda SDK yuklanadi; ilova to'liq balandlikka yoyiladi, telefonlarda
  to'liq ekran rejimi so'raladi (Bot API 8.0+), Telegram mavzusi (yorug'/qorong'i), xavfsiz zonalar va Telegram'ning
  "orqaga" tugmasi ishlatiladi, aylantirishda ilova yopilib qolmaydi. Oddiy brauzerda SDK umuman yuklanmaydi.

## Ishlab chiqish

```bash
npm ci            # bog'liqliklar
npm test          # testlar
npm run build     # dist/ yaratish
npm run dev       # build + http://localhost:8000
npm run icons     # (ixtiyoriy) public/icons/icon.svg dan PNG ikonkalar; puppeteer kerak
```

Kodni o'zgartirganda faqat `src/` va `database.js` ni tahrirlang. `dist/app.js` qo'lda yozilmaydi.

Bazaga yozuv qo'shganda maydonlar: `id, name, aliases[], category, description, medicines[]?, alsoIn[]?`.
`category` qiymati `src/app.jsx` dagi `WARNING_TYPES` kalitlaridan biri bo'lishi shart (test tekshiradi).

### Moslashtirish qoidalari (soxta aniqlashga qarshi)
- So'z chegarasi bo'yicha (qism-satr emas). "Nurofen" ≠ "Nurofen Plus".
- 1–3 harfli atamalar faqat BOSH HARFLI qisqartma bo'lsa (LSD, DMT, MDMA). "J", "A2", "Oq" hech qachon.
- Ko'cha jargonlari / oddiy so'zlar (`SLANG_STOPLIST`) avtomatik moslashtirilmaydi, faqat ko'rsatiladi.
- Fuzzy: 6–8 harf → 1 xato, 9+ → 2 xato, birinchi harf teng bo'lishi shart. Natija "Ehtimoliy" deb belgilanadi.

## Deploy

### 1. Cloudflare Worker
Dashboard: **Workers & Pages → Create → Start with Hello World** → kodni `worker/worker.js` bilan almashtiring → **Deploy**.

**Settings → Variables and Secrets**:

| Nom | Turi | Qiymat |
|---|---|---|
| `ANTHROPIC_API_KEY` | Secret | Anthropic kalitingiz (majburiy) |
| `ALLOWED_ORIGIN` | Text | `https://nshakhobiddin.github.io` (vergul bilan bir nechta mumkin) |
| `MODEL` | Text | ixtiyoriy, standart `claude-sonnet-4-6` |
| `MAX_TOKENS` | Text | ixtiyoriy, standart `1024` |
| `RATE_PER_MINUTE` | Text | ixtiyoriy, standart `20` |
| `APP_TOKEN` | Secret | ixtiyoriy; o'rnatilsa frontend `x-app-token` yuborishi kerak |

Qo'shimcha himoya: Cloudflare → Security → WAF → **Rate limiting rules** (masalan 60 so'rov / 10 daqiqa / IP).

### 2. Frontend
`src/app.jsx` da `PROXY_URL` ni Worker manzilingizga qo'ying va push qiling. GitHub Actions test + build + deploy qiladi.

GitHub → **Settings → Pages → Source: GitHub Actions** (bir marta).

### 3. Yangi kalit
Agar kalit biror joyda ochiq ko'ringan bo'lsa — Anthropic Console'da bekor qilib, yangisini yarating va **spend limit** qo'ying.

## Manbalar
- VMQ-330 (giyohvandlik vositalari, psixotrop moddalar, prekursorlar ro'yxatlari): https://lex.uz/docs/2815342
- VMQ-818 (kuchli ta'sir qiluvchi moddalar): https://lex.uz/docs/-4532164
- VMQ-191 (jismoniy shaxslar uchun dori olib o'tish me'yorlari): https://lex.uz/docs/-2978664
