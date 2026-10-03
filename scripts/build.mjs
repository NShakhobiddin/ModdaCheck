// MODDACHECK build: src/ -> dist/  (npm run build)
//  • JSX -> JS (Babel, classic runtime, brauzerda Babel yo'q)
//  • Tailwind CSS oldindan kompilyatsiya (CDN yo'q)
//  • React/ReactDOM ni o'zimizda saqlash (oflayn uchun)
//  • Versiya xeshi, service worker precache ro'yxati
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const rm = (p) => fs.rmSync(p, { recursive: true, force: true });
const mk = (p) => fs.mkdirSync(p, { recursive: true });
const cp = (a, b) => { mk(path.dirname(b)); fs.copyFileSync(a, b); };
const read = (p) => fs.readFileSync(p, 'utf8');
const write = (p, s) => { mk(path.dirname(p)); fs.writeFileSync(p, s); };

rm(dist); mk(dist);

// 1) JSX -> JS
const babel = require('@babel/core');
// Tartib muhim: ikonkalar va illyustratsiyalar app.jsx dan oldin
const jsx = ['src/icons.jsx', 'src/illustrations.jsx', 'src/app.jsx'].map((f) => read(path.join(root, f))).join('\n;\n');
const compiled = babel.transformSync(jsx, {
  presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic' }]],
  filename: 'app.jsx', compact: false, comments: false,
}).code;
if (/(^|\n)\s*import\s|from ["']react\/jsx/.test(compiled)) throw new Error('Kompilyatsiya natijasida import bor — classic runtime talab qilinadi');
write(path.join(dist, 'app.js'), `/* generated from src/app.jsx — do not edit */\n${compiled}`);

// 2) Oddiy JS modullar
for (const f of ['matcher.js', 'i18n.js', 'markdown.js']) cp(path.join(root, 'src', f), path.join(dist, f));

// 3) Tailwind
const twBin = path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
execFileSync(process.execPath, [twBin, '-c', path.join(root, 'tailwind.config.js'), '-i', path.join(root, 'src/styles.css'), '-o', path.join(dist, 'styles.css'), '--minify'], { stdio: 'inherit', cwd: root });

// 4) Ma'lumotlar, public
cp(path.join(root, 'database.js'), path.join(dist, 'database.js'));
const pub = path.join(root, 'public');
const walk = (d, base = '') => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name), path.join(base, e.name)) : [path.join(base, e.name)]);
const publicFiles = walk(pub);
for (const rel of publicFiles) cp(path.join(pub, rel), path.join(dist, rel));

// 5) Vendor (React UMD) — "exports" xaritasi umd ni bermaydi, to'g'ridan-to'g'ri yo'l
const nm = path.join(root, 'node_modules');
const reactUmd = path.join(nm, 'react', 'umd', 'react.production.min.js');
const reactDomUmd = path.join(nm, 'react-dom', 'umd', 'react-dom.production.min.js');
for (const f of [reactUmd, reactDomUmd]) if (!fs.existsSync(f)) throw new Error('UMD topilmadi (react@18 kerak): ' + f);
cp(reactUmd, path.join(dist, 'vendor/react.js'));
cp(reactDomUmd, path.join(dist, 'vendor/react-dom.js'));

// 6) Versiya xeshi (kontentga bog'liq)
const hashed = ['app.js', 'matcher.js', 'i18n.js', 'markdown.js', 'styles.css', 'database.js'];
const h = crypto.createHash('sha1');
for (const f of hashed) h.update(fs.readFileSync(path.join(dist, f)));
h.update(read(path.join(root, 'index.html')));
const VERSION = h.digest('hex').slice(0, 8);
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// 7) index.html
let html = read(path.join(root, 'index.html'));
html = html.split('%%VERSION%%').join(VERSION).split('%%BUILD_DATE%%').join(BUILD_DATE).split('%%APP_SEMVER%%').join(pkg.version);
write(path.join(dist, 'index.html'), html);

// 8) Service worker
const precache = ['./', './index.html', ...hashed.map((f) => `./${f}?v=${VERSION}`), './vendor/react.js', './vendor/react-dom.js',
  ...publicFiles.map((f) => './' + f.split(path.sep).join('/'))];
let sw = read(path.join(root, 'src/sw.js'));
sw = sw.split('%%VERSION%%').join(VERSION).split('%%PRECACHE%%').join(JSON.stringify(precache));
write(path.join(dist, 'sw.js'), sw);

// 9) Pages uchun .nojekyll
write(path.join(dist, '.nojekyll'), '');

const size = (f) => (fs.statSync(path.join(dist, f)).size / 1024).toFixed(1) + ' KB';
console.log(`build ok  version=${VERSION}  date=${BUILD_DATE}`);
console.log(`  app.js ${size('app.js')} | styles.css ${size('styles.css')} | database.js ${size('database.js')} | react ${size('vendor/react.js')} + ${size('vendor/react-dom.js')}`);
