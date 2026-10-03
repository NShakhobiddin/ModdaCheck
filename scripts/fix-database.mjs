// Bir martalik: bazani tozalash + savdo nomlarini qo'shish + bir xil formatda qayta yozish
// Ishga tushirish: node scripts/fix-database.mjs
import fs from 'node:fs';

const file = new URL('../database.js', import.meta.url);
const src = fs.readFileSync(file, 'utf8');
const sandbox = { window: {} };
new Function('window', src)(sandbox.window);
let DB = sandbox.window.TAQIQ_DATABASE;

const report = [];

// 1) sinonimlardagi bo'shliqlarni tozalash, bo'shlarini olib tashlash
for (const d of DB) {
  const before = JSON.stringify(d.aliases);
  d.aliases = d.aliases.map((a) => String(a).trim()).filter(Boolean);
  if (before !== JSON.stringify(d.aliases)) report.push(`trim aliases: id ${d.id} ${d.name}`);
}

// 2) Psevdoefedrin dublikati: 426 (prekursor) olib tashlanadi, 383 ga alsoIn qo'shiladi
const dup = DB.find((d) => d.id === 426);
const main = DB.find((d) => d.id === 383);
if (dup && main) {
  main.alsoIn = [dup.category];
  main.aliases = Array.from(new Set([...main.aliases, ...dup.aliases]));
  DB = DB.filter((d) => d.id !== 426);
  report.push('merged Psevdoefedrin 426 -> 383 (alsoIn prekursor)');
}

// 3) Savdo nomlari (tarkibida shu modda bo'lgan mashhur preparatlar).
//    Faqat keng tanilgan, bir ma'noli brendlar. (Ko'rsatma uchun; qonuniy maqom
//    kombinatsiya va dozaga bog'liq bo'lishi mumkin.)
const MEDICINES = {
  'Fenobarbital': ['Korvalol', 'Корвалол', 'Valokordin', 'Валокордин', 'Barboval', 'Valoserdin', 'Andipal', 'Bellataminal'],
  'Kodein': ['Kodelak', 'Коделак', 'Terpinkod', 'Терпинкод', 'Kodterpin', 'Nurofen Plus', 'Solpadeine', 'Pentalgin-N', 'Sedalgin-Neo', 'Tetralgin', 'Kaffetin', 'Co-codamol'],
  'Psevdoefedrin kombinatsiyalari': ['Sudafed', 'Koldakt', 'Coldact', 'Actifed', 'Clarinase', 'Cirrus'],
  'Tramadol': ['Zaldiar', 'Ultram', 'Tramacet'],
  'Efedrin': ['Bronholitin', 'Бронхолитин', 'Teofedrin'],
  'Zolpidem': ['Sanval', 'Zolsana', 'Nitrest'],
  'Fenazepam': ['Elzepam', 'Fenorelaxan', 'Tranquezipam'],
  'Sibutramin': ['Goldline', 'Meridia', 'Slimex'],
  'Ketamin': ['Ketalar'],
  'Metilfenidat (Ritalin)': ['Concerta'],
};
for (const [name, meds] of Object.entries(MEDICINES)) {
  const d = DB.find((x) => x.name === name);
  if (!d) { report.push(`!! NOT FOUND for medicines: ${name}`); continue; }
  const existing = new Set([d.name, ...d.aliases].map((s) => s.toLowerCase()));
  d.medicines = Array.from(new Set([...(d.medicines || []), ...meds.filter((m) => !existing.has(m.toLowerCase()))]));
  report.push(`medicines: ${name} += ${d.medicines.length}`);
}

// 4) Qayta yozish (bir xil, o'qiladigan format; kalit tartibi saqlanadi)
const q = (s) => JSON.stringify(s);
const lines = ['// MODDACHECK ma\'lumotlar bazasi. Avtomatik formatlangan: node scripts/fix-database.mjs',
  '// Maydonlar: id, name, aliases[], category, description, medicines[]?, alsoIn[]?',
  'window.TAQIQ_DATABASE = ['];
DB.forEach((d, i) => {
  lines.push('  {');
  lines.push(`    id: ${d.id},`);
  lines.push(`    name: ${q(d.name)},`);
  lines.push(`    aliases: [${d.aliases.map(q).join(', ')}],`);
  lines.push(`    category: ${q(d.category)},`);
  const tail = [];
  if (d.medicines && d.medicines.length) tail.push(`    medicines: [${d.medicines.map(q).join(', ')}]`);
  if (d.alsoIn && d.alsoIn.length) tail.push(`    alsoIn: [${d.alsoIn.map(q).join(', ')}]`);
  lines.push(`    description: ${q(d.description)}${tail.length ? ',' : ''}`);
  tail.forEach((t, k) => lines.push(t + (k < tail.length - 1 ? ',' : '')));
  lines.push('  }' + (i < DB.length - 1 ? ',' : ''));
});
lines.push('];', '');
fs.writeFileSync(file, lines.join('\n'));
console.log(report.join('\n'));
console.log(`\nDB entries now: ${DB.length}`);
