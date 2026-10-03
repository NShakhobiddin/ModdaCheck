// Moslashtirish moduli testlari — `npm test`
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const M = require('../src/matcher.js');
global.window = {};
eval(fs.readFileSync(path.join(__dirname, '..', 'database.js'), 'utf8'));
const DB = global.window.TAQIQ_DATABASE;
const INDEX = M.buildIndex(DB);

const names = (list) => list.map((r) => (r.item || r).name);

test('normalize: apostrof, diakritik, kirill', () => {
  assert.equal(M.normalize("O‘zbekiston"), 'ozbekiston');
  assert.equal(M.normalize("o'zbekiston"), 'ozbekiston');
  assert.equal(M.normalize('Трамадол'), 'tramadol');
  assert.equal(M.normalize('Прегабалин 300 мг'), 'pregabalin 300 mg');
  assert.equal(M.normalize('  Café-Noir  '), 'cafe noir');
});

test('RASM: oddiy dorilar xavfli deb belgilanMAYDI', () => {
  const innocent = ['Paracetamol', 'Ibuprofen Junior', 'Vitamin C', 'Enjoy Cola', 'Nurofen',
    'Aspirin', 'Jivalik', 'Citramon', 'Loperamid', 'Amoxicillin', 'Oqdori sirop', 'No-shpa',
    'Analgin', 'Omeprazol', 'Vitamin D3', 'Smecta', 'Mezim'];
  for (const n of innocent) {
    const m = M.matchDetected(INDEX, n);
    assert.equal(m, null, `"${n}" noto'g'ri moslashdi: ${m && m.item.name} (${m && m.term})`);
  }
});

test('RASM: haqiqiy moddalar topiladi (aniq)', () => {
  const cases = [
    ['Tramadol', 'Tramadol'], ['TRAMADOL 50 mg', 'Tramadol'], ['Трамадол', 'Tramadol'],
    ['Pregabalin', 'Pregabalin'], ['Lirika 300', 'Pregabalin'], ['Lyrica', 'Pregabalin'],
    ['Diazepam', 'Diazepam'], ['Xanax', 'Alprazolam'], ['LSD', 'LSD'], ['Fenobarbital', 'Fenobarbital'],
    ['Codeine phosphate', 'Kodein fosfat'], ['Ketamine', 'Ketamin'],
  ];
  for (const [input, expected] of cases) {
    const m = M.matchDetected(INDEX, input);
    assert.ok(m, `"${input}" topilmadi`);
    assert.equal(m.item.name, expected, `"${input}" -> ${m.item.name}, kutilgan ${expected}`);
    assert.equal(m.tier, 'exact');
  }
});

test('RASM: xato yozilgan nom "ehtimoliy" sifatida topiladi', () => {
  const m = M.matchDetected(INDEX, 'Tramadoll');
  assert.ok(m && m.item.name === 'Tramadol');
  assert.equal(m.tier, 'fuzzy');
  const m2 = M.matchDetected(INDEX, 'Pregabaline');
  assert.ok(m2 && m2.item.name === 'Pregabalin');
});

test('RASM: 1-3 harfli jargon va oddiy so\'zlar moslashmaydi', () => {
  for (const n of ['J', 'A2', 'Oq', 'Qora', 'Tosh', 'Plan', 'Acid', 'Pot', 'Weed']) {
    assert.equal(M.matchDetected(INDEX, n), null, `"${n}" moslashmasligi kerak`);
  }
});

test('CHAT: begunoh jumlalar modda kontekstini chaqirMAYDI', () => {
  const sentences = ['Men javob kutyapman', "Qora choy olib o'tsam bo'ladimi?", 'Oq non va suv bor',
    'Bolam uchun yem oldim', "O't o'chirgich olib o'tish mumkinmi?", "Plan bo'yicha ketyapmiz",
    'Tosh bezak buyumlari', 'Salom, qalaysiz?', 'Xat yozdim', 'Vitamin C olib ketyapman'];
  for (const s of sentences) {
    const f = M.findInText(INDEX, s);
    assert.equal(f.length, 0, `"${s}" -> ${names(f).join(', ')}`);
  }
});

test('CHAT: haqiqiy modda nomlari topiladi', () => {
  assert.deepEqual(names(M.findInText(INDEX, "Lirika olib o'tsam bo'ladimi?")), ['Pregabalin']);
  assert.ok(names(M.findInText(INDEX, 'Трамадол ва диазепам бор')).includes('Tramadol'));
  assert.ok(names(M.findInText(INDEX, 'Трамадол ва диазепам бор')).includes('Diazepam'));
  assert.ok(names(M.findInText(INDEX, 'LSD nima?')).includes('LSD'));
});

test('QIDIRUV: kirill/lotin, apostrof, prefiks saralash', () => {
  assert.equal(M.search(INDEX, 'трамадол')[0].item.name, 'Tramadol');
  assert.equal(M.search(INDEX, 'tramad')[0].item.name, 'Tramadol');
  assert.equal(M.search(INDEX, 'lirika')[0].item.name, 'Pregabalin');
  assert.ok(M.search(INDEX, 'kodein').length >= 3);
  assert.equal(M.search(INDEX, '').length, 0);
});

test('QIDIRUV: sinonim/brend orqali topilganda term qaytariladi', () => {
  const r = M.search(INDEX, 'lirika')[0];
  assert.equal(r.item.name, 'Pregabalin');
  assert.equal(r.term, 'Lirika');
  assert.equal(M.search(INDEX, 'Pregabalin')[0].term, null);
  const k = M.search(INDEX, 'korvalol')[0];
  assert.equal(k.item.name, 'Fenobarbital');
  assert.equal(k.term, 'Korvalol');
});

test('fuzzy budjet uzunlikka bog\'liq', () => {
  assert.equal(M.fuzzyBudget(5), 0);
  assert.equal(M.fuzzyBudget(7), 1);
  assert.equal(M.fuzzyBudget(10), 2);
  assert.equal(M.editDistance('nurofen', 'aprofen', 2), 2);
});
