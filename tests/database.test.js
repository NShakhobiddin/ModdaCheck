// Ma'lumotlar bazasi sxemasi va sifati testlari — `npm test`
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'database.js'), 'utf8'));
const DB = global.window.TAQIQ_DATABASE;

// WARNING_TYPES kalitlarini app.jsx dan olamiz (bitta manba)
const app = fs.readFileSync(path.join(__dirname, '..', 'src', 'app.jsx'), 'utf8');
const block = app.match(/const WARNING_TYPES = \{([\s\S]*?)\n\s*\};/);
const CATEGORIES = [...block[1].matchAll(/^\s*"([^"]+)":\s*\{/gm)].map((m) => m[1]);

test('baza yuklanadi va bo\'sh emas', () => {
  assert.ok(Array.isArray(DB) && DB.length > 400);
  assert.ok(CATEGORIES.length === 5, 'WARNING_TYPES 5 ta bo\'lishi kerak');
});

test('har bir yozuvda majburiy maydonlar bor', () => {
  for (const d of DB) {
    assert.ok(Number.isInteger(d.id) && d.id > 0, `id noto'g'ri: ${JSON.stringify(d).slice(0, 80)}`);
    assert.ok(typeof d.name === 'string' && d.name.trim(), `name yo'q: id ${d.id}`);
    assert.ok(Array.isArray(d.aliases), `aliases massiv emas: id ${d.id}`);
    assert.ok(typeof d.description === 'string' && d.description.trim(), `description yo'q: id ${d.id}`);
    if (d.medicines) assert.ok(Array.isArray(d.medicines), `medicines massiv emas: id ${d.id}`);
    if (d.alsoIn) assert.ok(Array.isArray(d.alsoIn), `alsoIn massiv emas: id ${d.id}`);
  }
});

test('kategoriyalar WARNING_TYPES bilan aynan mos', () => {
  for (const d of DB) {
    assert.ok(CATEGORIES.includes(d.category), `Noma'lum kategoriya (id ${d.id}): ${d.category}`);
    for (const c of d.alsoIn || []) assert.ok(CATEGORIES.includes(c), `alsoIn noma'lum (id ${d.id}): ${c}`);
  }
});

test('id va nomlar takrorlanmaydi', () => {
  const ids = new Set(), names = new Map();
  for (const d of DB) {
    assert.ok(!ids.has(d.id), `takroriy id ${d.id}`);
    ids.add(d.id);
    const k = d.name.trim().toLowerCase();
    assert.ok(!names.has(k), `takroriy nom "${d.name}" (id ${names.get(k)} va ${d.id})`);
    names.set(k, d.id);
  }
});

test('bo\'sh yoki bo\'shliqli sinonimlar yo\'q', () => {
  for (const d of DB) {
    for (const a of [...d.aliases, ...(d.medicines || [])]) {
      assert.ok(typeof a === 'string' && a.trim() === a && a.length > 0, `yomon sinonim id ${d.id}: ${JSON.stringify(a)}`);
    }
  }
});
