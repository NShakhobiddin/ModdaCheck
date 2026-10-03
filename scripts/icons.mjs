// PWA ikonkalarini public/icons/icon.svg dagi logotipdan PNG ga render qiladi.
// Ishga tushirish: npm i -D puppeteer && npm run icons
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'public/icons/icon.svg'), 'utf8');
const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const defs = (inner.match(/<defs>[\s\S]*?<\/defs>/) || [''])[0];
const body = inner.replace(defs, '').replace(/<rect[^>]*\/>/, ''); // fon to'rtburchagini olib tashlaymiz
const make = (size, scale) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${defs}<rect width="64" height="64" fill="url(#bg)"/><g transform="translate(32 32) scale(${scale}) translate(-32 -32)">${body}</g></svg>`;

async function main() {
  let puppeteer;
  try { puppeteer = (await import('puppeteer')).default; }
  catch { console.error('puppeteer topilmadi: npm i -D puppeteer'); process.exit(1); }
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  // full-bleed: OS burchaklarni o'zi yumaloqlaydi; maskable: belgi xavfsiz zonada (78%)
  for (const [size, file, scale] of [[192, 'icon-192.png', 1], [512, 'icon-512.png', 1], [512, 'icon-maskable-512.png', 0.78], [180, 'apple-touch-icon.png', 0.92]]) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0">${make(size, scale)}</body></html>`);
    await page.screenshot({ path: path.join(root, 'public/icons', file), clip: { x: 0, y: 0, width: size, height: size } });
    console.log('ok', file);
  }
  await browser.close();
}
main();
