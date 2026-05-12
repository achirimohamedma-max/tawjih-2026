import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyPath = path.resolve(__dirname, '../../legacy/index.html');
const outPath = path.resolve(__dirname, '../src/data/questions.seed.json');

const html = fs.readFileSync(legacyPath, 'utf8');

const start = html.indexOf('const QDB=[');
if (start === -1) throw new Error('QDB not found in legacy/index.html');
const arrayStart = html.indexOf('[', start);

let depth = 0;
let inString = false;
let stringChar = null;
let escape = false;
let end = arrayStart;
for (let i = arrayStart; i < html.length; i++) {
  const c = html[i];
  if (escape) {
    escape = false;
    continue;
  }
  if (inString) {
    if (c === '\\') escape = true;
    else if (c === stringChar) inString = false;
    continue;
  }
  if (c === '"' || c === "'" || c === '`') {
    inString = true;
    stringChar = c;
    continue;
  }
  if (c === '[') depth++;
  else if (c === ']') {
    depth--;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const arrayLiteral = html.slice(arrayStart, end);

const sandbox = {};
vm.createContext(sandbox);
const QDB = vm.runInContext('(' + arrayLiteral + ')', sandbox);

const docs = QDB.map((q) => ({
  legacyId: q.id,
  ax: q.ax,
  sub: q.sub,
  diff: q.diff,
  src: q.src || '',
  cor: q.cor,
  isActive: true,
  text: { ar: q.text, fr: null, en: null },
  ch: { ar: q.ch, fr: null, en: null },
  exp: { ar: q.exp, fr: null, en: null },
  subN: { ar: q.subN, fr: null, en: null },
  type: q.type || null,
  series: q.series || null,
  grid: q.grid || null,
  cat: q.cat || null,
}));

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(docs, null, 2), 'utf8');
console.log(`✓ Extracted ${docs.length} questions → ${outPath}`);
