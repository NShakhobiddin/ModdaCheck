// PWA ikonkalarini SVG dan PNG ga render qiladi (puppeteer). Ishga tushirish: npm run icons
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(root, 'public/icons/icon.svg'), 'utf8');

async function main() {
  let puppeteer;
  try { puppeteer = (await import('puppeteer')).default; }
  catch { console.error('puppeteer topilmadi: npm i -D puppeteer'); process.exit(1); }
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const render = async (size, file, pad = 0) => {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    const inner = size - pad * 2;
    await page.setContent(`<html><body style="margin:0;background:#0f172a;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">
      <div style="width:${inner}px;height:${inner}px">${svg.replace('width="64" height="64"', `width="${inner}" height="${inner}"`)}</div></body></html>`);
    await page.screenshot({ path: path.join(root, 'public/icons', file), clip: { x: 0, y: 0, width: size, height: size } });
    console.log('ok', file);
  };
  await render(192, 'icon-192.png');
  await render(512, 'icon-512.png');
  await render(512, 'icon-maskable-512.png', 64); // maskable: xavfsiz zona uchun chekka
  await render(180, 'apple-touch-icon.png');
  await browser.close();
}
main();
