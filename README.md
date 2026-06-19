# MODDACHECK (TAQIQCHECK)

O'zbekiston bojxonasida taqiqlangan/cheklangan dori va moddalarni tekshirish ilovasi:
**qidiruv**, **AI chat** va **rasm orqali tahlil** (Claude AI).

## Arxitektura

```
Brauzer (GitHub Pages)  ──POST──►  Cloudflare Worker  ──x-api-key──►  Anthropic API
   index.html + database.js          (kalit MAXFIY shu yerda)            Claude AI
```

- **Frontend** (`index.html`, `database.js`) — GitHub Pages'da statik hostlanadi.
- **Backend proxy** (`worker/worker.js`) — Cloudflare Worker. Anthropic kaliti **faqat shu yerda**, maxfiy (secret) sifatida saqlanadi. Kalit hech qachon brauzerga tushmaydi.

---

## 1-qadam — Cloudflare Worker'ni deploy qilish

### Variant A — Dashboard orqali (eng oson, hech narsa o'rnatmasdan)
1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Create Worker**.
2. Nom bering (masalan `taqiqcheck-proxy`) → **Deploy**.
3. **Edit code** → barcha kodni o'chirib, `worker/worker.js` ichidagini to'liq joylashtiring → **Deploy**.
4. **Settings → Variables and Secrets**:
   - **Add → Secret**: nomi `ANTHROPIC_API_KEY`, qiymati — Anthropic kalitingiz → **Save**.
   - (ixtiyoriy) **Add → Variable (Text)**: `ALLOWED_ORIGIN` = `https://USERNAME.github.io` (faqat o'z saytingizdan foydalanishga ruxsat — abuse'dan himoya).
5. Worker manzilini ko'chirib oling: `https://taqiqcheck-proxy.<subdomain>.workers.dev`.

### Variant B — Wrangler CLI orqali
```bash
npm install -g wrangler
cd worker
wrangler login
wrangler secret put ANTHROPIC_API_KEY      # so'ralganda kalitni kiriting
wrangler deploy
```
Oxirida chiqqan `*.workers.dev` manzilini ko'chirib oling.

---

## 2-qadam — Worker manzilini frontend'ga ulash

`index.html` faylida shu qatorni toping va Worker manzilingizni qo'ying:

```js
const PROXY_URL = "https://taqiqcheck-proxy.YOUR-SUBDOMAIN.workers.dev";
```

> `YOUR-SUBDOMAIN` so'zi qolsa, ilova "AI hali ulanmagan" deb ko'rsatadi (qidiruv baribir ishlayveradi).

---

## 3-qadam — GitHub Pages

Repozitoriyada `.github/workflows/pages.yml` mavjud — branchga push qilinganda saytni avtomatik deploy qiladi.

1. GitHub → repo → **Settings → Pages** → **Build and deployment → Source: GitHub Actions**.
   (Workflow buni avtomatik yoqishga ham harakat qiladi.)
2. **Actions** bo'limida deploy tugaganini kuting.
3. Sayt manzili: `https://USERNAME.github.io/moddacheck/` (yoki Pages bergan URL).

> Eslatma: GitHub Pages bepul faqat **public** repolar uchun. Private repo'da Pages uchun pulli reja kerak.

---

## Kodni o'zgartirish (build)

JSX brauzerda emas, **oldindan kompilyatsiya** qilinadi (tezroq va ishonchli — brauzerda Babel ishlatilmaydi):

- `app.jsx` — **manba** (shu faylni tahrirlang).
- `app.js` — **avtomatik generatsiya** (brauzer shuni ishlatadi, qo'lda tahrirlamang).
- `index.html` — `app.js` ni yuklaydi.

`app.jsx` ni o'zgartirgandan so'ng `app.js` ni qayta yarating:

```bash
npx @babel/cli app.jsx --presets @babel/preset-react -o app.js
# yoki:
npm i -D @babel/core @babel/cli @babel/preset-react
```

> Muhim: `@babel/preset-react` **classic** runtime'da ishlashi kerak (standart). Bu `React.createElement` chiqaradi — `react/jsx-runtime` importi qo'shilmaydi (aks holda sahifa oq bo'lib qoladi).

## Mahalliy sinov

`index.html` va `database.js` bitta papkada bo'lishi shart. Brauzer cheklovlari sababli to'g'ridan-to'g'ri ochish o'rniga kichik server ishlating:

```bash
python -m http.server 8000
# keyin: http://localhost:8000
```

---

## ⚠️ Xavfsizlik

- Anthropic kalitini **hech qachon** `index.html` yoki `database.js` ichiga yozmang. U faqat Worker secret'ida.
- Avval kalit ochiq kodda turgan bo'lsa (yoki birovga ko'rsatilgan bo'lsa) — uni **Anthropic Console'da bekor qilib, yangisini yarating** va **spend limit** qo'ying.
- `ALLOWED_ORIGIN` ni o'z domeningizga sozlash proxy'ni begona saytlardan himoya qiladi.
